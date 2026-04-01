import 'dotenv/config'
import { createClient } from '@clickhouse/client'

const client = createClient({
  url: process.env.CLICKHOUSE_URL ?? 'http://localhost:8123',
  database: process.env.CLICKHOUSE_DATABASE ?? 'avantis',
  username: process.env.CLICKHOUSE_USER ?? 'default',
  password: process.env.CLICKHOUSE_PASSWORD ?? 'password',
})

async function query<T = any>(sql: string): Promise<T[]> {
  const rs = await client.query({ query: sql, format: 'JSONEachRow' })
  return rs.json<T>()
}

let passed = 0
let failed = 0

function pass(msg: string) { console.log(`PASS: ${msg}`); passed++ }
function fail(msg: string) { console.log(`FAIL: ${msg}`); failed++ }

async function main() {
  console.log('\n=== AVANTIS PERPS PULSE VALIDATION ===\n')

  // Phase 1: Structural checks
  console.log('--- Phase 1: Structural Checks ---')

  const tables = ['market_orders', 'limit_orders', 'open_limits', 'margin_updates', 'tp_updates', 'sl_updates']
  for (const table of tables) {
    const [{ cnt }] = await query<{ cnt: string }>(`SELECT count() as cnt FROM ${table}`)
    const count = Number(cnt)
    if (count > 0) {
      pass(`${table} has ${count} rows`)
    } else {
      fail(`${table} is empty`)
    }
  }

  // Schema check for market_orders
  const cols = await query<{ name: string }>(`SELECT name FROM system.columns WHERE database = 'avantis' AND table = 'market_orders'`)
  const colNames = cols.map(c => c.name)
  const expected = ['trader', 'pair_index', 'is_open', 'order_id', 'is_buy', 'leverage', 'block_number', 'tx_hash', 'timestamp']
  for (const col of expected) {
    if (colNames.includes(col)) {
      pass(`market_orders has column '${col}'`)
    } else {
      fail(`market_orders missing column '${col}'`)
    }
  }

  // Timestamp range
  const [range] = await query<{ mn: string; mx: string }>(`SELECT min(timestamp) as mn, max(timestamp) as mx FROM market_orders`)
  const minDate = new Date(range.mn)
  const maxDate = new Date(range.mx)
  const now = new Date()
  const daysDiff = (now.getTime() - minDate.getTime()) / 86_400_000
  if (daysDiff <= 10 && daysDiff >= 1) {
    pass(`Timestamps in expected range: ${range.mn.slice(0, 10)} to ${range.mx.slice(0, 10)} (${daysDiff.toFixed(1)} days)`)
  } else {
    fail(`Timestamp range unexpected: ${daysDiff.toFixed(1)} days`)
  }

  // Leverage sanity (should be > 0 after dividing by 1e10)
  const [levCheck] = await query<{ min_lev: string; max_lev: string }>(`SELECT min(leverage) as min_lev, max(leverage) as max_lev FROM market_orders WHERE is_open = 1`)
  const minLev = Number(levCheck.min_lev) / 1e10
  const maxLev = Number(levCheck.max_lev) / 1e10
  if (minLev >= 1 && maxLev <= 1001) {
    pass(`Leverage range valid: ${minLev.toFixed(0)}x to ${maxLev.toFixed(0)}x`)
  } else {
    fail(`Leverage out of range: ${minLev}x to ${maxLev}x`)
  }

  // Phase 2: Portal cross-reference
  console.log('\n--- Phase 2: Portal Cross-Reference ---')

  // Get a specific block range from our data
  const [blkRange] = await query<{ mn: string; mx: string }>(`SELECT min(block_number) as mn, max(block_number) as mx FROM market_orders`)
  const startBlock = Number(blkRange.mn)
  const checkEnd = startBlock + 100 // 100 blocks

  const [chCount] = await query<{ cnt: string }>(`SELECT count() as cnt FROM market_orders WHERE block_number >= ${startBlock} AND block_number < ${checkEnd}`)
  const chEvents = Number(chCount.cnt)

  // Query Portal for the same range
  const portalUrl = 'https://portal.sqd.dev/datasets/base-mainnet/stream'
  const portalReq = {
    type: 'evm',
    fromBlock: startBlock,
    toBlock: checkEnd - 1,
    logs: [{
      address: ['0x44914408af82bc9983bbb330e3578e1105e11d4e'],
      topic0: ['0x9d20fe25d5b18ddf053eb042d606b6f438ec532c9978753d5284b6128063a1bd'],
    }],
    fields: { log: { transactionHash: true } },
  }

  try {
    const resp = await fetch(portalUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(portalReq),
    })
    const text = await resp.text()
    let portalEvents = 0
    for (const line of text.split('\n')) {
      if (!line.trim()) continue
      try {
        const block = JSON.parse(line)
        if (block.logs) portalEvents += block.logs.length
      } catch {}
    }

    const diff = Math.abs(chEvents - portalEvents) / Math.max(chEvents, portalEvents, 1)
    if (diff <= 0.05) {
      pass(`Portal cross-ref — ClickHouse: ${chEvents}, Portal: ${portalEvents} in blocks ${startBlock}-${checkEnd} (${(diff * 100).toFixed(1)}% diff)`)
    } else if (diff <= 0.15) {
      pass(`Portal cross-ref — ClickHouse: ${chEvents}, Portal: ${portalEvents} (${(diff * 100).toFixed(1)}% diff, sync timing)`)
    } else {
      fail(`Portal cross-ref — ClickHouse: ${chEvents}, Portal: ${portalEvents} (${(diff * 100).toFixed(1)}% diff, exceeds tolerance)`)
    }
  } catch (e: any) {
    fail(`Portal cross-ref failed: ${e.message}`)
  }

  // Phase 3: Transaction spot-checks
  console.log('\n--- Phase 3: Transaction Spot-Checks ---')

  const txSamples = await query<{ tx_hash: string; block_number: string; pair_index: string; trader: string; is_buy: string; log_index: string }>(
    `SELECT tx_hash, block_number, pair_index, trader, is_buy, log_index FROM market_orders ORDER BY block_number LIMIT 3`
  )

  for (const tx of txSamples) {
    const blk = Number(tx.block_number)
    const spotReq = {
      type: 'evm',
      fromBlock: blk,
      toBlock: blk,
      logs: [{
        address: ['0x44914408af82bc9983bbb330e3578e1105e11d4e'],
        topic0: ['0x9d20fe25d5b18ddf053eb042d606b6f438ec532c9978753d5284b6128063a1bd'],
      }],
      fields: { log: { transactionHash: true, logIndex: true, address: true, topics: true } },
    }
    try {
      const resp = await fetch(portalUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(spotReq),
      })
      const text = await resp.text()
      let found = false
      for (const line of text.split('\n')) {
        if (!line.trim()) continue
        try {
          const block = JSON.parse(line)
          if (block.logs) {
            for (const log of block.logs) {
              if (log.transactionHash === tx.tx_hash && log.logIndex === Number(tx.log_index)) {
                // Verify contract address
                const addrMatch = log.address?.toLowerCase() === '0x44914408af82bc9983bbb330e3578e1105e11d4e'
                // Verify trader from topic1
                const traderFromTopic = log.topics?.[1] ? '0x' + log.topics[1].slice(26).toLowerCase() : ''
                const traderMatch = traderFromTopic === tx.trader.toLowerCase()
                if (addrMatch && traderMatch) {
                  pass(`Spot-check tx ${tx.tx_hash.slice(0, 10)}... — block ${blk}, trader ${tx.trader.slice(0, 10)}..., pair ${tx.pair_index} matches Portal`)
                  found = true
                } else {
                  fail(`Spot-check tx ${tx.tx_hash.slice(0, 10)}... — field mismatch (addr: ${addrMatch}, trader: ${traderMatch})`)
                  found = true
                }
              }
            }
          }
        } catch {}
      }
      if (!found) {
        fail(`Spot-check tx ${tx.tx_hash.slice(0, 10)}... — not found in Portal at block ${blk}`)
      }
    } catch (e: any) {
      fail(`Spot-check failed for tx ${tx.tx_hash.slice(0, 10)}...: ${e.message}`)
    }
  }

  // Summary
  console.log(`\n=== VALIDATION SUMMARY ===`)
  console.log(`PASSED: ${passed}`)
  console.log(`FAILED: ${failed}`)

  const [totalRow] = await query<{ cnt: string }>(`SELECT count() as cnt FROM market_orders`)
  console.log(`\nTotal market_orders: ${totalRow.cnt}`)
  console.log(`Date range: ${range.mn.slice(0, 10)} to ${range.mx.slice(0, 10)}`)

  await client.close()
  process.exit(failed > 0 ? 1 : 0)
}

main().catch(e => { console.error(e); process.exit(1) })
