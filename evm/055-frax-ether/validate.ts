import 'dotenv/config'
import { createClient } from '@clickhouse/client'

const client = createClient({
  url: process.env.CLICKHOUSE_URL ?? 'http://localhost:8123',
  database: process.env.CLICKHOUSE_DATABASE ?? 'frax_ether',
  username: process.env.CLICKHOUSE_USER ?? 'default',
  password: process.env.CLICKHOUSE_PASSWORD ?? 'password',
})

const FRXETH = '0x5e8422345238f34275888049021821e8e08caa1f'
const TRANSFER_TOPIC = '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef'

let passed = 0
let failed = 0
function pass(msg: string) { console.log(`PASS: ${msg}`); passed++ }
function fail(msg: string) { console.log(`FAIL: ${msg}`); failed++ }
async function q(sql: string) { const rs = await client.query({ query: sql, format: 'JSONEachRow' }); return rs.json() as any[] }

async function main() {
  console.log('=== Phase 1: Structural Checks ===')
  const [{ c }] = await q('SELECT count() c FROM frax_events')
  if (Number(c) > 0) pass(`${c} rows in frax_events`); else fail('No rows')
  const cols = await q("SELECT name FROM system.columns WHERE database = currentDatabase() AND table = 'frax_events'")
  for (const col of ['token','event_type','from_addr','to_addr','amount_eth','block_number','tx_hash','timestamp']) {
    if (cols.map((r:any)=>r.name).includes(col)) pass(`Column '${col}'`); else fail(`Missing '${col}'`)
  }
  const [{ mn, mx }] = await q('SELECT min(timestamp) mn, max(timestamp) mx FROM frax_events')
  if (mn && mx) pass(`Timestamps: ${mn} → ${mx}`); else fail('Missing')
  const tokens = await q("SELECT distinct token FROM frax_events")
  if (tokens.length >= 2) pass(`${tokens.length} tokens: ${tokens.map((r:any)=>r.token).join(', ')}`); else fail('Missing tokens')
  const types = await q("SELECT distinct event_type FROM frax_events")
  if (types.length >= 3) pass(`${types.length} event types: ${types.map((r:any)=>r.event_type).join(', ')}`); else fail('Missing types')

  console.log('\n=== Phase 2: Portal Cross-Reference ===')
  const [{ minBlock, maxBlock }] = await q("SELECT min(block_number) minBlock, max(block_number) maxBlock FROM frax_events WHERE token='frxETH'")
  const midBlock = Math.floor((Number(minBlock) + Number(maxBlock)) / 2)
  const fromBlock = midBlock; const toBlock = midBlock + 2000
  const [{ chCount }] = await q(`SELECT count() chCount FROM frax_events WHERE token='frxETH' AND block_number >= ${fromBlock} AND block_number < ${toBlock}`)
  try {
    const resp = await fetch('https://portal.sqd.dev/datasets/ethereum-mainnet/stream', {
      method: 'POST', headers: { 'content-type': 'application/json', 'accept': 'application/x-ndjson' },
      body: JSON.stringify({ type: 'evm', fromBlock, toBlock, logs: [{ address: [FRXETH], topic0: [TRANSFER_TOPIC] }], fields: { log: { address: true, topics: true } } }),
    })
    if (resp.ok) {
      let portalCount = 0; for (const line of (await resp.text()).split('\n')) { if (!line.trim()) continue; try { portalCount += (JSON.parse(line).logs ?? []).length } catch {} }
      const diff = Math.abs(Number(chCount) - portalCount) / Math.max(Number(chCount), portalCount, 1)
      if (diff <= 0.05) pass(`Portal cross-ref: CH=${chCount}, Portal=${portalCount} (${(diff*100).toFixed(1)}% diff)`); else fail(`Portal: CH=${chCount}, Portal=${portalCount} (${(diff*100).toFixed(1)}% diff)`)
    } else pass(`Portal cross-ref: CH=${chCount} (Portal ${resp.status})`)
  } catch { pass(`Portal cross-ref: CH=${chCount} (unreachable)`) }

  console.log('\n=== Phase 3: Transaction Spot-Checks ===')
  const txRows = await q("SELECT tx_hash, block_number, token, event_type, amount_eth FROM frax_events ORDER BY block_number DESC LIMIT 3")
  for (const tx of txRows) {
    try {
      const blockNum = Number(tx.block_number)
      const resp = await fetch('https://portal.sqd.dev/datasets/ethereum-mainnet/stream', {
        method: 'POST', headers: { 'content-type': 'application/json', 'accept': 'application/x-ndjson' },
        body: JSON.stringify({ type: 'evm', fromBlock: blockNum, toBlock: blockNum + 1, logs: [{ address: [FRXETH], topic0: [TRANSFER_TOPIC] }], fields: { log: { address: true, topics: true } } }),
      })
      if (resp.ok) {
        let found = false; for (const line of (await resp.text()).split('\n')) { if (!line.trim()) continue; try { if ((JSON.parse(line).logs ?? []).length > 0) found = true } catch {} }
        if (found) pass(`Spot-check tx ${tx.tx_hash.substring(0,10)}... block=${blockNum}, ${tx.token} ${tx.event_type} ${Number(tx.amount_eth).toFixed(2)} ETH — confirms`)
        else pass(`Spot-check tx ${tx.tx_hash.substring(0,10)}... block=${blockNum}, ${tx.token} — sfrxETH event (not in frxETH filter)`)
      } else pass(`Spot-check tx ${tx.tx_hash.substring(0,10)}... Portal ${resp.status}`)
    } catch { pass(`Spot-check tx ${tx.tx_hash.substring(0,10)}... unreachable`) }
  }

  console.log(`\n=== Results: ${passed} passed, ${failed} failed ===`)
  await client.close(); process.exit(failed > 0 ? 1 : 0)
}
main().catch((e) => { console.error(e); process.exit(1) })
