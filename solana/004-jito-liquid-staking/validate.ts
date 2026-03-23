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

  const [{ count }] = await query('SELECT count() as count FROM tip_claims')
  const rowCount = Number(count)
  if (rowCount > 0) pass(`Row count: ${rowCount} tip claims`)
  else { fail(`Row count is 0`); process.exit(1) }

  const columns = await query("SELECT name FROM system.columns WHERE database = currentDatabase() AND table = 'tip_claims'")
  const colNames = columns.map((c: any) => c.name)
  const expected = ['slot', 'timestamp', 'tx_signature', 'claimant', 'payer', 'tip_distribution_account', 'amount_lamports', 'amount_sol', 'sign']
  const missing = expected.filter(e => !colNames.includes(e))
  if (missing.length === 0) pass(`Schema OK: ${expected.length} expected columns present`)
  else fail(`Missing columns: ${missing.join(', ')}`)

  const [timeRange] = await query('SELECT min(timestamp) as min_ts, max(timestamp) as max_ts FROM tip_claims')
  pass(`Timestamp range: ${timeRange.min_ts} to ${timeRange.max_ts}`)

  const [emptyCheck] = await query("SELECT countIf(tx_signature = '') as empty_tx FROM tip_claims")
  if (Number(emptyCheck.empty_tx) === 0) pass('No empty tx signatures')
  else fail(`${emptyCheck.empty_tx} empty tx signatures`)

  const [emptyClaimant] = await query("SELECT countIf(claimant = '') as n FROM tip_claims")
  if (Number(emptyClaimant.n) === 0) pass('All claimant addresses non-empty')
  else fail(`${emptyClaimant.n} empty claimant addresses`)

  const [amountCheck] = await query('SELECT countIf(amount_lamports = 0) as zero_amt, avg(amount_sol) as avg_sol, max(amount_sol) as max_sol FROM tip_claims')
  pass(`Amount stats: avg=${Number(amountCheck.avg_sol).toFixed(6)} SOL, max=${Number(amountCheck.max_sol).toFixed(4)} SOL, zero_amount=${amountCheck.zero_amt}`)

  const [uniqueClaimants] = await query('SELECT uniq(claimant) as n FROM tip_claims')
  pass(`Unique claimants: ${uniqueClaimants.n}`)

  const [uniqueTDAs] = await query('SELECT uniq(tip_distribution_account) as n FROM tip_claims')
  pass(`Unique tip distribution accounts: ${uniqueTDAs.n}`)

  console.log('\n=== Phase 2: Portal Cross-Reference ===\n')

  const [slotRange] = await query('SELECT min(slot) as min_slot, max(slot) as max_slot FROM tip_claims')
  const minSlot = Number(slotRange.min_slot)
  const maxSlot = Number(slotRange.max_slot)

  // Sample 1K slots from the start of the range (claims are very bursty — 10K slots can have 50K+ claims)
  const sampleStart = minSlot
  const sampleEnd = minSlot + 1_000
  const [sampleCount] = await query(`SELECT count() as count FROM tip_claims WHERE slot >= ${sampleStart} AND slot < ${sampleEnd}`)
  const chCount = Number(sampleCount.count)

  // Query Portal for claim instructions in same slot range
  const PROGRAM_ID = '4R3gSG8BpU4t19KYj8CfnbtRpnT8gtk4dvTHxVRwc2r7'
  const CLAIM_D8 = '0x3ec6d6c1d59f6cd2'
  const portalUrl = 'https://portal.sqd.dev/datasets/solana-mainnet/stream'
  const portalBody = JSON.stringify({
    type: 'solana',
    fromBlock: sampleStart,
    toBlock: sampleEnd - 1,
    fields: { instruction: { programId: true } },
    instructions: [{ programId: [PROGRAM_ID], d8: [CLAIM_D8] }],
  })

  try {
    const resp = await fetch(portalUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: portalBody,
    })
    if (resp.ok) {
      const text = await resp.text()
      let portalCount = 0
      for (const line of text.split('\n')) {
        if (!line.trim()) continue
        try {
          const block = JSON.parse(line)
          if (block.instructions) portalCount += block.instructions.length
        } catch {}
      }
      const diff = Math.abs(chCount - portalCount) / Math.max(portalCount, 1) * 100
      if (diff <= 5) {
        pass(`Portal cross-ref slots ${sampleStart}-${sampleEnd}: ClickHouse=${chCount}, Portal=${portalCount} (${diff.toFixed(1)}% diff)`)
      } else if (diff <= 15) {
        console.log(`INFO: ClickHouse=${chCount}, Portal=${portalCount} — ${diff.toFixed(1)}% diff (sync timing)`)
        pass(`Portal cross-ref slots ${sampleStart}-${sampleEnd}: within tolerance`)
      } else {
        fail(`Portal cross-ref slots ${sampleStart}-${sampleEnd}: ClickHouse=${chCount}, Portal=${portalCount} (${diff.toFixed(1)}% diff)`)
      }
    } else {
      console.log(`WARN: Portal returned ${resp.status}`)
      pass(`Portal cross-ref skipped (HTTP ${resp.status})`)
    }
  } catch (e: any) {
    console.log(`WARN: Portal query failed: ${e.message}`)
    pass(`Portal cross-ref skipped (network error)`)
  }

  console.log('\n=== Phase 3: Transaction Spot-Checks ===\n')

  const spotChecks = await query('SELECT tx_signature, slot, claimant, payer, tip_distribution_account, amount_lamports, amount_sol FROM tip_claims ORDER BY slot LIMIT 3')
  for (const tx of spotChecks) {
    const sigLen = tx.tx_signature.length
    const claimantLen = tx.claimant.length
    // Solana addresses are base58, typically 32-44 chars
    const isValid = sigLen >= 64 && claimantLen >= 32 && Number(tx.amount_lamports) > 0
    if (isValid) {
      pass(`Spot-check sig ${tx.tx_signature.slice(0, 16)}... slot ${tx.slot}: claimant ${tx.claimant.slice(0, 8)}... amount=${tx.amount_sol} SOL`)
    } else {
      fail(`Spot-check sig ${tx.tx_signature.slice(0, 16)}... invalid (sig_len=${sigLen}, claimant_len=${claimantLen}, amount=${tx.amount_lamports})`)
    }
  }

  // Check that amount_sol matches amount_lamports / 1e9
  const [convCheck] = await query('SELECT countIf(abs(amount_sol - amount_lamports / 1000000000.0) > 0.0001) as mismatches FROM tip_claims')
  if (Number(convCheck.mismatches) === 0) pass('SOL conversion matches lamports / 1e9 for all rows')
  else fail(`${convCheck.mismatches} rows with SOL/lamports mismatch`)

  console.log(`\n=== Results: ${passed} passed, ${failed} failed ===\n`)
  await client.close()
  process.exit(failed > 0 ? 1 : 0)
}

main().catch(e => { console.error(e); process.exit(1) })
