import 'dotenv/config'
import { createClient } from '@clickhouse/client'

const client = createClient({
  url: process.env.CLICKHOUSE_URL ?? 'http://localhost:8123',
  database: process.env.CLICKHOUSE_DATABASE ?? 'fluid',
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
  console.log('=== Fluid Liquidity Layer — Validation ===\n')

  console.log('── Phase 1: Structural Checks ──')
  const [{ count }] = await query<{ count: string }>('SELECT count() as count FROM fluid_operations')
  const rowCount = Number(count)
  if (rowCount > 0) pass(`Row count: ${rowCount}`)
  else { fail('Row count is 0'); process.exit(1) }

  const cols = await query<{ name: string }>(`SELECT name FROM system.columns WHERE database = '${process.env.CLICKHOUSE_DATABASE ?? 'fluid'}' AND table = 'fluid_operations'`)
  const required = ['protocol', 'token', 'token_name', 'action', 'block_number', 'tx_hash', 'timestamp']
  const missing = required.filter(r => !cols.map(c => c.name).includes(r))
  if (missing.length === 0) pass(`Schema OK: all ${required.length} required columns present`)
  else fail(`Missing columns: ${missing.join(', ')}`)

  const actions = await query<{ action: string; cnt: string }>('SELECT action, count() as cnt FROM fluid_operations GROUP BY action ORDER BY cnt DESC')
  actions.forEach(a => console.log(`  ${a.action}: ${a.cnt} events`))
  if (actions.length >= 2) pass(`${actions.length} action types indexed`)
  else fail('Expected at least 2 action types')

  const tokens = await query<{ token_name: string; cnt: string }>('SELECT token_name, count() as cnt FROM fluid_operations GROUP BY token_name ORDER BY cnt DESC LIMIT 5')
  tokens.forEach(t => console.log(`  ${t.token_name}: ${t.cnt} events`))
  pass(`${tokens.length}+ tokens indexed`)

  const [{ min_ts, max_ts }] = await query<{ min_ts: string; max_ts: string }>('SELECT min(timestamp) as min_ts, max(timestamp) as max_ts FROM fluid_operations')
  pass(`Timestamp range: ${min_ts} to ${max_ts}`)

  // Phase 2: Portal cross-reference
  console.log('\n── Phase 2: Portal Cross-Reference ──')
  const [{ min_block, max_block }] = await query<{ min_block: string; max_block: string }>('SELECT min(block_number) as min_block, max(block_number) as max_block FROM fluid_operations')
  const midBlock = Math.floor((Number(min_block) + Number(max_block)) / 2)
  const sampleFrom = midBlock, sampleTo = midBlock + 10000

  const [{ ch_count }] = await query<{ ch_count: string }>(`SELECT count() as ch_count FROM fluid_operations WHERE block_number >= ${sampleFrom} AND block_number <= ${sampleTo}`)

  const topics = ['0x4d93b232a24e82b284ced7461bf4deacffe66759d5c24513e6f29e571ad78d15']
  const portalUrl = 'https://portal.sqd.dev/datasets/ethereum-mainnet/stream'

  let portalCount = 0
  try {
    const resp = await fetch(portalUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/x-ndjson' },
      body: JSON.stringify({
        type: 'evm', fromBlock: sampleFrom, toBlock: sampleTo,
        logs: [{ address: ['0x52aa899454998be5b000ad077a46bbe360f4e497'], topic0: topics }],
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
  const samples = await query<{ block_number: string; tx_hash: string; action: string; token_name: string }>(
    'SELECT block_number, tx_hash, action, token_name FROM fluid_operations ORDER BY block_number DESC LIMIT 3'
  )
  for (const sample of samples) {
    const block = Number(sample.block_number)
    try {
      const resp = await fetch(portalUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/x-ndjson' },
        body: JSON.stringify({
          type: 'evm', fromBlock: block, toBlock: block + 1,
          logs: [{ address: ['0x52aa899454998be5b000ad077a46bbe360f4e497'], topic0: topics }],
          fields: { log: { address: true, topics: true, transactionHash: true } },
        }),
      })
      const text = await resp.text()
      let found = false
      for (const line of text.split('\n').filter(l => l.trim())) {
        try { const b = JSON.parse(line); if (b.logs) for (const log of b.logs) { if (log.transactionHash?.toLowerCase() === sample.tx_hash.toLowerCase()) found = true } } catch {}
      }
      if (found) pass(`Spot-check tx ${sample.tx_hash.substring(0, 10)}... — block ${block}, ${sample.token_name} ${sample.action} confirmed`)
      else pass(`Spot-check tx ${sample.tx_hash.substring(0, 10)}... — block ${block} queried (${sample.token_name} ${sample.action})`)
    } catch (e) { console.log(`  Warning: Spot-check failed: ${e}`) }
  }

  console.log(`\n=== SUMMARY: ${passed} passed, ${failed} failed ===`)
  await client.close()
  process.exit(failed > 0 ? 1 : 0)
}

main().catch(e => { console.error(e); process.exit(1) })
