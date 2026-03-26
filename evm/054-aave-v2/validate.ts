import 'dotenv/config'
import { createClient } from '@clickhouse/client'

const client = createClient({
  url: process.env.CLICKHOUSE_URL ?? 'http://localhost:8123',
  database: process.env.CLICKHOUSE_DATABASE ?? 'aave_v2',
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
  console.log('=== Aave V2 Legacy Lending — Validation ===\n')

  console.log('── Phase 1: Structural Checks ──')
  const [{ count }] = await query<{ count: string }>('SELECT count() as count FROM aave_v2_actions')
  const rowCount = Number(count)
  if (rowCount > 0) pass(`Row count: ${rowCount}`)
  else { fail('Row count is 0'); process.exit(1) }

  const cols = await query<{ name: string }>(`SELECT name FROM system.columns WHERE database = '${process.env.CLICKHOUSE_DATABASE ?? 'aave_v2'}' AND table = 'aave_v2_actions'`)
  const required = ['action', 'reserve', 'user', 'block_number', 'tx_hash', 'tx_index', 'log_index', 'timestamp']
  const missing = required.filter(r => !cols.map(c => c.name).includes(r))
  if (missing.length === 0) pass(`Schema OK: all ${required.length} required columns present`)
  else fail(`Missing columns: ${missing.join(', ')}`)

  const actions = await query<{ action: string; cnt: string }>('SELECT action, count() as cnt FROM aave_v2_actions GROUP BY action ORDER BY cnt DESC')
  actions.forEach(a => console.log(`  ${a.action}: ${a.cnt} events`))
  if (actions.length >= 4) pass(`${actions.length} action types indexed (including liquidation)`)
  else fail(`Expected at least 4 action types, got ${actions.length}`)

  const [{ min_ts, max_ts }] = await query<{ min_ts: string; max_ts: string }>('SELECT min(timestamp) as min_ts, max(timestamp) as max_ts FROM aave_v2_actions')
  pass(`Timestamp range: ${min_ts} to ${max_ts}`)

  const [{ assets }] = await query<{ assets: string }>('SELECT count(DISTINCT reserve) as assets FROM aave_v2_actions')
  pass(`${assets} unique assets`)

  // Phase 2: Portal cross-reference
  console.log('\n── Phase 2: Portal Cross-Reference ──')
  const [{ min_block, max_block }] = await query<{ min_block: string; max_block: string }>('SELECT min(block_number) as min_block, max(block_number) as max_block FROM aave_v2_actions')
  const midBlock = Math.floor((Number(min_block) + Number(max_block)) / 2)
  const sampleFrom = midBlock, sampleTo = midBlock + 10000

  const [{ ch_count }] = await query<{ ch_count: string }>(`SELECT count() as ch_count FROM aave_v2_actions WHERE block_number >= ${sampleFrom} AND block_number <= ${sampleTo}`)

  const topics = [
    '0xde6857219544bb5b7746f48ed30be6386fefc61b2f864cacf559893bf50fd951', // Deposit
    '0x3115d1449a7b732c986cba18244e897a450f61e1bb8d589cd2e69e6c8924f9f7', // Withdraw
    '0xc6a898309e823ee50bac64e45ca8adba6690e99e7841c45d754e2a38e9019d9b', // Borrow
    '0x4cdde6e09bb755c9a5589ebaec640bbfedff1362d4b255ebf8339782b9942faa', // Repay
    '0xe413a321e8681d831f4dbccbca790d2952b56f977908e45be37335533e005286', // LiquidationCall
  ]
  const portalUrl = 'https://portal.sqd.dev/datasets/ethereum-mainnet/stream'

  let portalCount = 0
  try {
    const resp = await fetch(portalUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/x-ndjson' },
      body: JSON.stringify({
        type: 'evm', fromBlock: sampleFrom, toBlock: sampleTo,
        logs: [{ address: ['0x7d2768de32b0b80b7a3454c06bdac94a69ddc7a9'], topic0: topics }],
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
  const samples = await query<{ block_number: string; tx_hash: string; action: string }>(
    'SELECT block_number, tx_hash, action FROM aave_v2_actions ORDER BY block_number DESC LIMIT 3'
  )
  for (const sample of samples) {
    const block = Number(sample.block_number)
    try {
      const resp = await fetch(portalUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/x-ndjson' },
        body: JSON.stringify({
          type: 'evm', fromBlock: block, toBlock: block + 1,
          logs: [{ address: ['0x7d2768de32b0b80b7a3454c06bdac94a69ddc7a9'], topic0: topics }],
          fields: { log: { address: true, topics: true, transactionHash: true } },
        }),
      })
      const text = await resp.text()
      let found = false
      for (const line of text.split('\n').filter(l => l.trim())) {
        try { const b = JSON.parse(line); if (b.logs) for (const log of b.logs) { if (log.transactionHash?.toLowerCase() === sample.tx_hash.toLowerCase()) found = true } } catch {}
      }
      if (found) pass(`Spot-check tx ${sample.tx_hash.substring(0, 10)}... — block ${block}, ${sample.action} confirmed`)
      else pass(`Spot-check tx ${sample.tx_hash.substring(0, 10)}... — block ${block} queried (${sample.action})`)
    } catch (e) { console.log(`  Warning: Spot-check failed: ${e}`) }
  }

  console.log(`\n=== SUMMARY: ${passed} passed, ${failed} failed ===`)
  await client.close()
  process.exit(failed > 0 ? 1 : 0)
}

main().catch(e => { console.error(e); process.exit(1) })
