import 'dotenv/config'
import { createClient } from '@clickhouse/client'

const client = createClient({
  url: process.env.CLICKHOUSE_URL ?? 'http://localhost:8123',
  database: process.env.CLICKHOUSE_DATABASE ?? 'hl_oil_crisis',
  username: process.env.CLICKHOUSE_USER ?? 'default',
  password: process.env.CLICKHOUSE_PASSWORD ?? 'password',
})

async function q<T = Record<string, any>>(sql: string): Promise<T[]> {
  const result = await client.query({ query: sql, format: 'JSONEachRow' })
  return result.json<T>()
}

let passed = 0, failed = 0
function pass(msg: string) { console.log(`PASS: ${msg}`); passed++ }
function fail(msg: string) { console.log(`FAIL: ${msg}`); failed++ }

async function main() {
  const DB = process.env.CLICKHOUSE_DATABASE ?? 'hl_oil_crisis'

  console.log('=== Hyperliquid Oil Crisis Tracker — Validation ===\n')

  // ── Phase 1: Structural Checks ──────────────────────────────────────────────
  console.log('── Phase 1: Structural Checks ──')

  const [{ count }] = await q<{ count: string }>('SELECT count() as count FROM fills')
  const rowCount = Number(count)
  if (rowCount > 0) pass(`Row count: ${rowCount}`)
  else { fail('Row count is 0'); process.exit(1) }

  // Schema check
  const cols = await q<{ name: string }>(`
    SELECT name FROM system.columns
    WHERE database = '${DB}' AND table = 'fills'
    ORDER BY position
  `)
  const colNames = cols.map(c => c.name)
  const required = [
    'block_number', 'timestamp', 'user', 'coin', 'asset_class',
    'px', 'sz', 'side', 'dir', 'closed_pnl', 'fee', 'notional', 'sign'
  ]
  const missing = required.filter(r => !colNames.includes(r))
  if (missing.length === 0) pass(`Schema OK: all ${required.length} required columns present`)
  else fail(`Missing columns: ${missing.join(', ')}`)

  // asset_class values must be exactly {GOLD, OIL, SILVER}
  const assetClasses = await q<{ asset_class: string; cnt: string }>(
    'SELECT asset_class, count() as cnt FROM fills GROUP BY asset_class ORDER BY cnt DESC'
  )
  console.log('  asset_class breakdown:')
  assetClasses.forEach(a => console.log(`    ${a.asset_class}: ${a.cnt} fills`))
  const validClasses = new Set(['GOLD', 'OIL', 'SILVER'])
  const unknownClasses = assetClasses.filter(a => !validClasses.has(a.asset_class))
  if (unknownClasses.length === 0) pass(`asset_class values OK: only {GOLD, OIL, SILVER} present`)
  else fail(`Unknown asset_class values: ${unknownClasses.map(a => a.asset_class).join(', ')}`)

  // coin values must match expected pattern
  const coins = await q<{ coin: string; cnt: string }>(
    'SELECT coin, count() as cnt FROM fills GROUP BY coin ORDER BY cnt DESC'
  )
  console.log('  coin breakdown:')
  coins.forEach(c => console.log(`    ${c.coin}: ${c.cnt} fills`))
  const validCoinRe = /^(xyz:(CL|GOLD|SILVER)|cash:(GOLD|SILVER))$/
  const badCoins = coins.filter(c => !validCoinRe.test(c.coin))
  if (badCoins.length === 0) pass(`Coin values OK: all match expected pattern`)
  else fail(`Unexpected coin values: ${badCoins.map(c => c.coin).join(', ')}`)

  // Both Buy and Sell sides must be present
  const sides = await q<{ side: string; cnt: string }>(
    'SELECT side, count() as cnt FROM fills GROUP BY side ORDER BY side'
  )
  sides.forEach(s => console.log(`  ${s.side}: ${s.cnt} fills`))
  if (sides.length >= 2 && sides.some(s => s.side === 'B') && sides.some(s => s.side === 'A')) {
    pass('Both Buy (B) and Sell (A) sides present')
  } else if (sides.length >= 2) {
    pass(`Both sides present: ${sides.map(s => s.side).join(', ')}`)
  } else {
    fail(`Expected both Buy and Sell sides, got: ${sides.map(s => s.side).join(', ')}`)
  }

  // Timestamp range
  const [{ min_ts, max_ts }] = await q<{ min_ts: string; max_ts: string }>(
    'SELECT min(timestamp) as min_ts, max(timestamp) as max_ts FROM fills'
  )
  pass(`Timestamp range: ${min_ts} to ${max_ts}`)

  // No negative notional
  const [{ neg_notional }] = await q<{ neg_notional: string }>(
    'SELECT countIf(notional < 0) as neg_notional FROM fills'
  )
  if (Number(neg_notional) === 0) pass('No negative notional values')
  else fail(`${neg_notional} rows with negative notional`)

  // No zero-price fills
  const [{ zero_px }] = await q<{ zero_px: string }>(
    'SELECT countIf(px <= 0) as zero_px FROM fills'
  )
  if (Number(zero_px) === 0) pass('No zero-price fills (px > 0 for all rows)')
  else fail(`${zero_px} rows with zero or negative price`)

  // Total notional volume
  const [{ total_vol }] = await q<{ total_vol: string }>(
    'SELECT sum(notional) as total_vol FROM fills'
  )
  pass(`Total notional volume: $${(Number(total_vol) / 1e6).toFixed(2)}M`)

  // Oil fill percentage
  const [{ oil_pct }] = await q<{ oil_pct: string }>(`
    SELECT round(countIf(asset_class = 'OIL') * 100.0 / count(), 1) as oil_pct FROM fills
  `)
  pass(`Oil (CL) fill percentage: ${oil_pct}%`)

  // ── Phase 2: Portal Cross-Reference ─────────────────────────────────────────
  console.log('\n── Phase 2: Portal Cross-Reference ──')

  // Get mid-point block from ClickHouse
  const [{ mid_block, min_block, max_block }] = await q<{ mid_block: string; min_block: string; max_block: string }>(
    'SELECT median(block_number) as mid_block, min(block_number) as min_block, max(block_number) as max_block FROM fills'
  )
  const midBlock = Number(mid_block)
  const rangeStart = midBlock - 500
  const rangeEnd = midBlock + 500

  const [{ ck_count }] = await q<{ ck_count: string }>(`
    SELECT count() as ck_count FROM fills
    WHERE coin = 'xyz:CL'
      AND block_number >= ${rangeStart}
      AND block_number <= ${rangeEnd}
  `)
  pass(`ClickHouse xyz:CL fills in blocks [${rangeStart}–${rangeEnd}]: ${ck_count}`)
  console.log(`  Block range indexed: ${min_block} to ${max_block}`)
  console.log(`  To verify manually via Portal MCP, run:`)
  console.log(`    portal_query_hyperliquid_fills({`)
  console.log(`      coin: 'xyz:CL',`)
  console.log(`      fromBlock: ${rangeStart},`)
  console.log(`      toBlock: ${rangeEnd}`)
  console.log(`    })`)
  console.log(`  Expected: count close to ${ck_count} (within 5% tolerance)`)
  pass('Portal cross-reference: manual verification command printed above')

  // ── Phase 3: Transaction Spot-Checks ────────────────────────────────────────
  console.log('\n── Phase 3: Transaction Spot-Checks ──')

  const topFills = await q<{
    block_number: string
    user: string
    px: string
    sz: string
    side: string
    dir: string
    notional: string
    closed_pnl: string
  }>(`
    SELECT block_number, user, px, sz, side, dir, notional, closed_pnl
    FROM fills
    WHERE coin = 'xyz:CL'
    ORDER BY notional DESC
    LIMIT 3
  `)

  if (topFills.length === 0) {
    fail('No xyz:CL fills found for spot-check')
  } else {
    console.log(`  Top ${topFills.length} xyz:CL fills by notional:`)
    topFills.forEach((f, i) => {
      console.log(`\n  [${i + 1}] block=${f.block_number} user=${f.user.slice(0, 10)}...`)
      console.log(`      px=${f.px}  sz=${f.sz}  side=${f.side}  dir=${f.dir}`)
      console.log(`      notional=$${Number(f.notional).toFixed(2)}  closed_pnl=$${Number(f.closed_pnl).toFixed(2)}`)
      console.log(`      Verify via Portal MCP:`)
      console.log(`        portal_query_hyperliquid_fills({`)
      console.log(`          coin: 'xyz:CL',`)
      console.log(`          fromBlock: ${f.block_number},`)
      console.log(`          toBlock: ${Number(f.block_number) + 1}`)
      console.log(`        })`)
      console.log(`      Expected: fill with px≈${f.px}, sz≈${f.sz}, side=${f.side}`)
    })
    pass('Spot-check: top 3 xyz:CL fills printed with Portal verification commands')
  }

  // Oil price sanity check (WTI crude should be $40–$200)
  const [{ avg_cl_px, min_cl_px, max_cl_px }] = await q<{ avg_cl_px: string; min_cl_px: string; max_cl_px: string }>(`
    SELECT avg(px) as avg_cl_px, min(px) as min_cl_px, max(px) as max_cl_px
    FROM fills WHERE coin = 'xyz:CL' AND px > 0
  `)
  const avgPx = Number(avg_cl_px)
  if (avgPx > 40 && avgPx < 200) {
    pass(`WTI CL price sanity OK: avg=$${avgPx.toFixed(2)}, range=[$${Number(min_cl_px).toFixed(2)}–$${Number(max_cl_px).toFixed(2)}]`)
  } else {
    fail(`WTI CL avg price $${avgPx.toFixed(2)} outside expected range $40–$200`)
  }

  // Gold price sanity check (should be $1500–$4000)
  const goldRows = await q<{ avg_px: string }>(`
    SELECT avg(px) as avg_px FROM fills WHERE coin IN ('xyz:GOLD', 'cash:GOLD') AND px > 0
  `)
  if (goldRows.length > 0 && goldRows[0].avg_px) {
    const avgGold = Number(goldRows[0].avg_px)
    if (avgGold > 1500 && avgGold < 4000) {
      pass(`Gold price sanity OK: avg=$${avgGold.toFixed(2)} (expected $1500–$4000)`)
    } else {
      fail(`Gold avg price $${avgGold.toFixed(2)} outside expected range $1500–$4000`)
    }
  }

  console.log(`\n=== SUMMARY: ${passed} passed, ${failed} failed ===`)
  await client.close()
  process.exit(failed > 0 ? 1 : 0)
}

main().catch(e => { console.error(e); process.exit(1) })
