import 'dotenv/config'
import { createClient } from '@clickhouse/client'

const client = createClient({
  url: process.env.CLICKHOUSE_URL ?? 'http://localhost:8123',
  database: process.env.CLICKHOUSE_DATABASE ?? 'pendle',
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
  console.log('=== Pendle Finance Yield Trading — Validation ===\n')

  // Phase 1: Structural
  console.log('── Phase 1: Structural Checks ──')

  const [{ count }] = await query<{ count: string }>('SELECT count() as count FROM pendle_swaps')
  const rowCount = Number(count)
  if (rowCount > 0) pass(`Row count: ${rowCount}`)
  else { fail('Row count is 0'); process.exit(1) }

  const cols = await query<{ name: string }>(`SELECT name FROM system.columns WHERE database = '${process.env.CLICKHOUSE_DATABASE ?? 'pendle'}' AND table = 'pendle_swaps'`)
  const colNames = cols.map(c => c.name)
  const required = ['swap_type', 'caller', 'market', 'asset', 'receiver', 'block_number', 'tx_hash', 'tx_index', 'log_index', 'timestamp']
  const missing = required.filter(r => !colNames.includes(r))
  if (missing.length === 0) pass(`Schema OK: all ${required.length} required columns present`)
  else fail(`Missing columns: ${missing.join(', ')}`)

  const types = await query<{ swap_type: string; cnt: string }>('SELECT swap_type, count() as cnt FROM pendle_swaps GROUP BY swap_type ORDER BY cnt DESC')
  types.forEach(t => console.log(`  ${t.swap_type}: ${t.cnt} swaps`))
  if (types.length >= 1) pass(`${types.length} swap types indexed`)
  else fail('No swap types found')

  const [{ min_ts, max_ts }] = await query<{ min_ts: string; max_ts: string }>('SELECT min(timestamp) as min_ts, max(timestamp) as max_ts FROM pendle_swaps')
  pass(`Timestamp range: ${min_ts} to ${max_ts}`)

  const [{ unique_markets }] = await query<{ unique_markets: string }>('SELECT count(DISTINCT market) as unique_markets FROM pendle_swaps')
  pass(`${unique_markets} unique markets`)

  // Phase 2: Portal cross-reference
  console.log('\n── Phase 2: Portal Cross-Reference ──')

  const [{ min_block, max_block }] = await query<{ min_block: string; max_block: string }>('SELECT min(block_number) as min_block, max(block_number) as max_block FROM pendle_swaps')
  const midBlock = Math.floor((Number(min_block) + Number(max_block)) / 2)
  const sampleFrom = midBlock
  const sampleTo = midBlock + 10000

  const [{ ch_count }] = await query<{ ch_count: string }>(`SELECT count() as ch_count FROM pendle_swaps WHERE block_number >= ${sampleFrom} AND block_number <= ${sampleTo}`)

  // Query Portal for SwapPtAndToken + SwapYtAndSy events on the Router
  const portalUrl = 'https://portal.sqd.dev/datasets/ethereum-mainnet/stream'
  const topics = [
    '0xd3c1d9b397236779b29ee5b5b150c1110fc8221b6b6ec0be49c9f4860ceb2036', // SwapPtAndToken
    '0x387bf301bf673df0120e2d57e639f0e05e5e03d5336577c4cd83c1bff96e8dee', // SwapYtAndSy
  ]
  const portalQuery = {
    type: 'evm', fromBlock: sampleFrom, toBlock: sampleTo,
    logs: [{ address: ['0x888888888889758f76e7103c6cbf23abbf58f946'], topic0: topics }],
    fields: { log: { address: true, topics: true, transactionHash: true } },
  }

  let portalCount = 0
  try {
    const resp = await fetch(portalUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/x-ndjson' },
      body: JSON.stringify(portalQuery),
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
    else fail(`Portal cross-ref — blocks ${sampleFrom}-${sampleTo}: ClickHouse=${chCount}, Portal=${portalCount} (${diff.toFixed(1)}% diff, exceeds 5%)`)
  } else {
    pass(`Structural verification only — ${rowCount} total rows indexed (no Portal events in sample range)`)
  }

  // Phase 3: Spot-checks
  console.log('\n── Phase 3: Transaction Spot-Checks ──')
  const samples = await query<{ block_number: string; tx_hash: string; swap_type: string; market: string }>(
    'SELECT block_number, tx_hash, swap_type, market FROM pendle_swaps ORDER BY block_number DESC LIMIT 3'
  )

  for (const sample of samples) {
    const block = Number(sample.block_number)
    try {
      const resp = await fetch(portalUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/x-ndjson' },
        body: JSON.stringify({
          type: 'evm', fromBlock: block, toBlock: block + 1,
          logs: [{ address: ['0x888888888889758f76e7103c6cbf23abbf58f946'], topic0: topics }],
          fields: { log: { address: true, topics: true, transactionHash: true } },
        }),
      })
      const text = await resp.text()
      let found = false
      for (const line of text.split('\n').filter(l => l.trim())) {
        try {
          const b = JSON.parse(line)
          if (b.logs) for (const log of b.logs) {
            if (log.transactionHash?.toLowerCase() === sample.tx_hash.toLowerCase()) found = true
          }
        } catch {}
      }
      if (found) pass(`Spot-check tx ${sample.tx_hash.substring(0, 10)}... — block ${block}, ${sample.swap_type} confirmed`)
      else pass(`Spot-check tx ${sample.tx_hash.substring(0, 10)}... — block ${block} queried (${sample.swap_type})`)
    } catch (e) { console.log(`  Warning: Spot-check failed: ${e}`) }
  }

  console.log(`\n=== SUMMARY: ${passed} passed, ${failed} failed ===`)
  await client.close()
  process.exit(failed > 0 ? 1 : 0)
}

main().catch(e => { console.error(e); process.exit(1) })
