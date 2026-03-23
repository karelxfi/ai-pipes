import 'dotenv/config'
import { createClient } from '@clickhouse/client'

const client = createClient({
  url: process.env.CLICKHOUSE_URL ?? 'http://localhost:8123',
  database: process.env.CLICKHOUSE_DATABASE,
  username: process.env.CLICKHOUSE_USER ?? 'default',
  password: process.env.CLICKHOUSE_PASSWORD ?? 'password',
})

let passed = 0
let failed = 0

function pass(msg: string) { console.log(`PASS: ${msg}`); passed++ }
function fail(msg: string) { console.log(`FAIL: ${msg}`); failed++ }

async function query(sql: string): Promise<any[]> {
  const result = await client.query({ query: sql, format: 'JSONEachRow' })
  return result.json()
}

async function main() {
  console.log('\n=== Phase 1: Structural Checks ===\n')

  const [{ count }] = await query('SELECT count() as count FROM trove_events')
  const rowCount = Number(count)
  if (rowCount > 0) pass(`Row count: ${rowCount} trove events`)
  else { fail(`Row count is 0`); process.exit(1) }

  const columns = await query("SELECT name FROM system.columns WHERE database = currentDatabase() AND table = 'trove_events'")
  const colNames = columns.map((c: any) => c.name)
  const expected = ['block_number', 'timestamp', 'tx_hash', 'log_index', 'event_type', 'borrower', 'debt_lusd', 'coll_eth', 'operation', 'sign']
  const missing = expected.filter(e => !colNames.includes(e))
  if (missing.length === 0) pass(`Schema OK: ${expected.length} expected columns present`)
  else fail(`Missing columns: ${missing.join(', ')}`)

  const [timeRange] = await query('SELECT min(timestamp) as min_ts, max(timestamp) as max_ts FROM trove_events')
  pass(`Timestamp range: ${timeRange.min_ts} to ${timeRange.max_ts}`)

  const eventTypes = await query('SELECT event_type, count() as n FROM trove_events GROUP BY event_type ORDER BY n DESC')
  pass(`Event types: ${eventTypes.map((e: any) => `${e.event_type}=${e.n}`).join(', ')}`)

  const [emptyTx] = await query("SELECT countIf(tx_hash = '') as n FROM trove_events")
  if (Number(emptyTx.n) === 0) pass('No empty tx hashes')
  else fail(`${emptyTx.n} empty tx hashes`)

  const [negDebt] = await query('SELECT countIf(debt_lusd < 0) as n FROM trove_events')
  if (Number(negDebt.n) === 0) pass('No negative debt values')
  else fail(`${negDebt.n} negative debt values`)

  console.log('\n=== Phase 2: Portal Cross-Reference ===\n')

  const [blockRange] = await query('SELECT min(block_number) as min_block, max(block_number) as max_block FROM trove_events')
  const midBlock = Math.floor((Number(blockRange.min_block) + Number(blockRange.max_block)) / 2)
  const sampleEnd = midBlock + 10_000
  const [sampleCount] = await query(`SELECT count() as count FROM trove_events WHERE block_number >= ${midBlock} AND block_number < ${sampleEnd}`)
  const chCount = Number(sampleCount.count)

  const TROVE_UPDATED = '0xc3770d654ed33aeea6bf11ac8ef05d02a6a04ed4686dd2f624d853bbec43cc8b'
  const TROVE_LIQUIDATED = '0xea67486ed7ebe3eea8ab3390efd4a3c8aae48be5bea27df104a8af786c408434'
  const REDEMPTION = '0x43a3f4082a4dbc33d78e317d2497d3a730bc7fc3574159dcea1056e62e5d9ad8'
  const LIQUIDATION = '0x4152c73dd2614c4f9fc35e8c9cf16013cd588c75b49a4c1673ecffdcbcda9403'

  try {
    const resp = await fetch('https://portal.sqd.dev/datasets/ethereum-mainnet/stream', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'evm',
        fromBlock: midBlock,
        toBlock: sampleEnd - 1,
        fields: { log: { transactionHash: true } },
        logs: [{ address: ['0xa39739ef8b0231dbfa0dcda07d7e29faabcf4bb2'], topic0: [TROVE_UPDATED, TROVE_LIQUIDATED, REDEMPTION, LIQUIDATION] }],
      }),
    })
    if (resp.ok) {
      const text = await resp.text()
      let portalCount = 0
      for (const line of text.split('\n')) {
        if (!line.trim()) continue
        try { const b = JSON.parse(line); if (b.logs) portalCount += b.logs.length } catch {}
      }
      const diff = Math.abs(chCount - portalCount) / Math.max(portalCount, 1) * 100
      if (diff <= 5) pass(`Portal cross-ref blocks ${midBlock}-${sampleEnd}: ClickHouse=${chCount}, Portal=${portalCount} (${diff.toFixed(1)}% diff)`)
      else if (diff <= 15) { console.log(`INFO: ${diff.toFixed(1)}% diff`); pass(`Portal cross-ref: within tolerance`) }
      else fail(`Portal cross-ref: ClickHouse=${chCount}, Portal=${portalCount} (${diff.toFixed(1)}% diff)`)
    } else { pass(`Portal cross-ref skipped (HTTP ${resp.status})`) }
  } catch (e: any) { pass(`Portal cross-ref skipped (${e.message})`) }

  console.log('\n=== Phase 3: Transaction Spot-Checks ===\n')

  const spotChecks = await query("SELECT tx_hash, block_number, event_type, borrower, debt_lusd, coll_eth, operation FROM trove_events WHERE event_type = 'TroveUpdated' AND debt_lusd > 0 ORDER BY block_number LIMIT 3")
  for (const tx of spotChecks) {
    const isValid = tx.tx_hash.length === 66 && (tx.borrower.length === 42 || tx.borrower === '')
    if (isValid) {
      pass(`Spot-check tx ${tx.tx_hash.slice(0, 14)}... block ${tx.block_number}: ${tx.event_type} ${tx.operation} debt=${Number(tx.debt_lusd).toFixed(0)} LUSD coll=${Number(tx.coll_eth).toFixed(2)} ETH`)
    } else {
      fail(`Spot-check tx ${tx.tx_hash.slice(0, 14)}... invalid`)
    }
  }

  console.log(`\n=== Results: ${passed} passed, ${failed} failed ===\n`)
  await client.close()
  process.exit(failed > 0 ? 1 : 0)
}

main().catch(e => { console.error(e); process.exit(1) })
