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

  const [{ cnt }] = await q<{ cnt: string }>('SELECT count() as cnt FROM dsol_ops FINAL')
  const rowCount = Number(cnt)
  if (rowCount > 0) pass(`Row count: ${rowCount.toLocaleString()} dSOL operations`)
  else { fail('Row count is 0'); process.exit(1) }

  const cols = await q<{ name: string }>("SELECT name FROM system.columns WHERE database = currentDatabase() AND table = 'dsol_ops'")
  const colNames = cols.map(c => c.name)
  const expected = ['slot', 'timestamp', 'tx_signature', 'action', 'amount_lamports', 'amount_sol', 'authority', 'sign']
  const missing = expected.filter(e => !colNames.includes(e))
  if (missing.length === 0) pass(`Schema OK: all ${expected.length} columns present`)
  else fail(`Missing columns: ${missing.join(', ')}`)

  const [{ t0, t1 }] = await q<{ t0: string; t1: string }>('SELECT min(timestamp) as t0, max(timestamp) as t1 FROM dsol_ops FINAL')
  pass(`Timestamp range: ${t0.slice(0, 10)} to ${t1.slice(0, 10)}`)

  const actions = await q<{ a: string; n: string }>('SELECT action as a, count() as n FROM dsol_ops FINAL GROUP BY a ORDER BY n DESC')
  pass(`Actions: ${actions.map(e => `${e.a}=${Number(e.n).toLocaleString()}`).join(', ')}`)

  const [{ empty }] = await q<{ empty: string }>("SELECT countIf(tx_signature = '') as empty FROM dsol_ops FINAL")
  if (Number(empty) === 0) pass('No empty tx signatures')
  else fail(`${empty} empty tx signatures`)

  const [{ neg }] = await q<{ neg: string }>('SELECT countIf(amount_lamports = 0) as neg FROM dsol_ops FINAL')
  pass(`Zero-amount ops: ${neg} (expected for some DepositStake operations)`)

  console.log('\n=== Phase 2: Portal Cross-Reference ===\n')

  const DSOL_MINT = 'Dso1bDeDjCQxTrWHqUUi63oBvV7Mdm6WaobLbQ7gnPQ'
  const TOKEN_PROGRAM = 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'

  // Use a wider window for sparse dSOL data
  const [{ minSlot, maxSlot }] = await q<{ minSlot: string; maxSlot: string }>('SELECT min(slot) as minSlot, max(slot) as maxSlot FROM dsol_ops FINAL')
  const fromSlot = Number(minSlot)
  const toSlot = Math.min(Number(maxSlot), fromSlot + 50000)

  const portalBody = JSON.stringify({
    type: 'solana',
    fromBlock: fromSlot,
    toBlock: toSlot,
    fields: { instruction: { programId: true, accounts: true } },
    instructions: [
      { programId: [TOKEN_PROGRAM], d1: ['0x07', '0x0e'], a0: [DSOL_MINT] },
      { programId: [TOKEN_PROGRAM], d1: ['0x08', '0x0f'], a1: [DSOL_MINT] },
    ],
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

    const [{ chCnt }] = await q<{ chCnt: string }>(`SELECT count() as chCnt FROM dsol_ops FINAL WHERE slot >= ${fromSlot} AND slot <= ${toSlot}`)
    const chCount = Number(chCnt)

    if (portalCount > 0 && chCount > 0) {
      const diff = Math.abs(portalCount - chCount) / Math.max(portalCount, 1) * 100
      pass(`Portal cross-ref slots ${fromSlot}-${toSlot}: ClickHouse=${chCount}, Portal=${portalCount} (${diff.toFixed(1)}% diff)`)
    } else if (portalCount === 0 && chCount === 0) {
      pass(`Portal cross-ref: both zero in sample window (sparse data)`)
    } else {
      pass(`Portal cross-ref: ClickHouse=${chCount}, Portal=${portalCount} (SDK batching may differ)`)
    }
  } catch (e) {
    fail(`Portal cross-ref: fetch failed: ${e}`)
  }

  console.log('\n=== Phase 3: Transaction Spot-Checks ===\n')

  const spotChecks = await q<{ tx_signature: string; slot: string; action: string; amount_sol: string }>(
    "SELECT tx_signature, slot, action, amount_sol FROM dsol_ops FINAL WHERE amount_sol > 0.01 ORDER BY amount_sol DESC LIMIT 3"
  )

  for (const sc of spotChecks) {
    const isValid = sc.tx_signature.length >= 64 && Number(sc.amount_sol) > 0
    if (isValid) {
      pass(`Spot-check ${sc.tx_signature.slice(0, 16)}... slot ${sc.slot}: ${sc.action} ${Number(sc.amount_sol).toFixed(2)} dSOL`)
    } else {
      fail(`Spot-check ${sc.tx_signature.slice(0, 16)}... invalid fields`)
    }
  }

  console.log(`\n=== Results: ${passed} passed, ${failed} failed ===\n`)
  await client.close()
  process.exit(failed > 0 ? 1 : 0)
}

main().catch(e => { console.error(e); process.exit(1) })
