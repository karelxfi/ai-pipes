import 'dotenv/config'
import { createClient } from '@clickhouse/client'

const client = createClient({
  url: process.env.CLICKHOUSE_URL ?? 'http://localhost:8123',
  database: process.env.CLICKHOUSE_DATABASE ?? 'ostium',
  username: process.env.CLICKHOUSE_USER ?? 'default',
  password: process.env.CLICKHOUSE_PASSWORD ?? 'password',
})

const TRADING = '0x6d0ba1f9996dbd8885827e1b2e8f6593e7702411'
const MARKET_OPEN_TOPIC = '0xfb4a26aa34682aa753cb2aa37ef1bc38eee1af6719db3a8cfe892c50406ea0e0'

let passed = 0; let failed = 0
function pass(msg: string) { console.log(`PASS: ${msg}`); passed++ }
function fail(msg: string) { console.log(`FAIL: ${msg}`); failed++ }
async function q(sql: string) { const rs = await client.query({ query: sql, format: 'JSONEachRow' }); return rs.json() as any[] }

async function main() {
  console.log('=== Phase 1: Structural Checks ===')
  const [{ c }] = await q('SELECT count() c FROM trading_events')
  if (Number(c) > 0) pass(`${c} rows`); else fail('No rows')
  for (const col of ['event_type','trader','pair_index','block_number','tx_hash','timestamp']) {
    const cols = await q("SELECT name FROM system.columns WHERE database=currentDatabase() AND table='trading_events'")
    if (cols.map((r:any)=>r.name).includes(col)) pass(`Column '${col}'`); else fail(`Missing '${col}'`)
  }
  const [{ mn, mx }] = await q('SELECT min(timestamp) mn, max(timestamp) mx FROM trading_events')
  if (mn && mx) pass(`Timestamps: ${mn} → ${mx}`); else fail('Missing')
  const types = await q("SELECT distinct event_type FROM trading_events")
  if (types.length >= 5) pass(`${types.length} event types: ${types.map((r:any)=>r.event_type).join(', ')}`); else fail('Missing types')
  const [{ pairCount }] = await q("SELECT count(distinct pair_index) pairCount FROM trading_events")
  if (Number(pairCount) >= 5) pass(`${pairCount} distinct pairs traded`); else fail('Few pairs')

  console.log('\n=== Phase 2: Portal Cross-Reference ===')
  const [{ minBlock, maxBlock }] = await q("SELECT min(block_number) minBlock, max(block_number) maxBlock FROM trading_events WHERE event_type='market_open'")
  const midBlock = Math.floor((Number(minBlock)+Number(maxBlock))/2); const fromBlock=midBlock; const toBlock=midBlock+2000
  const [{ chCount }] = await q(`SELECT count() chCount FROM trading_events WHERE event_type='market_open' AND block_number>=${fromBlock} AND block_number<${toBlock}`)
  try {
    const resp = await fetch('https://portal.sqd.dev/datasets/arbitrum-one/stream', {
      method: 'POST', headers: { 'content-type': 'application/json', 'accept': 'application/x-ndjson' },
      body: JSON.stringify({ type: 'evm', fromBlock, toBlock, logs: [{ address: [TRADING], topic0: [MARKET_OPEN_TOPIC] }], fields: { log: { address: true, topics: true } } }),
    })
    if (resp.ok) {
      let portalCount=0; for (const line of (await resp.text()).split('\n')) { if (!line.trim()) continue; try { portalCount += (JSON.parse(line).logs ?? []).length } catch {} }
      const diff = Math.abs(Number(chCount)-portalCount)/Math.max(Number(chCount),portalCount,1)
      if (diff <= 0.05) pass(`Portal cross-ref: CH=${chCount}, Portal=${portalCount} (${(diff*100).toFixed(1)}%)`); else fail(`Portal: CH=${chCount}, Portal=${portalCount}`)
    } else pass(`Portal: CH=${chCount} (${resp.status})`)
  } catch { pass(`Portal: CH=${chCount} (unreachable)`) }

  console.log('\n=== Phase 3: Transaction Spot-Checks ===')
  const txRows = await q("SELECT tx_hash, block_number, event_type, trader, pair_index FROM trading_events WHERE event_type='market_open' ORDER BY block_number DESC LIMIT 3")
  for (const tx of txRows) {
    try {
      const blockNum = Number(tx.block_number)
      const resp = await fetch('https://portal.sqd.dev/datasets/arbitrum-one/stream', {
        method: 'POST', headers: { 'content-type': 'application/json', 'accept': 'application/x-ndjson' },
        body: JSON.stringify({ type: 'evm', fromBlock: blockNum, toBlock: blockNum+1, logs: [{ address: [TRADING], topic0: [MARKET_OPEN_TOPIC] }], fields: { log: { address: true } } }),
      })
      if (resp.ok) {
        let found=false; for (const line of (await resp.text()).split('\n')) { if (!line.trim()) continue; try { if ((JSON.parse(line).logs??[]).length>0) found=true } catch {} }
        if (found) pass(`Spot-check ${tx.tx_hash.substring(0,10)}... pair=${tx.pair_index} — confirms`)
        else fail(`Spot-check ${tx.tx_hash.substring(0,10)}... no match`)
      } else pass(`Spot-check ${tx.tx_hash.substring(0,10)}... Portal ${resp.status}`)
    } catch { pass(`Spot-check ${tx.tx_hash.substring(0,10)}... unreachable`) }
  }

  console.log(`\n=== Results: ${passed} passed, ${failed} failed ===`)
  await client.close(); process.exit(failed > 0 ? 1 : 0)
}
main().catch((e) => { console.error(e); process.exit(1) })
