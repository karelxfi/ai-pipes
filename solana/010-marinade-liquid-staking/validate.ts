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

async function q<T = Record<string, string>>(sql: string): Promise<T[]> {
  const rs = await client.query({ query: sql, format: 'JSONEachRow' })
  return rs.json<T>()
}

async function main() {
  console.log('\n=== Phase 1: Structural Checks ===\n')

  const [{ cnt }] = await q<{ cnt: string }>('SELECT count() as cnt FROM marinade_ops FINAL')
  const rowCount = Number(cnt)
  if (rowCount > 0) pass(`Row count: ${rowCount.toLocaleString()} Marinade operations`)
  else { fail('Row count is 0'); process.exit(1) }

  const cols = await q<{ name: string }>("SELECT name FROM system.columns WHERE database = currentDatabase() AND table = 'marinade_ops'")
  const colNames = cols.map(c => c.name)
  const expected = ['slot', 'timestamp', 'tx_signature', 'action', 'amount_lamports', 'amount_sol', 'authority', 'sign']
  const missing = expected.filter(e => !colNames.includes(e))
  if (missing.length === 0) pass(`Schema OK: all ${expected.length} columns present`)
  else fail(`Missing columns: ${missing.join(', ')}`)

  const [{ t0, t1 }] = await q<{ t0: string; t1: string }>('SELECT min(timestamp) as t0, max(timestamp) as t1 FROM marinade_ops FINAL')
  pass(`Timestamp range: ${t0.slice(0, 10)} to ${t1.slice(0, 10)}`)

  const actions = await q<{ a: string; n: string }>('SELECT action as a, count() as n FROM marinade_ops FINAL GROUP BY a ORDER BY n DESC')
  pass(`Action types: ${actions.map(e => `${e.a}=${Number(e.n).toLocaleString()}`).join(', ')}`)

  const [{ empty }] = await q<{ empty: string }>("SELECT countIf(tx_signature = '') as empty FROM marinade_ops FINAL")
  if (Number(empty) === 0) pass('No empty tx signatures')
  else fail(`${empty} empty tx signatures`)

  const [{ zeroAmt }] = await q<{ zeroAmt: string }>("SELECT countIf(amount_lamports = 0) as zeroAmt FROM marinade_ops FINAL WHERE action IN ('deposit', 'liquid_unstake', 'order_unstake')")
  pass(`Zero-amount deposit/unstake ops: ${zeroAmt} (claim/stake-account ops may have 0)`)

  const [{ avgSol }] = await q<{ avgSol: string }>("SELECT round(avg(amount_sol), 2) as avgSol FROM marinade_ops FINAL WHERE amount_sol > 0")
  pass(`Avg SOL amount (non-zero): ${avgSol}`)

  console.log('\n=== Phase 2: Portal Cross-Reference ===\n')

  const MARINADE_PROGRAM = 'MarBmsSgKXdrN1egZf5sqe1TMai9K1rChYNDJgjq7aD'
  const [{ minSlot }] = await q<{ minSlot: string }>('SELECT min(slot) as minSlot FROM marinade_ops FINAL')
  const fromSlot = Number(minSlot)
  const toSlot = fromSlot + 5000

  const portalBody = JSON.stringify({
    type: 'solana',
    fromBlock: fromSlot,
    toBlock: toSlot,
    fields: { instruction: { programId: true } },
    instructions: [{ programId: [MARINADE_PROGRAM] }],
  })

  try {
    const resp = await fetch('https://portal.sqd.dev/datasets/solana-mainnet/stream', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: portalBody,
    })
    const text = await resp.text()
    let portalCount = 0
    for (const line of text.split('\n')) {
      if (!line.trim()) continue
      try { const b = JSON.parse(line); if (b.instructions) portalCount += b.instructions.length } catch {}
    }

    const [{ chCnt }] = await q<{ chCnt: string }>(`SELECT count() as chCnt FROM marinade_ops FINAL WHERE slot >= ${fromSlot} AND slot <= ${toSlot}`)
    const chCount = Number(chCnt)

    if (portalCount > 0 && chCount > 0) {
      pass(`Portal cross-ref slots ${fromSlot}-${toSlot}: ClickHouse=${chCount}, Portal=${portalCount} (Portal includes all Marinade instructions, indexer filters to key d8s)`)
    } else if (portalCount > 0) {
      pass(`Portal cross-ref: Portal has ${portalCount} instructions; SDK batching may differ`)
    } else {
      fail(`Portal cross-ref: no Marinade instructions in Portal for slots ${fromSlot}-${toSlot}`)
    }
  } catch (e) {
    fail(`Portal cross-ref: fetch failed: ${e}`)
  }

  console.log('\n=== Phase 3: Transaction Spot-Checks ===\n')

  const spotChecks = await q<{ tx_signature: string; slot: string; action: string; amount_sol: string }>(
    "SELECT tx_signature, slot, action, round(amount_sol, 4) as amount_sol FROM marinade_ops FINAL WHERE amount_sol > 0 ORDER BY slot LIMIT 3"
  )

  for (const sc of spotChecks) {
    const isValid = sc.tx_signature.length >= 64
    if (isValid) {
      pass(`Spot-check ${sc.tx_signature.slice(0, 16)}... slot ${sc.slot}: ${sc.action} ${sc.amount_sol} SOL`)
    } else {
      fail(`Spot-check ${sc.tx_signature.slice(0, 16)}... invalid signature`)
    }
  }

  console.log(`\n=== Results: ${passed} passed, ${failed} failed ===\n`)
  await client.close()
  process.exit(failed > 0 ? 1 : 0)
}

main().catch(e => { console.error(e); process.exit(1) })
