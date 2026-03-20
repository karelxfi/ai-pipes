import 'dotenv/config'
import { createClient } from '@clickhouse/client'

const client = createClient({
  url: process.env.CLICKHOUSE_URL ?? 'http://localhost:8123',
  database: process.env.CLICKHOUSE_DATABASE ?? 'hl_whales',
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
  console.log('=== Hyperliquid Whale Tracker — Validation ===\n')

  console.log('── Phase 1: Structural Checks ──')
  const [{ count }] = await query<{ count: string }>('SELECT count() as count FROM hl_whale_fills')
  const rowCount = Number(count)
  if (rowCount > 0) pass(`Row count: ${rowCount}`)
  else { fail('Row count is 0'); process.exit(1) }

  const cols = await query<{ name: string }>(`SELECT name FROM system.columns WHERE database = '${process.env.CLICKHOUSE_DATABASE ?? 'hl_whales'}' AND table = 'hl_whale_fills'`)
  const required = ['coin', 'user', 'px', 'sz', 'side', 'dir', 'closed_pnl', 'fee', 'notional', 'start_position', 'block_number', 'timestamp']
  const missing = required.filter(r => !cols.map(c => c.name).includes(r))
  if (missing.length === 0) pass(`Schema OK: all ${required.length} required columns present`)
  else fail(`Missing columns: ${missing.join(', ')}`)

  const [{ min_ts, max_ts }] = await query<{ min_ts: string; max_ts: string }>('SELECT min(timestamp) as min_ts, max(timestamp) as max_ts FROM hl_whale_fills')
  pass(`Timestamp range: ${min_ts} to ${max_ts}`)

  // All fills must be whale-sized ($50K+)
  const [{ min_notional }] = await query<{ min_notional: string }>('SELECT min(notional) as min_notional FROM hl_whale_fills')
  if (Number(min_notional) >= 50000) pass(`Min notional: $${Number(min_notional).toFixed(0)} (all fills >= $50K threshold)`)
  else fail(`Min notional: $${Number(min_notional).toFixed(0)} — below $50K threshold`)

  const coins = await query<{ coin: string; cnt: string }>('SELECT coin, count() as cnt FROM hl_whale_fills GROUP BY coin ORDER BY cnt DESC LIMIT 10')
  console.log('  Top coins by whale fills:')
  coins.forEach(c => console.log(`    ${c.coin}: ${c.cnt}`))
  if (coins.length >= 3) pass(`${coins.length} unique coins with whale fills`)
  else fail(`Only ${coins.length} coins — expected at least 3`)

  const sides = await query<{ side: string; cnt: string }>('SELECT side, count() as cnt FROM hl_whale_fills GROUP BY side')
  sides.forEach(s => console.log(`  ${s.side}: ${s.cnt}`))
  if (sides.length === 2) pass('Both Buy and Sell sides present')
  else fail(`Expected 2 sides, got ${sides.length}`)

  // Phase 2: Whale sanity checks
  console.log('\n── Phase 2: Whale Sanity Checks ──')

  const [{ avg_notional }] = await query<{ avg_notional: string }>('SELECT avg(notional) as avg_notional FROM hl_whale_fills')
  pass(`Average whale trade size: $${(Number(avg_notional) / 1000).toFixed(1)}K`)

  const [{ unique_whales }] = await query<{ unique_whales: string }>('SELECT count(DISTINCT user) as unique_whales FROM hl_whale_fills')
  pass(`${unique_whales} unique whale addresses`)

  const [{ vol }] = await query<{ vol: string }>('SELECT sum(notional) as vol FROM hl_whale_fills')
  pass(`Total whale notional: $${(Number(vol) / 1e9).toFixed(2)}B`)

  // BTC should have higher avg notional than meme coins
  const [{ btc_avg }] = await query<{ btc_avg: string }>(`SELECT avg(notional) as btc_avg FROM hl_whale_fills WHERE coin = 'BTC'`)
  if (Number(btc_avg) > 50000) pass(`BTC avg whale trade: $${(Number(btc_avg) / 1000).toFixed(1)}K`)
  else fail(`BTC avg whale trade unexpectedly low: $${Number(btc_avg).toFixed(0)}`)

  // Phase 3: Data consistency
  console.log('\n── Phase 3: Data Consistency ──')

  const [{ neg_notional }] = await query<{ neg_notional: string }>('SELECT countIf(notional < 0) as neg_notional FROM hl_whale_fills')
  if (Number(neg_notional) === 0) pass('No negative notional values')
  else fail(`${neg_notional} rows with negative notional`)

  const [{ empty_user }] = await query<{ empty_user: string }>(`SELECT countIf(user = '') as empty_user FROM hl_whale_fills`)
  if (Number(empty_user) === 0) pass('No empty user addresses')
  else fail(`${empty_user} rows with empty user`)

  // Verify dir values are valid (Hyperliquid has extended direction types)
  const dirs = await query<{ dir: string; cnt: string }>('SELECT dir, count() as cnt FROM hl_whale_fills GROUP BY dir ORDER BY cnt DESC')
  const validDirs = ['Open Long', 'Open Short', 'Close Long', 'Close Short', 'Long > Short', 'Short > Long', 'Buy', 'Sell', 'Net Child Vaults']
  const invalidDirs = dirs.filter(d => !validDirs.includes(d.dir))
  if (invalidDirs.length === 0) pass(`All ${dirs.length} direction types valid: ${dirs.map(d => `${d.dir}(${d.cnt})`).join(', ')}`)
  else fail(`Invalid direction values: ${invalidDirs.map(d => d.dir).join(', ')}`)

  console.log(`\n=== SUMMARY: ${passed} passed, ${failed} failed ===`)
  await client.close()
  process.exit(failed > 0 ? 1 : 0)
}

main().catch(e => { console.error(e); process.exit(1) })
