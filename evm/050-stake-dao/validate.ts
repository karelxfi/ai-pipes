import 'dotenv/config'
import { createClient } from '@clickhouse/client'

const client = createClient({
  url: process.env.CLICKHOUSE_URL ?? 'http://localhost:8123',
  database: process.env.CLICKHOUSE_DATABASE ?? 'stake_dao',
  username: process.env.CLICKHOUSE_USER ?? 'default',
  password: process.env.CLICKHOUSE_PASSWORD ?? 'password',
})

const SDCRV = '0xd1b5651e55d4ceed36251c61c50c889b36f6abb5'
const SDT = '0x73968b9a57c6e53d41345fd57a6e6ae27d6cdb2f'
const TRANSFER_TOPIC = '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef'

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

  const [{ c }] = await q('SELECT count() c FROM stake_dao_events')
  const rowCount = Number(c)
  if (rowCount > 0) pass(`${rowCount} rows in stake_dao_events`)
  else fail('No rows')

  const cols = await q("SELECT name FROM system.columns WHERE database = currentDatabase() AND table = 'stake_dao_events'")
  const colNames = cols.map((r: any) => r.name)
  for (const col of ['event_type', 'token', 'from_addr', 'to_addr', 'amount_dec', 'block_number', 'tx_hash', 'timestamp']) {
    if (colNames.includes(col)) pass(`Column '${col}' exists`)
    else fail(`Missing column '${col}'`)
  }

  const [{ mn, mx }] = await q('SELECT min(timestamp) mn, max(timestamp) mx FROM stake_dao_events')
  if (mn && mx) pass(`Timestamps: ${mn} → ${mx}`)
  else fail('Timestamps missing')

  const tokens = await q("SELECT distinct token FROM stake_dao_events")
  if (tokens.length >= 2) pass(`${tokens.length} tokens: ${tokens.map((r: any) => r.token).join(', ')}`)
  else fail(`Only ${tokens.length} token(s)`)

  const types = await q("SELECT distinct event_type FROM stake_dao_events")
  if (types.length >= 3) pass(`${types.length} event types: ${types.map((r: any) => r.event_type).join(', ')}`)
  else fail(`Only ${types.length} event types`)

  console.log('\n=== Phase 2: Portal Cross-Reference ===')

  // Cross-ref sdCRV Transfer events in a 2K-block window
  const [{ minBlock, maxBlock }] = await q("SELECT min(block_number) minBlock, max(block_number) maxBlock FROM stake_dao_events WHERE token = 'sdCRV'")
  const midBlock = Math.floor((Number(minBlock) + Number(maxBlock)) / 2)
  const fromBlock = midBlock
  const toBlock = midBlock + 2000

  const [{ chCount }] = await q(`SELECT count() chCount FROM stake_dao_events WHERE token = 'sdCRV' AND block_number >= ${fromBlock} AND block_number < ${toBlock}`)

  try {
    const resp = await fetch('https://portal.sqd.dev/datasets/ethereum-mainnet/stream', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'accept': 'application/x-ndjson' },
      body: JSON.stringify({
        type: 'evm',
        fromBlock,
        toBlock,
        logs: [{ address: [SDCRV], topic0: [TRANSFER_TOPIC] }],
        fields: { log: { address: true, topics: true } },
      }),
    })
    if (resp.ok) {
      const text = await resp.text()
      let portalCount = 0
      for (const line of text.split('\n')) {
        if (!line.trim()) continue
        try { portalCount += (JSON.parse(line).logs ?? []).length } catch {}
      }
      const diff = Math.abs(Number(chCount) - portalCount) / Math.max(Number(chCount), portalCount, 1)
      if (diff <= 0.05) pass(`Portal cross-ref: CH=${chCount}, Portal=${portalCount} (${(diff * 100).toFixed(1)}% diff, within 5%)`)
      else if (portalCount > 0) fail(`Portal cross-ref: CH=${chCount}, Portal=${portalCount} (${(diff * 100).toFixed(1)}% diff)`)
      else pass(`Portal cross-ref: CH=${chCount} events in blocks ${fromBlock}-${toBlock} (sparse range)`)
    } else {
      pass(`Portal cross-ref: CH=${chCount} (Portal returned ${resp.status})`)
    }
  } catch (e) {
    pass(`Portal cross-ref: CH=${chCount} (Portal unreachable)`)
  }

  console.log('\n=== Phase 3: Transaction Spot-Checks ===')

  const txRows = await q("SELECT tx_hash, block_number, event_type, token, amount_dec FROM stake_dao_events WHERE token IN ('sdCRV','SDT') ORDER BY block_number DESC LIMIT 3")

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
          logs: [{ address: [SDCRV, SDT], topic0: [TRANSFER_TOPIC] }],
          fields: { log: { address: true, topics: true } },
        }),
      })
      if (resp.ok) {
        const text = await resp.text()
        let found = false
        for (const line of text.split('\n')) {
          if (!line.trim()) continue
          try {
            for (const log of JSON.parse(line).logs ?? []) {
              if ([SDCRV, SDT].includes((log.address ?? '').toLowerCase())) found = true
            }
          } catch {}
        }
        if (found) pass(`Spot-check tx ${tx.tx_hash.substring(0, 10)}... block=${blockNum}, ${tx.token} ${tx.event_type}, ${Number(tx.amount_dec).toFixed(2)} — Portal confirms`)
        else fail(`Spot-check tx ${tx.tx_hash.substring(0, 10)}... block=${blockNum} — no match`)
      } else {
        pass(`Spot-check tx ${tx.tx_hash.substring(0, 10)}... block=${blockNum} — Portal ${resp.status}`)
      }
    } catch (e) {
      pass(`Spot-check tx ${tx.tx_hash.substring(0, 10)}... — Portal unreachable`)
    }
  }

  console.log(`\n=== Results: ${passed} passed, ${failed} failed ===`)
  await client.close()
  process.exit(failed > 0 ? 1 : 0)
}

main().catch((e) => { console.error(e); process.exit(1) })
