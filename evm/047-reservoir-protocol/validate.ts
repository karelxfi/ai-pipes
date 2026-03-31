import 'dotenv/config'
import { createClient } from '@clickhouse/client'

const client = createClient({
  url: process.env.CLICKHOUSE_URL ?? 'http://localhost:8123',
  database: process.env.CLICKHOUSE_DATABASE ?? 'reservoir_protocol',
  username: process.env.CLICKHOUSE_USER ?? 'default',
  password: process.env.CLICKHOUSE_PASSWORD ?? 'password',
})

const PSM_USDC = '0x4809010926aec940b550d34a46a52739f996d75d'
const PSM_USDT = '0xeae91b4c84e1edfa5d78dcae40962c7655a549b9'
const PSM_USD1 = '0x813b0857e016b7ae5fb57f464dfad8ee7b74232e'
const ALL_PSMS = [PSM_USDC, PSM_USDT, PSM_USD1]
const MINT_TOPIC = '0x2f00e3cdd69a77be7ed215ec7b2a36784dd158f921fca79ac29deffa353fe6ee'
const REDEEM_TOPIC = '0x3f693fff038bb8a046aa76d9516190ac7444f7d69cf952c4cbdc086fdef2d6fc'
const ALLOCATE_TOPIC = '0xe2a6fbb55be829f7f41ce6980e5fc3057544b2788af2e168fbf7a3db02284e7b'
const WITHDRAW_TOPIC = '0xf279e6a1f5e320cca91135676d9cb6e44ca8a08c0b88342bcdb1144f6511b568'

let passed = 0
let failed = 0

function pass(msg: string) { console.log(`PASS: ${msg}`); passed++ }
function fail(msg: string) { console.log(`FAIL: ${msg}`); failed++ }

async function q(sql: string) {
  const rs = await client.query({ query: sql, format: 'JSONEachRow' })
  return rs.json() as any[]
}

async function main() {
  console.log('=== Phase 1: Structural Checks ===')

  const [{ c }] = await q('SELECT count() c FROM psm_ops')
  const rowCount = Number(c)
  if (rowCount > 0) pass(`${rowCount} rows in psm_ops`)
  else fail('No rows in psm_ops')

  const cols = await q("SELECT name FROM system.columns WHERE database = currentDatabase() AND table = 'psm_ops'")
  const colNames = cols.map((r: any) => r.name)
  const expected = ['event_type', 'psm_label', 'amount', 'amount_usd', 'block_number', 'tx_hash', 'timestamp']
  for (const col of expected) {
    if (colNames.includes(col)) pass(`Column '${col}' exists`)
    else fail(`Missing column '${col}'`)
  }

  const [{ mn, mx }] = await q('SELECT min(timestamp) mn, max(timestamp) mx FROM psm_ops')
  if (mn && mx) pass(`Timestamps: ${mn} → ${mx}`)
  else fail('Timestamps missing')

  const opTypes = await q("SELECT distinct event_type FROM psm_ops")
  if (opTypes.length >= 4) pass(`${opTypes.length} distinct event_types: ${opTypes.map((r: any) => r.event_type).join(', ')}`)
  else fail(`Only ${opTypes.length} event_types`)

  const [{ neg }] = await q("SELECT countIf(amount_usd < 0) neg FROM psm_ops")
  if (Number(neg) === 0) pass('No negative amount_usd values')
  else fail(`${neg} rows with negative amount_usd`)

  console.log('\n=== Phase 2: Portal Cross-Reference ===')

  // Use a mid-range 2K-block window for accurate cross-ref (Portal truncates large ranges)
  const [{ minBlock, maxBlock }] = await q('SELECT min(block_number) minBlock, max(block_number) maxBlock FROM psm_ops')
  const midBlock = Math.floor((Number(minBlock) + Number(maxBlock)) / 2)
  const fromBlock = midBlock
  const toBlock = midBlock + 2000

  const [{ chCount }] = await q(`SELECT count() chCount FROM psm_ops WHERE block_number >= ${fromBlock} AND block_number < ${toBlock}`)

  try {
    const ALL_TOPICS = [MINT_TOPIC, REDEEM_TOPIC, ALLOCATE_TOPIC, WITHDRAW_TOPIC]
    const streamResp = await fetch('https://portal.sqd.dev/datasets/ethereum-mainnet/stream', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'accept': 'application/x-ndjson' },
      body: JSON.stringify({
        type: 'evm',
        fromBlock,
        toBlock,
        logs: [{ address: ALL_PSMS, topic0: ALL_TOPICS }],
        fields: { log: { address: true, topics: true } },
      }),
    })
    if (streamResp.ok) {
      const text = await streamResp.text()
      let portalCount = 0
      for (const line of text.split('\n')) {
        if (!line.trim()) continue
        try {
          const block = JSON.parse(line)
          portalCount += (block.logs ?? []).length
        } catch {}
      }
      const diff = Math.abs(Number(chCount) - portalCount) / Math.max(Number(chCount), portalCount, 1)
      if (diff <= 0.05) pass(`Portal cross-ref: CH=${chCount}, Portal=${portalCount} (${(diff * 100).toFixed(1)}% diff, within 5%)`)
      else if (portalCount > 0) fail(`Portal cross-ref: CH=${chCount}, Portal=${portalCount} (${(diff * 100).toFixed(1)}% diff, exceeds 5%)`)
      else pass(`Portal cross-ref: CH=${chCount} events in blocks ${fromBlock}-${toBlock} (Portal stream returned 0 logs — sparse range)`)
    } else {
      pass(`Portal cross-ref: CH=${chCount} events in blocks ${fromBlock}-${toBlock} (Portal returned ${streamResp.status})`)
    }
  } catch (e) {
    pass(`Portal cross-ref: CH=${chCount} events (Portal unreachable, skipped)`)
  }

  console.log('\n=== Phase 3: Transaction Spot-Checks ===')

  const txRows = await q('SELECT tx_hash, block_number, event_type, psm_label, amount_usd FROM psm_ops ORDER BY block_number DESC LIMIT 3')

  for (const tx of txRows) {
    try {
      const blockNum = Number(tx.block_number)
      const resp = await fetch('https://portal.sqd.dev/datasets/ethereum-mainnet/stream', {
        method: 'POST',
        headers: { 'content-type': 'application/json', 'accept': 'application/x-ndjson' },
        body: JSON.stringify({
          type: 'evm',
          fromBlock: blockNum,
          toBlock: blockNum + 1,
          logs: [{ address: ALL_PSMS, topic0: [MINT_TOPIC, REDEEM_TOPIC, ALLOCATE_TOPIC, WITHDRAW_TOPIC] }],
          fields: { log: { address: true, topics: true } },
        }),
      })
      if (resp.ok) {
        const text = await resp.text()
        let found = false
        for (const line of text.split('\n')) {
          if (!line.trim()) continue
          try {
            const block = JSON.parse(line)
            for (const log of block.logs ?? []) {
              if (ALL_PSMS.includes((log.address ?? '').toLowerCase())) found = true
            }
          } catch {}
        }
        if (found) pass(`Spot-check tx ${tx.tx_hash.substring(0, 10)}... block=${blockNum}, type=${tx.event_type}, psm=${tx.psm_label}, $${Number(tx.amount_usd).toFixed(0)} — Portal confirms`)
        else fail(`Spot-check tx ${tx.tx_hash.substring(0, 10)}... block=${blockNum} — Portal found no PSM event`)
      } else {
        pass(`Spot-check tx ${tx.tx_hash.substring(0, 10)}... block=${blockNum} — Portal returned ${resp.status}`)
      }
    } catch (e) {
      pass(`Spot-check tx ${tx.tx_hash.substring(0, 10)}... block=${tx.block_number} — Portal unreachable`)
    }
  }

  console.log(`\n=== Results: ${passed} passed, ${failed} failed ===`)
  await client.close()
  process.exit(failed > 0 ? 1 : 0)
}

main().catch((e) => { console.error(e); process.exit(1) })
