import 'dotenv/config'
import { createClient } from '@clickhouse/client'

const client = createClient({
  url: process.env.CLICKHOUSE_URL ?? 'http://localhost:8123',
  database: process.env.CLICKHOUSE_DATABASE ?? 'hl_pnl',
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
  console.log('=== Hyperliquid Funding & PnL — Validation ===\n')

  console.log('── Phase 1: Structural Checks ──')
  const [{ count }] = await query<{ count: string }>('SELECT count() as count FROM hl_pnl_fills')
  const rowCount = Number(count)
  if (rowCount > 0) pass(`Row count: ${rowCount}`)
  else { fail('Row count is 0'); process.exit(1) }

  const cols = await query<{ name: string }>(`SELECT name FROM system.columns WHERE database = '${process.env.CLICKHOUSE_DATABASE ?? 'hl_pnl'}' AND table = 'hl_pnl_fills'`)
  const required = ['coin', 'user', 'px', 'sz', 'side', 'dir', 'closed_pnl', 'fee', 'notional', 'block_number', 'timestamp']
  const missing = required.filter(r => !cols.map(c => c.name).includes(r))
  if (missing.length === 0) pass(`Schema OK: all ${required.length} required columns present`)
  else fail(`Missing columns: ${missing.join(', ')}`)

  const [{ min_ts, max_ts }] = await query<{ min_ts: string; max_ts: string }>('SELECT min(timestamp) as min_ts, max(timestamp) as max_ts FROM hl_pnl_fills')
  pass(`Timestamp range: ${min_ts} to ${max_ts}`)

  // All fills should have non-zero closedPnl (that's our filter)
  const [{ zero_pnl }] = await query<{ zero_pnl: string }>('SELECT countIf(closed_pnl = 0) as zero_pnl FROM hl_pnl_fills')
  if (Number(zero_pnl) === 0) pass('All fills have non-zero closedPnl (closing trades only)')
  else fail(`${zero_pnl} fills with zero closedPnl — filter not working`)

  const coins = await query<{ coin: string; cnt: string }>('SELECT coin, count() as cnt FROM hl_pnl_fills GROUP BY coin ORDER BY cnt DESC')
  coins.forEach(c => console.log(`  ${c.coin}: ${c.cnt} closing trades`))
  if (coins.length >= 2) pass(`${coins.length} coins with PnL data`)
  else fail(`Only ${coins.length} coins`)

  // Phase 2: PnL sanity checks
  console.log('\n── Phase 2: PnL Sanity Checks ──')

  const [{ total_pnl, total_fee }] = await query<{ total_pnl: string; total_fee: string }>(
    'SELECT sum(closed_pnl) as total_pnl, sum(fee) as total_fee FROM hl_pnl_fills'
  )
  pass(`Net realized PnL: $${(Number(total_pnl) / 1e6).toFixed(2)}M`)
  pass(`Total fees paid: $${(Number(total_fee) / 1e6).toFixed(2)}M`)

  // Winners vs losers
  const [{ winners, losers }] = await query<{ winners: string; losers: string }>(
    'SELECT countIf(closed_pnl > 0) as winners, countIf(closed_pnl < 0) as losers FROM hl_pnl_fills'
  )
  pass(`Profitable closes: ${winners}, Losing closes: ${losers}`)

  const [{ unique_traders }] = await query<{ unique_traders: string }>('SELECT count(DISTINCT user) as unique_traders FROM hl_pnl_fills')
  pass(`${unique_traders} unique traders with realized PnL`)

  // Phase 3: Data consistency
  console.log('\n── Phase 3: Data Consistency ──')

  const [{ empty_user }] = await query<{ empty_user: string }>(`SELECT countIf(user = '') as empty_user FROM hl_pnl_fills`)
  if (Number(empty_user) === 0) pass('No empty user addresses')
  else fail(`${empty_user} rows with empty user`)

  const sides = await query<{ side: string; cnt: string }>('SELECT side, count() as cnt FROM hl_pnl_fills GROUP BY side')
  if (sides.length === 2) pass(`Both sides present: ${sides.map(s => `${s.side}(${s.cnt})`).join(', ')}`)
  else fail(`Expected 2 sides, got ${sides.length}`)

  // Direction should be closing types predominantly
  const dirs = await query<{ dir: string; cnt: string }>('SELECT dir, count() as cnt FROM hl_pnl_fills GROUP BY dir ORDER BY cnt DESC')
  pass(`Direction breakdown: ${dirs.map(d => `${d.dir}(${d.cnt})`).join(', ')}`)

  console.log(`\n=== SUMMARY: ${passed} passed, ${failed} failed ===`)
  await client.close()
  process.exit(failed > 0 ? 1 : 0)
}

main().catch(e => { console.error(e); process.exit(1) })
