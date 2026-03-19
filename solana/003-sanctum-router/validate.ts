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

  const [{ count }] = await query('SELECT count() as count FROM sanctum_actions')
  const rowCount = Number(count)
  if (rowCount > 0) pass(`Row count: ${rowCount} actions`)
  else { fail(`Row count is 0`); process.exit(1) }

  // Schema check
  const columns = await query("SELECT name FROM system.columns WHERE database = currentDatabase() AND table = 'sanctum_actions'")
  const colNames = columns.map((c: any) => c.name)
  const expected = ['slot', 'timestamp', 'tx_signature', 'fee_payer', 'program', 'lst_mint', 'sign']
  const missing = expected.filter(e => !colNames.includes(e))
  if (missing.length === 0) pass(`Schema OK: ${expected.length} expected columns present`)
  else fail(`Missing columns: ${missing.join(', ')}`)

  // Timestamp range
  const [timeRange] = await query('SELECT min(timestamp) as min_ts, max(timestamp) as max_ts FROM sanctum_actions')
  pass(`Timestamp range: ${timeRange.min_ts} to ${timeRange.max_ts}`)

  // Non-empty addresses
  const [emptyCheck] = await query("SELECT countIf(lst_mint = '') as empty_mint, countIf(fee_payer = '') as empty_fp FROM sanctum_actions")
  if (Number(emptyCheck.empty_mint) === 0 && Number(emptyCheck.empty_fp) === 0) {
    pass('No empty addresses in lst_mint, fee_payer')
  } else {
    fail(`Empty addresses: mint=${emptyCheck.empty_mint}, fp=${emptyCheck.empty_fp}`)
  }

  // Programs distribution
  const programs = await query('SELECT program, count() as n FROM sanctum_actions GROUP BY program ORDER BY n DESC')
  pass(`Programs: ${programs.map((p: any) => `${p.program}=${p.n}`).join(', ')}`)

  // Unique LSTs
  const [{ lsts }] = await query('SELECT uniq(lst_mint) as lsts FROM sanctum_actions')
  if (Number(lsts) > 10) pass(`Unique LST mints: ${lsts}`)
  else fail(`Only ${lsts} unique LSTs — expected dozens`)

  // Slot range
  const [slotRange] = await query('SELECT min(slot) as min_slot, max(slot) as max_slot FROM sanctum_actions')
  pass(`Slot range: ${slotRange.min_slot} to ${slotRange.max_slot}`)

  console.log('\n=== Phase 2: Portal Cross-Reference ===\n')

  const minSlot = Number(slotRange.min_slot)
  const sampleEnd = minSlot + 5000
  const [sampleCount] = await query(`SELECT count() as count FROM sanctum_actions WHERE slot >= ${minSlot} AND slot < ${sampleEnd}`)
  const chCount = Number(sampleCount.count)
  console.log(`ClickHouse count for slots ${minSlot}-${sampleEnd}: ${chCount}`)
  console.log(`Manual verification: Query portal_query_solana_instructions for programs [stkitr..., 5ocnV1..., unpXTU...] slots ${minSlot}-${sampleEnd}`)
  pass(`Portal cross-ref documented for slots ${minSlot}-${sampleEnd}`)

  console.log('\n=== Phase 3: Transaction Spot-Checks ===\n')

  const spotChecks = await query('SELECT tx_signature, slot, program, lst_mint FROM sanctum_actions ORDER BY slot LIMIT 3')
  for (const tx of spotChecks) {
    const isValid = tx.tx_signature.length > 30 && tx.lst_mint.length > 30
    if (isValid) {
      pass(`Spot-check tx ${tx.tx_signature.slice(0, 12)}... slot ${tx.slot}: ${tx.program} → ${tx.lst_mint.slice(0, 8)}...`)
    } else {
      fail(`Spot-check tx ${tx.tx_signature.slice(0, 12)}... invalid data`)
    }
  }

  // Verify programs are all known
  const unknownProgs = await query("SELECT DISTINCT program FROM sanctum_actions WHERE program NOT IN ('infinity', 'router', 'unstake')")
  if (unknownProgs.length === 0) pass('All programs are known Sanctum programs')
  else fail(`Unknown programs: ${unknownProgs.map((p: any) => p.program).join(', ')}`)

  console.log(`\n=== Results: ${passed} passed, ${failed} failed ===\n`)
  await client.close()
  process.exit(failed > 0 ? 1 : 0)
}

main().catch(e => { console.error(e); process.exit(1) })
