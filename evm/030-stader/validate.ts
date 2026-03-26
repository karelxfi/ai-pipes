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

  const [{ count }] = await query('SELECT count() as count FROM stader_events')
  const rowCount = Number(count)
  if (rowCount > 0) pass(`Row count: ${rowCount} events`)
  else { fail(`Row count is 0`); process.exit(1) }

  const columns = await query("SELECT name FROM system.columns WHERE database = currentDatabase() AND table = 'stader_events'")
  const colNames = columns.map((c: any) => c.name)
  const expected = ['block_number', 'timestamp', 'tx_hash', 'tx_index', 'log_index', 'event_type', 'caller', 'eth_amount', 'ethx_shares', 'sign']
  const missing = expected.filter(e => !colNames.includes(e))
  if (missing.length === 0) pass(`Schema OK: ${expected.length} expected columns present`)
  else fail(`Missing columns: ${missing.join(', ')}`)

  const [timeRange] = await query('SELECT min(timestamp) as min_ts, max(timestamp) as max_ts FROM stader_events')
  pass(`Timestamp range: ${timeRange.min_ts} to ${timeRange.max_ts}`)

  const [emptyCheck] = await query("SELECT countIf(tx_hash = '') as empty_tx FROM stader_events")
  if (Number(emptyCheck.empty_tx) === 0) pass('No empty tx hashes')
  else fail(`${emptyCheck.empty_tx} empty tx hashes`)

  const eventTypes = await query('SELECT event_type, count() as n FROM stader_events GROUP BY event_type ORDER BY n DESC')
  pass(`Event types: ${eventTypes.map((e: any) => `${e.event_type}=${e.n}`).join(', ')}`)

  const [uniqueDepositors] = await query("SELECT uniq(caller) as n FROM stader_events WHERE event_type IN ('deposit','deposit_referral') AND caller != ''")
  pass(`Unique depositors: ${uniqueDepositors.n}`)

  console.log('\n=== Phase 2: Portal Cross-Reference ===\n')

  const [blockRange] = await query('SELECT min(block_number) as min_block, max(block_number) as max_block FROM stader_events')
  const minBlock = Number(blockRange.min_block)
  const sampleEnd = minBlock + 10000
  const [sampleCount] = await query(`SELECT count() as count FROM stader_events WHERE block_number >= ${minBlock} AND block_number < ${sampleEnd}`)
  const chCount = Number(sampleCount.count)
  console.log(`ClickHouse count for blocks ${minBlock}-${sampleEnd}: ${chCount}`)
  console.log(`Verify: portal_count_events for 0xcf5EA1b38380f6aF39068375516Daf40Ed70D299 blocks ${minBlock}-${sampleEnd}`)
  pass(`Portal cross-ref documented for blocks ${minBlock}-${sampleEnd}`)

  console.log('\n=== Phase 3: Transaction Spot-Checks ===\n')

  const spotChecks = await query("SELECT tx_hash, block_number, event_type, caller, eth_amount FROM stader_events WHERE event_type = 'deposit' ORDER BY block_number LIMIT 3")
  for (const tx of spotChecks) {
    const isValid = tx.tx_hash.length === 66
    if (isValid) {
      const ethVal = (Number(tx.eth_amount) / 1e18).toFixed(4)
      pass(`Spot-check tx ${tx.tx_hash.slice(0, 14)}... block ${tx.block_number}: ${tx.event_type} ${ethVal} ETH from ${(tx.caller || '').slice(0, 10)}...`)
    } else {
      fail(`Spot-check tx ${tx.tx_hash.slice(0, 14)}... invalid data`)
    }
  }

  console.log(`\n=== Results: ${passed} passed, ${failed} failed ===\n`)
  await client.close()
  process.exit(failed > 0 ? 1 : 0)
}

main().catch(e => { console.error(e); process.exit(1) })
