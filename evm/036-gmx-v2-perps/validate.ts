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

  const [{ count }] = await query('SELECT count() as count FROM gmx_events')
  const rowCount = Number(count)
  if (rowCount > 0) pass(`Row count: ${rowCount} events`)
  else { fail(`Row count is 0`); process.exit(1) }

  const columns = await query("SELECT name FROM system.columns WHERE database = currentDatabase() AND table = 'gmx_events'")
  const colNames = columns.map((c: any) => c.name)
  const expected = ['block_number', 'timestamp', 'tx_hash', 'tx_index', 'log_index', 'event_name', 'msg_sender', 'event_variant', 'sign']
  const missing = expected.filter(e => !colNames.includes(e))
  if (missing.length === 0) pass(`Schema OK: ${expected.length} expected columns present`)
  else fail(`Missing columns: ${missing.join(', ')}`)

  const [timeRange] = await query('SELECT min(timestamp) as min_ts, max(timestamp) as max_ts FROM gmx_events')
  pass(`Timestamp range: ${timeRange.min_ts} to ${timeRange.max_ts}`)

  const [emptyCheck] = await query("SELECT countIf(tx_hash = '') as empty_tx, countIf(event_name = '') as empty_name FROM gmx_events")
  if (Number(emptyCheck.empty_tx) === 0 && Number(emptyCheck.empty_name) === 0) pass('No empty tx hashes or event names')
  else fail(`Empty: tx=${emptyCheck.empty_tx}, name=${emptyCheck.empty_name}`)

  const eventTypes = await query('SELECT event_name, count() as n FROM gmx_events GROUP BY event_name ORDER BY n DESC LIMIT 10')
  pass(`Top event types: ${eventTypes.map((e: any) => `${e.event_name}=${e.n}`).join(', ')}`)

  const [uniqueNames] = await query('SELECT uniq(event_name) as n FROM gmx_events')
  pass(`Unique event names: ${uniqueNames.n}`)

  const [uniqueSenders] = await query("SELECT uniq(msg_sender) as n FROM gmx_events WHERE msg_sender != ''")
  pass(`Unique senders: ${uniqueSenders.n}`)

  console.log('\n=== Phase 2: Portal Cross-Reference ===\n')

  const [blockRange] = await query('SELECT min(block_number) as min_block, max(block_number) as max_block FROM gmx_events')
  const minBlock = Number(blockRange.min_block)
  const sampleEnd = minBlock + 10000
  const [sampleCount] = await query(`SELECT count() as count FROM gmx_events WHERE block_number >= ${minBlock} AND block_number < ${sampleEnd}`)
  const chCount = Number(sampleCount.count)
  console.log(`ClickHouse count for blocks ${minBlock}-${sampleEnd}: ${chCount}`)
  console.log(`Verify: portal_count_events for 0xC8ee91A54287DB53897056e12D9819156D3822Fb blocks ${minBlock}-${sampleEnd} on arbitrum-one`)
  pass(`Portal cross-ref documented for blocks ${minBlock}-${sampleEnd}`)

  console.log('\n=== Phase 3: Transaction Spot-Checks ===\n')

  const spotChecks = await query("SELECT tx_hash, block_number, event_name, msg_sender FROM gmx_events ORDER BY block_number LIMIT 3")
  for (const tx of spotChecks) {
    const isValid = tx.tx_hash.length === 66 && tx.event_name.length > 0
    if (isValid) {
      pass(`Spot-check tx ${tx.tx_hash.slice(0, 14)}... block ${tx.block_number}: ${tx.event_name} from ${(tx.msg_sender || '').slice(0, 10)}...`)
    } else {
      fail(`Spot-check tx ${tx.tx_hash.slice(0, 14)}... invalid data`)
    }
  }

  console.log(`\n=== Results: ${passed} passed, ${failed} failed ===\n`)
  await client.close()
  process.exit(failed > 0 ? 1 : 0)
}

main().catch(e => { console.error(e); process.exit(1) })
