import 'dotenv/config'
import { createClient } from '@clickhouse/client'

const client = createClient({
  url: process.env.CLICKHOUSE_URL ?? 'http://localhost:8123',
  database: process.env.CLICKHOUSE_DATABASE ?? 'hl_liqs',
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
  console.log('=== Hyperliquid Liquidations — Validation ===\n')

  console.log('── Phase 1: Structural Checks ──')
  const [{ count }] = await query<{ count: string }>('SELECT count() as count FROM hl_liquidations')
  const rowCount = Number(count)
  if (rowCount > 0) pass(`Row count: ${rowCount}`)
  else { fail('Row count is 0'); process.exit(1) }

  const cols = await query<{ name: string }>(`SELECT name FROM system.columns WHERE database = '${process.env.CLICKHOUSE_DATABASE ?? 'hl_liqs'}' AND table = 'hl_liquidations'`)
  const required = ['coin', 'user', 'px', 'sz', 'side', 'dir', 'closed_pnl', 'fee', 'notional', 'start_position', 'block_number', 'timestamp']
  const missing = required.filter(r => !cols.map(c => c.name).includes(r))
  if (missing.length === 0) pass(`Schema OK: all ${required.length} required columns present`)
  else fail(`Missing columns: ${missing.join(', ')}`)

  const [{ min_ts, max_ts }] = await query<{ min_ts: string; max_ts: string }>('SELECT min(timestamp) as min_ts, max(timestamp) as max_ts FROM hl_liquidations')
  pass(`Timestamp range: ${min_ts} to ${max_ts}`)

  // All fills should have negative closedPnl (losses > $100)
  const [{ max_pnl }] = await query<{ max_pnl: string }>('SELECT max(closed_pnl) as max_pnl FROM hl_liquidations')
  if (Number(max_pnl) < -100) pass(`Max PnL: $${Number(max_pnl).toFixed(0)} (all fills are losses > $100)`)
  else fail(`Max PnL: $${Number(max_pnl).toFixed(0)} — expected all < -$100`)

  const coins = await query<{ coin: string; cnt: string }>('SELECT coin, count() as cnt FROM hl_liquidations GROUP BY coin ORDER BY cnt DESC LIMIT 10')
  console.log('  Top coins by liquidation events:')
  coins.forEach(c => console.log(`    ${c.coin}: ${c.cnt}`))
  if (coins.length >= 3) pass(`${coins.length}+ coins with liquidation-like events`)
  else fail(`Only ${coins.length} coins`)

  // Phase 2: Liquidation sanity checks
  console.log('\n── Phase 2: Liquidation Sanity Checks ──')

  const [{ total_loss }] = await query<{ total_loss: string }>('SELECT sum(closed_pnl) as total_loss FROM hl_liquidations')
  pass(`Total realized losses: $${(Number(total_loss) / 1e6).toFixed(2)}M`)

  const [{ avg_loss }] = await query<{ avg_loss: string }>('SELECT avg(closed_pnl) as avg_loss FROM hl_liquidations')
  pass(`Average loss per event: $${Number(avg_loss).toFixed(0)}`)

  const [{ unique_rekt }] = await query<{ unique_rekt: string }>('SELECT count(DISTINCT user) as unique_rekt FROM hl_liquidations')
  pass(`${unique_rekt} unique liquidated addresses`)

  const [{ biggest_loss }] = await query<{ biggest_loss: string }>('SELECT min(closed_pnl) as biggest_loss FROM hl_liquidations')
  pass(`Biggest single loss: $${Number(biggest_loss).toFixed(0)}`)

  // Phase 3: Data consistency
  console.log('\n── Phase 3: Data Consistency ──')

  const [{ empty_user }] = await query<{ empty_user: string }>(`SELECT countIf(user = '') as empty_user FROM hl_liquidations`)
  if (Number(empty_user) === 0) pass('No empty user addresses')
  else fail(`${empty_user} rows with empty user`)

  const dirs = await query<{ dir: string; cnt: string }>('SELECT dir, count() as cnt FROM hl_liquidations GROUP BY dir ORDER BY cnt DESC')
  pass(`Direction breakdown: ${dirs.map(d => `${d.dir}(${d.cnt})`).join(', ')}`)

  // Long vs short liquidations
  const [{ long_liqs, short_liqs }] = await query<{ long_liqs: string; short_liqs: string }>(
    `SELECT countIf(dir = 'Close Long' OR dir = 'Long > Short') as long_liqs, countIf(dir = 'Close Short' OR dir = 'Short > Long') as short_liqs FROM hl_liquidations`
  )
  pass(`Long liquidations: ${long_liqs}, Short liquidations: ${short_liqs}`)

  console.log(`\n=== SUMMARY: ${passed} passed, ${failed} failed ===`)
  await client.close()
  process.exit(failed > 0 ? 1 : 0)
}

main().catch(e => { console.error(e); process.exit(1) })
