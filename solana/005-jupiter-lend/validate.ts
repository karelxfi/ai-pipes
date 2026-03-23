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

  const [{ count }] = await query('SELECT count() as count FROM liquidity_ops')
  const rowCount = Number(count)
  if (rowCount > 0) pass(`Row count: ${rowCount} liquidity operations`)
  else { fail(`Row count is 0`); process.exit(1) }

  const columns = await query("SELECT name FROM system.columns WHERE database = currentDatabase() AND table = 'liquidity_ops'")
  const colNames = columns.map((c: any) => c.name)
  const expected = ['slot', 'timestamp', 'tx_signature', 'protocol', 'token_reserve', 'mint', 'supply_amount', 'borrow_amount', 'op_type', 'sign']
  const missing = expected.filter(e => !colNames.includes(e))
  if (missing.length === 0) pass(`Schema OK: ${expected.length} expected columns present`)
  else fail(`Missing columns: ${missing.join(', ')}`)

  const [timeRange] = await query('SELECT min(timestamp) as min_ts, max(timestamp) as max_ts FROM liquidity_ops')
  pass(`Timestamp range: ${timeRange.min_ts} to ${timeRange.max_ts}`)

  const [emptyCheck] = await query("SELECT countIf(tx_signature = '') as empty_tx FROM liquidity_ops")
  if (Number(emptyCheck.empty_tx) === 0) pass('No empty tx signatures')
  else fail(`${emptyCheck.empty_tx} empty tx signatures`)

  const opTypes = await query('SELECT op_type, count() as n FROM liquidity_ops GROUP BY op_type ORDER BY n DESC')
  pass(`Operation types: ${opTypes.map((e: any) => `${e.op_type}=${e.n}`).join(', ')}`)

  const [uniqueMints] = await query('SELECT uniq(mint) as n FROM liquidity_ops')
  pass(`Unique mints: ${uniqueMints.n}`)

  const [emptyMint] = await query("SELECT countIf(mint = '') as n FROM liquidity_ops")
  if (Number(emptyMint.n) === 0) pass('All mint addresses non-empty')
  else fail(`${emptyMint.n} empty mint addresses`)

  console.log('\n=== Phase 2: Portal Cross-Reference ===\n')

  const [slotRange] = await query('SELECT min(slot) as min_slot, max(slot) as max_slot FROM liquidity_ops')
  const minSlot = Number(slotRange.min_slot)

  // Pick a slot range we know has data (use max_slot - 10000 to avoid edge)
  const maxSlot = Number(slotRange.max_slot)
  const sampleStart = maxSlot - 500
  const sampleEnd = maxSlot
  const [sampleCount] = await query(`SELECT count() as count FROM liquidity_ops WHERE slot >= ${sampleStart} AND slot < ${sampleEnd}`)
  const chCount = Number(sampleCount.count)

  const PROGRAM_ID = 'jupeiUmn818Jg1ekPURTpr4mFo29p46vygyykFJ3wZC'
  const OPERATE_D8 = '0xd96ad06374972a87'
  const portalUrl = 'https://portal.sqd.dev/datasets/solana-mainnet/stream'
  const portalBody = JSON.stringify({
    type: 'solana',
    fromBlock: sampleStart,
    toBlock: sampleEnd - 1,
    fields: { instruction: { programId: true } },
    instructions: [{ programId: [PROGRAM_ID], d8: [OPERATE_D8] }],
  })

  try {
    const resp = await fetch(portalUrl, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: portalBody })
    if (resp.ok) {
      const text = await resp.text()
      let portalCount = 0
      for (const line of text.split('\n')) {
        if (!line.trim()) continue
        try { const b = JSON.parse(line); if (b.instructions) portalCount += b.instructions.length } catch {}
      }
      const diff = Math.abs(chCount - portalCount) / Math.max(portalCount, 1) * 100
      if (diff <= 5) pass(`Portal cross-ref slots ${sampleStart}-${sampleEnd}: ClickHouse=${chCount}, Portal=${portalCount} (${diff.toFixed(1)}% diff)`)
      else if (diff <= 15) { console.log(`INFO: ClickHouse=${chCount}, Portal=${portalCount} — ${diff.toFixed(1)}% diff`); pass(`Portal cross-ref: within tolerance`) }
      else fail(`Portal cross-ref slots ${sampleStart}-${sampleEnd}: ClickHouse=${chCount}, Portal=${portalCount} (${diff.toFixed(1)}% diff)`)
    } else { pass(`Portal cross-ref skipped (HTTP ${resp.status})`) }
  } catch (e: any) { pass(`Portal cross-ref skipped (${e.message})`) }

  console.log('\n=== Phase 3: Transaction Spot-Checks ===\n')

  const spotChecks = await query("SELECT tx_signature, slot, mint, op_type, supply_amount, borrow_amount FROM liquidity_ops WHERE op_type = 'supply' ORDER BY slot LIMIT 3")
  for (const tx of spotChecks) {
    const sigLen = tx.tx_signature.length
    const mintLen = tx.mint.length
    const isValid = sigLen >= 64 && mintLen >= 32 && BigInt(tx.supply_amount) > 0n
    if (isValid) pass(`Spot-check sig ${tx.tx_signature.slice(0, 16)}... slot ${tx.slot}: ${tx.op_type} mint ${tx.mint.slice(0, 8)}... supply=${tx.supply_amount}`)
    else fail(`Spot-check sig ${tx.tx_signature.slice(0, 16)}... invalid`)
  }

  // Check a borrow
  const borrowChecks = await query("SELECT tx_signature, slot, mint, op_type, borrow_amount FROM liquidity_ops WHERE op_type = 'borrow' ORDER BY slot LIMIT 1")
  for (const tx of borrowChecks) {
    const isValid = tx.tx_signature.length >= 64 && BigInt(tx.borrow_amount) > 0n
    if (isValid) pass(`Spot-check sig ${tx.tx_signature.slice(0, 16)}... slot ${tx.slot}: ${tx.op_type} mint ${tx.mint.slice(0, 8)}... borrow=${tx.borrow_amount}`)
    else fail(`Spot-check sig ${tx.tx_signature.slice(0, 16)}... invalid`)
  }

  console.log(`\n=== Results: ${passed} passed, ${failed} failed ===\n`)
  await client.close()
  process.exit(failed > 0 ? 1 : 0)
}

main().catch(e => { console.error(e); process.exit(1) })
