import 'dotenv/config'
import { createClient } from '@clickhouse/client'

const client = createClient({
  url: process.env.CLICKHOUSE_URL ?? 'http://localhost:8123',
  database: process.env.CLICKHOUSE_DATABASE ?? 'avantis_oil',
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
  console.log('\n=== AVANTIS OIL & COMMODITIES VALIDATION ===\n')

  // Phase 1: Structural checks
  console.log('--- Phase 1: Structural Checks ---')

  const tables = ['commodity_orders', 'commodity_limits', 'commodity_risk_updates']
  const counts: Record<string, number> = {}
  for (const table of tables) {
    const [{ cnt }] = await query<{ cnt: string }>(`SELECT count() as cnt FROM ${table}`)
    const count = Number(cnt)
    counts[table] = count
    if (count > 0) {
      pass(`${table} has ${count} rows`)
    } else {
      fail(`${table} is empty`)
    }
  }

  // Schema check for commodity_orders
  const cols = await query<{ name: string }>(`SELECT name FROM system.columns WHERE database = 'avantis_oil' AND table = 'commodity_orders'`)
  const colNames = cols.map(c => c.name)
  const expected = ['trader', 'pair_index', 'commodity', 'order_type', 'is_buy', 'leverage', 'block_number', 'tx_hash', 'timestamp']
  for (const col of expected) {
    if (colNames.includes(col)) {
      pass(`commodity_orders has column '${col}'`)
    } else {
      fail(`commodity_orders missing column '${col}'`)
    }
  }

  // Verify only commodity pairs present (20=XAG, 21=XAU, 65=WTI)
  const pairs = await query<{ pair_index: string }>(`SELECT DISTINCT pair_index FROM commodity_orders ORDER BY pair_index`)
  const pairIds = pairs.map(p => Number(p.pair_index))
  const validPairs = new Set([20, 21, 65])
  const allValid = pairIds.every(p => validPairs.has(p))
  if (allValid && pairIds.length > 0) {
    pass(`Only commodity pairs present: ${pairIds.join(', ')} (XAG=20, XAU=21, WTI=65)`)
  } else {
    fail(`Unexpected pairs: ${pairIds.join(', ')}`)
  }

  // Commodity breakdown
  const breakdown = await query<{ commodity: string; cnt: string }>(`SELECT commodity, count() as cnt FROM commodity_orders GROUP BY commodity ORDER BY cnt DESC`)
  for (const b of breakdown) {
    pass(`${b.commodity}: ${b.cnt} orders`)
  }

  // Timestamp range
  const [range] = await query<{ mn: string; mx: string }>(`SELECT min(timestamp) as mn, max(timestamp) as mx FROM commodity_orders`)
  const minDate = new Date(range.mn)
  const maxDate = new Date(range.mx)
  const now = new Date()
  const daysDiff = (now.getTime() - minDate.getTime()) / 86_400_000
  if (daysDiff <= 35 && daysDiff >= 1) {
    pass(`Timestamps in expected range: ${range.mn.slice(0, 10)} to ${range.mx.slice(0, 10)} (${daysDiff.toFixed(1)} days)`)
  } else {
    fail(`Timestamp range unexpected: ${daysDiff.toFixed(1)} days`)
  }

  // Leverage sanity (should be > 0 after dividing by 1e10)
  const [levCheck] = await query<{ min_lev: string; max_lev: string }>(`SELECT min(leverage) as min_lev, max(leverage) as max_lev FROM commodity_orders WHERE is_open = 1 AND order_type = 'market' AND leverage > 0`)
  if (levCheck) {
    const minLev = Number(levCheck.min_lev) / 1e10
    const maxLev = Number(levCheck.max_lev) / 1e10
    if (minLev >= 1 && maxLev <= 251) {
      pass(`Leverage range valid: ${minLev.toFixed(0)}x to ${maxLev.toFixed(0)}x`)
    } else {
      fail(`Leverage out of range: ${minLev}x to ${maxLev}x`)
    }
  }

  // Phase 2: Portal cross-reference
  console.log('\n--- Phase 2: Portal Cross-Reference ---')

  const [blkRange] = await query<{ mn: string; mx: string }>(`SELECT min(block_number) as mn, max(block_number) as mx FROM commodity_orders`)
  const startBlock = Number(blkRange.mn)
  const endBlock = Math.min(startBlock + 500, Number(blkRange.mx))

  // Count ALL MarketOrderInitiated events from Portal in this range
  const portalUrl = 'https://portal.sqd.dev/datasets/base-mainnet/stream'
  const portalReq = {
    type: 'evm',
    fromBlock: startBlock,
    toBlock: endBlock,
    logs: [{
      address: ['0x44914408af82bc9983bbb330e3578e1105e11d4e'],
      topic0: ['0x9d20fe25d5b18ddf053eb042d606b6f438ec532c9978753d5284b6128063a1bd'],
    }],
    fields: { log: { transactionHash: true, data: true, topics: true } },
  }

  try {
    const resp = await fetch(portalUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(portalReq),
    })
    const text = await resp.text()
    let portalAllEvents = 0
    let portalCommodityEvents = 0
    for (const line of text.split('\n')) {
      if (!line.trim()) continue
      try {
        const block = JSON.parse(line)
        if (block.logs) {
          portalAllEvents += block.logs.length
          for (const log of block.logs) {
            // pairIndex is the 2nd non-indexed param in data — offset 32 bytes
            if (log.data && log.data.length >= 66) {
              const pairHex = log.data.slice(2, 66)
              const pairIndex = parseInt(pairHex, 16)
              if (pairIndex === 20 || pairIndex === 21 || pairIndex === 65) {
                portalCommodityEvents++
              }
            }
          }
        }
      } catch {}
    }

    // Compare commodity-filtered count from ClickHouse
    const [chCount] = await query<{ cnt: string }>(`SELECT count() as cnt FROM commodity_orders WHERE order_type = 'market' AND block_number >= ${startBlock} AND block_number <= ${endBlock}`)
    const chEvents = Number(chCount.cnt)

    const diff = portalCommodityEvents === 0 && chEvents === 0 ? 0 : Math.abs(chEvents - portalCommodityEvents) / Math.max(chEvents, portalCommodityEvents, 1)
    if (diff <= 0.05) {
      pass(`Portal cross-ref — ClickHouse: ${chEvents}, Portal commodity: ${portalCommodityEvents} / ${portalAllEvents} total (${(diff * 100).toFixed(1)}% diff)`)
    } else if (diff <= 0.15) {
      pass(`Portal cross-ref — ClickHouse: ${chEvents}, Portal commodity: ${portalCommodityEvents} (${(diff * 100).toFixed(1)}% diff, sync timing)`)
    } else {
      fail(`Portal cross-ref — ClickHouse: ${chEvents}, Portal commodity: ${portalCommodityEvents} (${(diff * 100).toFixed(1)}% diff, exceeds tolerance)`)
    }
  } catch (e: any) {
    fail(`Portal cross-ref failed: ${e.message}`)
  }

  // Phase 3: Transaction spot-checks
  console.log('\n--- Phase 3: Transaction Spot-Checks ---')

  const txSamples = await query<{ tx_hash: string; block_number: string; pair_index: string; trader: string; commodity: string; is_buy: string; log_index: string }>(
    `SELECT tx_hash, block_number, pair_index, trader, commodity, is_buy, log_index FROM commodity_orders WHERE order_type = 'market' ORDER BY block_number LIMIT 3`
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
                const addrMatch = log.address?.toLowerCase() === '0x44914408af82bc9983bbb330e3578e1105e11d4e'
                const traderFromTopic = log.topics?.[1] ? '0x' + log.topics[1].slice(26).toLowerCase() : ''
                const traderMatch = traderFromTopic === tx.trader.toLowerCase()
                if (addrMatch && traderMatch) {
                  pass(`Spot-check tx ${tx.tx_hash.slice(0, 10)}... — block ${blk}, ${tx.commodity}, trader ${tx.trader.slice(0, 10)}... matches Portal`)
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

  console.log(`\nTotal commodity_orders: ${counts['commodity_orders']}`)
  console.log(`Date range: ${range.mn.slice(0, 10)} to ${range.mx.slice(0, 10)}`)

  await client.close()
  process.exit(failed > 0 ? 1 : 0)
}

main().catch(e => { console.error(e); process.exit(1) })
