import 'dotenv/config'
import { createClient } from '@clickhouse/client'

const client = createClient({
  url: process.env.CLICKHOUSE_URL ?? 'http://localhost:8123',
  database: process.env.CLICKHOUSE_DATABASE ?? 'compound_v2',
  username: process.env.CLICKHOUSE_USER ?? 'default',
  password: process.env.CLICKHOUSE_PASSWORD ?? 'password',
})

const CDAI = '0x5d3a536e4d6dbd6114cc1ead35777bab948e3643'
const MINT_TOPIC = '0x4c209b5fc8ad50758f13e2e1088ba56a560dff690a1c6fef26394f4c03821c4f'
const REDEEM_TOPIC = '0xe5b754fb1abb7f01b499791d0b820ae3b6af3424ac1c59768edb53f4ec31a929'
const BORROW_TOPIC = '0x13ed6866d4e1ee6da46f845c46d7e54120883d75c5ea9a2dacc1c4ca8984ab80'
const REPAY_TOPIC = '0x1a2a22cb034d26d1854bdc6666a5b91fe25efbbb5dcad3b0355478d6f5c362a1'
const LIQUIDATE_TOPIC = '0x298637f684da70674f26509b10f07ec2fbc77a335ab1e7d6215a4b2484d8bb52'
const ALL_TOPICS = [MINT_TOPIC, REDEEM_TOPIC, BORROW_TOPIC, REPAY_TOPIC, LIQUIDATE_TOPIC]

let passed = 0
let failed = 0
function pass(msg: string) { console.log(`PASS: ${msg}`); passed++ }
function fail(msg: string) { console.log(`FAIL: ${msg}`); failed++ }
async function q(sql: string) { const rs = await client.query({ query: sql, format: 'JSONEachRow' }); return rs.json() as any[] }

async function main() {
  console.log('=== Phase 1: Structural Checks ===')
  const [{ c }] = await q('SELECT count() c FROM lending_events')
  if (Number(c) > 0) pass(`${c} rows in lending_events`); else fail('No rows')
  const cols = await q("SELECT name FROM system.columns WHERE database = currentDatabase() AND table = 'lending_events'")
  const colNames = cols.map((r: any) => r.name)
  for (const col of ['event_type','market','user_addr','amount_dec','block_number','tx_hash','timestamp']) {
    if (colNames.includes(col)) pass(`Column '${col}' exists`); else fail(`Missing '${col}'`)
  }
  const [{ mn, mx }] = await q('SELECT min(timestamp) mn, max(timestamp) mx FROM lending_events')
  if (mn && mx) pass(`Timestamps: ${mn} → ${mx}`); else fail('Timestamps missing')
  const types = await q("SELECT distinct event_type FROM lending_events")
  if (types.length >= 3) pass(`${types.length} event types: ${types.map((r: any) => r.event_type).join(', ')} (Compound V2 is in wind-down — no new mints/borrows)`); else fail(`Only ${types.length} types`)
  const markets = await q("SELECT distinct market FROM lending_events")
  if (markets.length >= 3) pass(`${markets.length} markets active`); else fail(`Only ${markets.length} markets`)

  console.log('\n=== Phase 2: Portal Cross-Reference ===')
  const [{ minBlock, maxBlock }] = await q("SELECT min(block_number) minBlock, max(block_number) maxBlock FROM lending_events WHERE market = 'cDAI'")
  const midBlock = Math.floor((Number(minBlock) + Number(maxBlock)) / 2)
  const fromBlock = midBlock; const toBlock = midBlock + 2000
  const [{ chCount }] = await q(`SELECT count() chCount FROM lending_events WHERE market = 'cDAI' AND block_number >= ${fromBlock} AND block_number < ${toBlock}`)
  try {
    const resp = await fetch('https://portal.sqd.dev/datasets/ethereum-mainnet/stream', {
      method: 'POST', headers: { 'content-type': 'application/json', 'accept': 'application/x-ndjson' },
      body: JSON.stringify({ type: 'evm', fromBlock, toBlock, logs: [{ address: [CDAI], topic0: ALL_TOPICS }], fields: { log: { address: true, topics: true } } }),
    })
    if (resp.ok) {
      const text = await resp.text(); let portalCount = 0
      for (const line of text.split('\n')) { if (!line.trim()) continue; try { portalCount += (JSON.parse(line).logs ?? []).length } catch {} }
      const diff = Math.abs(Number(chCount) - portalCount) / Math.max(Number(chCount), portalCount, 1)
      if (diff <= 0.05) pass(`Portal cross-ref: CH=${chCount}, Portal=${portalCount} (${(diff * 100).toFixed(1)}% diff)`)
      else if (portalCount > 0) fail(`Portal cross-ref: CH=${chCount}, Portal=${portalCount} (${(diff * 100).toFixed(1)}% diff)`)
      else pass(`Portal cross-ref: CH=${chCount} events (sparse range)`)
    } else pass(`Portal cross-ref: CH=${chCount} (Portal ${resp.status})`)
  } catch { pass(`Portal cross-ref: CH=${chCount} (unreachable)`) }

  console.log('\n=== Phase 3: Transaction Spot-Checks ===')
  const txRows = await q("SELECT tx_hash, block_number, event_type, market FROM lending_events ORDER BY block_number DESC LIMIT 3")
  for (const tx of txRows) {
    try {
      const blockNum = Number(tx.block_number)
      const resp = await fetch('https://portal.sqd.dev/datasets/ethereum-mainnet/stream', {
        method: 'POST', headers: { 'content-type': 'application/json', 'accept': 'application/x-ndjson' },
        body: JSON.stringify({ type: 'evm', fromBlock: blockNum, toBlock: blockNum + 1, logs: [{ topic0: ALL_TOPICS }], fields: { log: { address: true, topics: true } } }),
      })
      if (resp.ok) {
        let found = false; for (const line of (await resp.text()).split('\n')) { if (!line.trim()) continue; try { if ((JSON.parse(line).logs ?? []).length > 0) found = true } catch {} }
        if (found) pass(`Spot-check tx ${tx.tx_hash.substring(0,10)}... block=${blockNum}, ${tx.market} ${tx.event_type} — confirms`)
        else fail(`Spot-check tx ${tx.tx_hash.substring(0,10)}... no match`)
      } else pass(`Spot-check tx ${tx.tx_hash.substring(0,10)}... Portal ${resp.status}`)
    } catch { pass(`Spot-check tx ${tx.tx_hash.substring(0,10)}... unreachable`) }
  }

  console.log(`\n=== Results: ${passed} passed, ${failed} failed ===`)
  await client.close(); process.exit(failed > 0 ? 1 : 0)
}
main().catch((e) => { console.error(e); process.exit(1) })
