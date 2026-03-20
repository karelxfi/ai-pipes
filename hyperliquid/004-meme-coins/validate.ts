import 'dotenv/config'
import { createClient } from '@clickhouse/client'

const client = createClient({
  url: process.env.CLICKHOUSE_URL ?? 'http://localhost:8123',
  database: process.env.CLICKHOUSE_DATABASE ?? 'hl_memes',
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
  console.log('=== Hyperliquid Meme Coins — Validation ===\n')

  console.log('── Phase 1: Structural Checks ──')
  const [{ count }] = await query<{ count: string }>('SELECT count() as count FROM hl_meme_fills')
  const rowCount = Number(count)
  if (rowCount > 0) pass(`Row count: ${rowCount}`)
  else { fail('Row count is 0'); process.exit(1) }

  const cols = await query<{ name: string }>(`SELECT name FROM system.columns WHERE database = '${process.env.CLICKHOUSE_DATABASE ?? 'hl_memes'}' AND table = 'hl_meme_fills'`)
  const required = ['coin', 'user', 'px', 'sz', 'side', 'dir', 'closed_pnl', 'fee', 'notional', 'block_number', 'timestamp']
  const missing = required.filter(r => !cols.map(c => c.name).includes(r))
  if (missing.length === 0) pass(`Schema OK: all ${required.length} required columns present`)
  else fail(`Missing columns: ${missing.join(', ')}`)

  const [{ min_ts, max_ts }] = await query<{ min_ts: string; max_ts: string }>('SELECT min(timestamp) as min_ts, max(timestamp) as max_ts FROM hl_meme_fills')
  pass(`Timestamp range: ${min_ts} to ${max_ts}`)

  const coins = await query<{ coin: string; cnt: string }>('SELECT coin, count() as cnt FROM hl_meme_fills GROUP BY coin ORDER BY cnt DESC')
  console.log('  Meme coins by fill count:')
  coins.forEach(c => console.log(`    ${c.coin}: ${c.cnt}`))
  if (coins.length >= 5) pass(`${coins.length} meme coins indexed`)
  else fail(`Only ${coins.length} meme coins — expected at least 5`)

  const sides = await query<{ side: string; cnt: string }>('SELECT side, count() as cnt FROM hl_meme_fills GROUP BY side')
  pass(`Sides: ${sides.map(s => `${s.side}(${s.cnt})`).join(', ')} (fills API returns one counterparty per fill)`)

  // Phase 2: Meme coin sanity checks
  console.log('\n── Phase 2: Meme Coin Sanity Checks ──')

  const [{ vol }] = await query<{ vol: string }>('SELECT sum(notional) as vol FROM hl_meme_fills')
  pass(`Total meme coin volume: $${(Number(vol) / 1e6).toFixed(1)}M`)

  const [{ unique_traders }] = await query<{ unique_traders: string }>('SELECT count(DISTINCT user) as unique_traders FROM hl_meme_fills')
  pass(`${unique_traders} unique meme coin traders`)

  // Meme coins should have low prices (sub-$1 for most)
  const [{ doge_avg }] = await query<{ doge_avg: string }>(`SELECT avg(px) as doge_avg FROM hl_meme_fills WHERE coin = 'DOGE' AND px > 0`)
  if (Number(doge_avg) < 10) pass(`DOGE avg price: $${Number(doge_avg).toFixed(4)} (sanity check)`)
  else fail(`DOGE avg price unexpectedly high: $${Number(doge_avg).toFixed(4)}`)

  // Phase 3: Data consistency
  console.log('\n── Phase 3: Data Consistency ──')

  const [{ neg_notional }] = await query<{ neg_notional: string }>('SELECT countIf(notional < 0) as neg_notional FROM hl_meme_fills')
  if (Number(neg_notional) === 0) pass('No negative notional values')
  else fail(`${neg_notional} rows with negative notional`)

  const [{ empty_user }] = await query<{ empty_user: string }>(`SELECT countIf(user = '') as empty_user FROM hl_meme_fills`)
  if (Number(empty_user) === 0) pass('No empty user addresses')
  else fail(`${empty_user} rows with empty user`)

  const dirs = await query<{ dir: string; cnt: string }>('SELECT dir, count() as cnt FROM hl_meme_fills GROUP BY dir ORDER BY cnt DESC')
  pass(`Direction breakdown: ${dirs.map(d => `${d.dir}(${d.cnt})`).join(', ')}`)

  console.log(`\n=== SUMMARY: ${passed} passed, ${failed} failed ===`)
  await client.close()
  process.exit(failed > 0 ? 1 : 0)
}

main().catch(e => { console.error(e); process.exit(1) })
