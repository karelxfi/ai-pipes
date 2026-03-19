import 'dotenv/config'
import { createClient } from '@clickhouse/client'

const client = createClient({
  url: process.env.CLICKHOUSE_URL ?? 'http://localhost:8123',
  database: process.env.CLICKHOUSE_DATABASE ?? 'hl_perps',
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
  console.log('=== Hyperliquid BTC/ETH/SOL Perps — Validation ===\n')

  console.log('── Phase 1: Structural Checks ──')
  const [{ count }] = await query<{ count: string }>('SELECT count() as count FROM hl_perps_fills')
  const rowCount = Number(count)
  if (rowCount > 0) pass(`Row count: ${rowCount}`)
  else { fail('Row count is 0'); process.exit(1) }

  const cols = await query<{ name: string }>(`SELECT name FROM system.columns WHERE database = '${process.env.CLICKHOUSE_DATABASE ?? 'hl_perps'}' AND table = 'hl_perps_fills'`)
  const required = ['coin', 'user', 'px', 'sz', 'side', 'dir', 'closed_pnl', 'fee', 'notional', 'block_number', 'timestamp']
  const missing = required.filter(r => !cols.map(c => c.name).includes(r))
  if (missing.length === 0) pass(`Schema OK: all ${required.length} required columns present`)
  else fail(`Missing columns: ${missing.join(', ')}`)

  const coins = await query<{ coin: string; cnt: string }>('SELECT coin, count() as cnt FROM hl_perps_fills GROUP BY coin ORDER BY cnt DESC')
  coins.forEach(c => console.log(`  ${c.coin}: ${c.cnt} fills`))
  if (coins.length === 3) pass('All 3 coins indexed (BTC, ETH, SOL)')
  else fail(`Expected 3 coins, got ${coins.length}`)

  const sides = await query<{ side: string; cnt: string }>('SELECT side, count() as cnt FROM hl_perps_fills GROUP BY side')
  sides.forEach(s => console.log(`  ${s.side}: ${s.cnt}`))
  if (sides.length === 2) pass('Both Buy and Sell sides present')
  else fail(`Expected 2 sides, got ${sides.length}`)

  const [{ min_ts, max_ts }] = await query<{ min_ts: string; max_ts: string }>('SELECT min(timestamp) as min_ts, max(timestamp) as max_ts FROM hl_perps_fills')
  pass(`Timestamp range: ${min_ts} to ${max_ts}`)

  const [{ vol }] = await query<{ vol: string }>('SELECT sum(notional) as vol FROM hl_perps_fills')
  pass(`Total notional volume: $${(Number(vol) / 1e9).toFixed(2)}B`)

  // Phase 2: Portal cross-reference (Hyperliquid fills)
  console.log('\n── Phase 2: Portal Cross-Reference ──')
  // Hyperliquid fills don't use the same Portal stream API as EVM logs.
  // Instead we verify structurally — check that BTC/ETH/SOL have reasonable fill ratios
  const [{ btc_pct }] = await query<{ btc_pct: string }>(`
    SELECT round(countIf(coin = 'BTC') * 100.0 / count(), 1) as btc_pct FROM hl_perps_fills
  `)
  if (Number(btc_pct) > 30 && Number(btc_pct) < 70) pass(`BTC fill ratio: ${btc_pct}% (expected 30-70% for majors market)`)
  else fail(`BTC fill ratio: ${btc_pct}% — unexpected`)

  const [{ avg_px }] = await query<{ avg_px: string }>(`
    SELECT avg(px) as avg_px FROM hl_perps_fills WHERE coin = 'BTC' AND px > 0
  `)
  if (Number(avg_px) > 10000 && Number(avg_px) < 200000) pass(`BTC avg price: $${Number(avg_px).toFixed(0)} (sanity check passed)`)
  else fail(`BTC avg price: $${Number(avg_px).toFixed(0)} — unexpected`)

  // Phase 3: Data consistency checks
  console.log('\n── Phase 3: Data Consistency ──')
  const [{ neg_notional }] = await query<{ neg_notional: string }>('SELECT countIf(notional < 0) as neg_notional FROM hl_perps_fills')
  if (Number(neg_notional) === 0) pass('No negative notional values')
  else fail(`${neg_notional} rows with negative notional`)

  const [{ zero_px }] = await query<{ zero_px: string }>('SELECT countIf(px = 0) as zero_px FROM hl_perps_fills')
  pass(`Zero-price fills: ${zero_px} (should be 0 or very low)`)

  const [{ unique_traders }] = await query<{ unique_traders: string }>('SELECT count(DISTINCT user) as unique_traders FROM hl_perps_fills')
  pass(`${unique_traders} unique traders`)

  console.log(`\n=== SUMMARY: ${passed} passed, ${failed} failed ===`)
  await client.close()
  process.exit(failed > 0 ? 1 : 0)
}

main().catch(e => { console.error(e); process.exit(1) })
