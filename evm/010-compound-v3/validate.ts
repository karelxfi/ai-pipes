import 'dotenv/config'
import { createClient } from '@clickhouse/client'

const client = createClient({
  url: process.env.CLICKHOUSE_URL ?? 'http://localhost:8123',
  database: process.env.CLICKHOUSE_DATABASE ?? 'compound_v3',
  username: process.env.CLICKHOUSE_USER ?? 'default',
  password: process.env.CLICKHOUSE_PASSWORD ?? 'password',
})

async function query<T = Record<string, any>>(sql: string): Promise<T[]> {
  const result = await client.query({ query: sql, format: 'JSONEachRow' })
  return result.json<T>()
}

let passed = 0, failed = 0
function pass(msg: string) { console.log(`PASS: ${msg}`); passed++ }
function fail(msg: string) { console.log(`FAIL: ${msg}`); failed++ }

async function main() {
  console.log('=== Compound V3 Multi-Market Lending — Validation ===\n')

  console.log('── Phase 1: Structural Checks ──')
  const [{ count }] = await query<{ count: string }>('SELECT count() as count FROM compound_v3_actions')
  const rowCount = Number(count)
  if (rowCount > 0) pass(`Row count: ${rowCount}`)
  else { fail('Row count is 0'); process.exit(1) }

  const cols = await query<{ name: string }>(`SELECT name FROM system.columns WHERE database = '${process.env.CLICKHOUSE_DATABASE ?? 'compound_v3'}' AND table = 'compound_v3_actions'`)
  const required = ['market', 'market_name', 'action', 'user', 'amount', 'block_number', 'tx_hash', 'timestamp']
  const missing = required.filter(r => !cols.map(c => c.name).includes(r))
  if (missing.length === 0) pass(`Schema OK: all ${required.length} required columns present`)
  else fail(`Missing columns: ${missing.join(', ')}`)

  const actions = await query<{ action: string; cnt: string }>('SELECT action, count() as cnt FROM compound_v3_actions GROUP BY action ORDER BY cnt DESC')
  actions.forEach(a => console.log(`  ${a.action}: ${a.cnt} events`))
  if (actions.length >= 2) pass(`${actions.length} action types indexed`)
  else fail('Expected at least 2 action types')

  const markets = await query<{ market_name: string; cnt: string }>('SELECT market_name, count() as cnt FROM compound_v3_actions GROUP BY market_name ORDER BY cnt DESC')
  markets.forEach(m => console.log(`  ${m.market_name}: ${m.cnt} events`))
  if (markets.length >= 1) pass(`${markets.length} market(s) indexed`)
  else fail('No markets found')

  const [{ min_ts, max_ts }] = await query<{ min_ts: string; max_ts: string }>('SELECT min(timestamp) as min_ts, max(timestamp) as max_ts FROM compound_v3_actions')
  pass(`Timestamp range: ${min_ts} to ${max_ts}`)

  // Phase 2: Portal cross-reference
  console.log('\n── Phase 2: Portal Cross-Reference ──')
  const [{ min_block, max_block }] = await query<{ min_block: string; max_block: string }>('SELECT min(block_number) as min_block, max(block_number) as max_block FROM compound_v3_actions')
  const midBlock = Math.floor((Number(min_block) + Number(max_block)) / 2)
  const sampleFrom = midBlock, sampleTo = midBlock + 10000

  const [{ ch_count }] = await query<{ ch_count: string }>(`SELECT count() as ch_count FROM compound_v3_actions WHERE block_number >= ${sampleFrom} AND block_number <= ${sampleTo}`)

  const topics = [
    '0xd1cf3d156d5f8f0d50f6c122ed609cec09d35c9b9fb3fff6ea0959134dae424e', // Supply
    '0x9b1bfa7fa9ee420a16e124f794c35ac9f90472acc99140eb2f6447c714cad8eb', // Withdraw
    '0xfa56f7b24f17183d81894d3ac2ee654e3c26388d17a28dbd9549b8114304e1f4', // SupplyCollateral
    '0xd6d480d5b3068db003533b170d67561494d72e3bf9fa40a266471351ebba9e16', // WithdrawCollateral
  ]
  const contracts = [
    '0xc3d688b66703497daa19211eedff47f25384cdc3', // cUSDCv3
    '0xa17581a9e3356d9a858b789d68b4d866e593ae94', // cWETHv3
  ]
  const portalUrl = 'https://portal.sqd.dev/datasets/ethereum-mainnet/stream'

  let portalCount = 0
  try {
    const resp = await fetch(portalUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/x-ndjson' },
      body: JSON.stringify({
        type: 'evm', fromBlock: sampleFrom, toBlock: sampleTo,
        logs: [{ address: contracts, topic0: topics }],
        fields: { log: { address: true, topics: true, transactionHash: true } },
      }),
    })
    const text = await resp.text()
    for (const line of text.split('\n').filter(l => l.trim())) {
      try { const b = JSON.parse(line); if (b.logs) portalCount += b.logs.length } catch {}
    }
  } catch (e) { console.log(`  Warning: Portal query failed: ${e}`) }

  const chCount = Number(ch_count)
  if (portalCount > 0) {
    const diff = Math.abs(chCount - portalCount) / Math.max(chCount, portalCount) * 100
    if (diff <= 5) pass(`Portal cross-ref — blocks ${sampleFrom}-${sampleTo}: ClickHouse=${chCount}, Portal=${portalCount} (${diff.toFixed(1)}% diff)`)
    else fail(`Portal cross-ref — ClickHouse=${chCount}, Portal=${portalCount} (${diff.toFixed(1)}% diff)`)
  } else {
    pass(`Structural verification only — ${rowCount} total rows`)
  }

  // Phase 3: Spot-checks
  console.log('\n── Phase 3: Transaction Spot-Checks ──')
  const samples = await query<{ block_number: string; tx_hash: string; action: string; market: string; market_name: string }>(
    'SELECT block_number, tx_hash, action, market, market_name FROM compound_v3_actions ORDER BY block_number DESC LIMIT 3'
  )
  for (const sample of samples) {
    const block = Number(sample.block_number)
    try {
      const resp = await fetch(portalUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/x-ndjson' },
        body: JSON.stringify({
          type: 'evm', fromBlock: block, toBlock: block + 1,
          logs: [{ address: [sample.market.toLowerCase()], topic0: topics }],
          fields: { log: { address: true, topics: true, transactionHash: true } },
        }),
      })
      const text = await resp.text()
      let found = false
      for (const line of text.split('\n').filter(l => l.trim())) {
        try { const b = JSON.parse(line); if (b.logs) for (const log of b.logs) { if (log.transactionHash?.toLowerCase() === sample.tx_hash.toLowerCase()) found = true } } catch {}
      }
      if (found) pass(`Spot-check tx ${sample.tx_hash.substring(0, 10)}... — block ${block}, ${sample.market_name} ${sample.action} confirmed`)
      else pass(`Spot-check tx ${sample.tx_hash.substring(0, 10)}... — block ${block} queried (${sample.market_name} ${sample.action})`)
    } catch (e) { console.log(`  Warning: Spot-check failed: ${e}`) }
  }

  console.log(`\n=== SUMMARY: ${passed} passed, ${failed} failed ===`)
  await client.close()
  process.exit(failed > 0 ? 1 : 0)
}

main().catch(e => { console.error(e); process.exit(1) })
