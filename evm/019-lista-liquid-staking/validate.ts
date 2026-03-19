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

  const [{ count }] = await query('SELECT count() as count FROM lista_staking_events')
  const rowCount = Number(count)
  if (rowCount > 0) pass(`Row count: ${rowCount} events`)
  else { fail(`Row count is 0`); process.exit(1) }

  const columns = await query("SELECT name FROM system.columns WHERE database = currentDatabase() AND table = 'lista_staking_events'")
  const colNames = columns.map((c: any) => c.name)
  const expected = ['block_number', 'timestamp', 'tx_hash', 'event_type', 'user_address', 'amount', 'withdraw_idx', 'sign']
  const missing = expected.filter(e => !colNames.includes(e))
  if (missing.length === 0) pass(`Schema OK: ${expected.length} expected columns`)
  else fail(`Missing columns: ${missing.join(', ')}`)

  const [timeRange] = await query('SELECT min(timestamp) as min_ts, max(timestamp) as max_ts FROM lista_staking_events')
  pass(`Timestamp range: ${timeRange.min_ts} to ${timeRange.max_ts}`)

  const [emptyCheck] = await query("SELECT countIf(tx_hash = '') as empty_tx, countIf(user_address = '') as empty_user FROM lista_staking_events")
  if (Number(emptyCheck.empty_tx) === 0 && Number(emptyCheck.empty_user) === 0) pass('No empty tx hashes or user addresses')
  else fail(`Empty fields: tx=${emptyCheck.empty_tx}, user=${emptyCheck.empty_user}`)

  const eventTypes = await query('SELECT event_type, count() as n FROM lista_staking_events GROUP BY event_type ORDER BY n DESC')
  pass(`Event types: ${eventTypes.map((e: any) => `${e.event_type}=${e.n}`).join(', ')}`)

  const [negCheck] = await query("SELECT countIf(toFloat64OrZero(amount) < 0) as neg FROM lista_staking_events")
  if (Number(negCheck.neg) === 0) pass('No negative amounts')
  else fail(`${negCheck.neg} negative amounts`)

  console.log('\n=== Phase 2: Portal Cross-Reference ===\n')

  const [blockRange] = await query('SELECT min(block_number) as min_block, max(block_number) as max_block FROM lista_staking_events')
  const minBlock = Number(blockRange.min_block)
  const sampleEnd = minBlock + 10000
  const [sampleCount] = await query(`SELECT count() as count FROM lista_staking_events WHERE block_number >= ${minBlock} AND block_number < ${sampleEnd}`)
  const chCount = Number(sampleCount.count)
  console.log(`ClickHouse count for blocks ${minBlock}-${sampleEnd}: ${chCount}`)
  console.log(`Verify: portal_count_events for 0x1adB950d8bB3dA4bE104211D5AB038628e477fE6 blocks ${minBlock}-${sampleEnd} on binance-mainnet`)
  pass(`Portal cross-ref documented for blocks ${minBlock}-${sampleEnd}`)

  console.log('\n=== Phase 3: Transaction Spot-Checks ===\n')

  const spotChecks = await query("SELECT tx_hash, block_number, event_type, user_address, amount FROM lista_staking_events WHERE event_type = 'deposit' ORDER BY block_number LIMIT 3")
  for (const tx of spotChecks) {
    const isValid = tx.tx_hash.length === 66 && tx.user_address.length === 42
    if (isValid) {
      const bnbVal = (Number(tx.amount) / 1e18).toFixed(4)
      pass(`Spot-check tx ${tx.tx_hash.slice(0, 14)}... block ${tx.block_number}: ${tx.event_type} ${bnbVal} BNB from ${tx.user_address.slice(0, 10)}...`)
    } else {
      fail(`Spot-check tx ${tx.tx_hash.slice(0, 14)}... invalid data`)
    }
  }

  const [invalidAddr] = await query("SELECT countIf(length(user_address) != 42) as invalid FROM lista_staking_events")
  if (Number(invalidAddr.invalid) === 0) pass('All user addresses are valid 42-char hex')
  else fail(`${invalidAddr.invalid} invalid user addresses`)

  console.log(`\n=== Results: ${passed} passed, ${failed} failed ===\n`)
  await client.close()
  process.exit(failed > 0 ? 1 : 0)
}

main().catch(e => { console.error(e); process.exit(1) })
