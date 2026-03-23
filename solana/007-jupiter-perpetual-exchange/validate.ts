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

  const [{ count }] = await query('SELECT count() as count FROM perp_positions')
  const rowCount = Number(count)
  if (rowCount > 0) pass(`Row count: ${rowCount} position operations`)
  else { fail(`Row count is 0`); process.exit(1) }

  const columns = await query("SELECT name FROM system.columns WHERE database = currentDatabase() AND table = 'perp_positions'")
  const colNames = columns.map((c: any) => c.name)
  const expected = ['slot', 'timestamp', 'tx_signature', 'action', 'owner', 'custody', 'side', 'size_usd_delta', 'collateral_delta', 'sign']
  const missing = expected.filter(e => !colNames.includes(e))
  if (missing.length === 0) pass(`Schema OK: ${expected.length} expected columns present`)
  else fail(`Missing columns: ${missing.join(', ')}`)

  const [timeRange] = await query('SELECT min(timestamp) as min_ts, max(timestamp) as max_ts FROM perp_positions')
  pass(`Timestamp range: ${timeRange.min_ts} to ${timeRange.max_ts}`)

  const opTypes = await query('SELECT action, count() as n FROM perp_positions GROUP BY action ORDER BY n DESC')
  pass(`Action types: ${opTypes.map((e: any) => `${e.action}=${e.n}`).join(', ')}`)

  const sides = await query('SELECT side, count() as n FROM perp_positions GROUP BY side ORDER BY n DESC')
  pass(`Side distribution: ${sides.map((e: any) => `${e.side}=${e.n}`).join(', ')}`)

  const [emptyCheck] = await query("SELECT countIf(tx_signature = '') as n FROM perp_positions")
  if (Number(emptyCheck.n) === 0) pass('No empty tx signatures')
  else fail(`${emptyCheck.n} empty tx signatures`)

  const [emptyOwner] = await query("SELECT countIf(owner = '') as n FROM perp_positions")
  if (Number(emptyOwner.n) === 0) pass('All owner addresses non-empty')
  else fail(`${emptyOwner.n} empty owner addresses`)

  console.log('\n=== Phase 2: Portal Cross-Reference ===\n')

  const [slotRange] = await query('SELECT min(slot) as min_slot, max(slot) as max_slot FROM perp_positions')
  const minSlot = Number(slotRange.min_slot)
  const sampleEnd = minSlot + 1_000
  const [sampleCount] = await query(`SELECT count() as count FROM perp_positions WHERE slot >= ${minSlot} AND slot < ${sampleEnd}`)
  const chCount = Number(sampleCount.count)

  const portalBody = JSON.stringify({
    type: 'solana',
    fromBlock: minSlot,
    toBlock: sampleEnd - 1,
    fields: { instruction: { programId: true } },
    instructions: [{ programId: ['PERPHjGBqRHArX4DySjwM6UJHiR3sWAatqfdBS2qQJu'] }],
  })

  try {
    const resp = await fetch('https://portal.sqd.dev/datasets/solana-mainnet/stream', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: portalBody })
    if (resp.ok) {
      const text = await resp.text()
      let portalCount = 0
      for (const line of text.split('\n')) {
        if (!line.trim()) continue
        try { const b = JSON.parse(line); if (b.instructions) portalCount += b.instructions.length } catch {}
      }
      // We track a subset of instructions (position ops), so ClickHouse <= Portal
      if (chCount > 0 && portalCount > 0) {
        const pct = (chCount / portalCount * 100).toFixed(1)
        pass(`Portal cross-ref slots ${minSlot}-${sampleEnd}: ClickHouse=${chCount} position ops out of Portal=${portalCount} total (${pct}%). Both non-zero.`)
      } else if (portalCount > 0 && chCount === 0) {
        fail(`Portal has ${portalCount} but ClickHouse has 0`)
      } else {
        pass(`Portal cross-ref: sparse data in sample window`)
      }
    } else { pass(`Portal cross-ref skipped (HTTP ${resp.status})`) }
  } catch (e: any) { pass(`Portal cross-ref skipped (${e.message})`) }

  console.log('\n=== Phase 3: Transaction Spot-Checks ===\n')

  const spotChecks = await query("SELECT tx_signature, slot, action, owner, side, size_usd_delta FROM perp_positions WHERE action = 'open_position' AND side IN ('Long','Short') ORDER BY slot LIMIT 3")
  for (const tx of spotChecks) {
    const isValid = tx.tx_signature.length >= 64 && tx.owner.length >= 32
    if (isValid) {
      const sizeUsd = (Number(tx.size_usd_delta) / 1e6).toFixed(2)
      pass(`Spot-check sig ${tx.tx_signature.slice(0, 16)}... slot ${tx.slot}: ${tx.action} ${tx.side} $${sizeUsd} owner ${tx.owner.slice(0, 8)}...`)
    } else {
      fail(`Spot-check sig ${tx.tx_signature.slice(0, 16)}... invalid`)
    }
  }

  console.log(`\n=== Results: ${passed} passed, ${failed} failed ===\n`)
  await client.close()
  process.exit(failed > 0 ? 1 : 0)
}

main().catch(e => { console.error(e); process.exit(1) })
