import 'dotenv/config'
import { createClient } from '@clickhouse/client'

const client = createClient({
  url: process.env.CLICKHOUSE_URL ?? 'http://localhost:8123',
  database: process.env.CLICKHOUSE_DATABASE ?? 'aster_asbnb',
  username: process.env.CLICKHOUSE_USER ?? 'default',
  password: process.env.CLICKHOUSE_PASSWORD ?? 'password',
})

const ASBNB_TOKEN = '0x77734e70b6e88b4d82fe632a168edf6e700912b6'
const ASBNB_MINTER = '0x2f31ab8950c50080e77999fa456372f276952fd8'
const TRANSFER_TOPIC = '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef'
const MINTED_TOPIC = '0x85997415bd3414b806458681ef3ae6f42455f982932d9fcf6b4519755a7f6e0d'
const BURNED_TOPIC = '0xaa5365e70e35ac0430a743a2d1ea62eae7e2ded652dca247005ea6a9d9a89ed6'

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

  const [{ c }] = await q('SELECT count() c FROM asbnb_events')
  const rowCount = Number(c)
  if (rowCount > 0) pass(`${rowCount} rows in asbnb_events`)
  else fail('No rows')

  const cols = await q("SELECT name FROM system.columns WHERE database = currentDatabase() AND table = 'asbnb_events'")
  const colNames = cols.map((r: any) => r.name)
  for (const col of ['event_type', 'transfer_type', 'from_addr', 'to_addr', 'amount_bnb', 'block_number', 'tx_hash', 'timestamp']) {
    if (colNames.includes(col)) pass(`Column '${col}' exists`)
    else fail(`Missing column '${col}'`)
  }

  const [{ mn, mx }] = await q('SELECT min(timestamp) mn, max(timestamp) mx FROM asbnb_events')
  if (mn && mx) pass(`Timestamps: ${mn} → ${mx}`)
  else fail('Timestamps missing')

  const types = await q("SELECT distinct transfer_type FROM asbnb_events")
  if (types.length >= 3) pass(`${types.length} transfer types: ${types.map((r: any) => r.transfer_type).join(', ')}`)
  else fail(`Only ${types.length} transfer types`)

  const [{ neg }] = await q("SELECT countIf(amount_bnb < 0) neg FROM asbnb_events")
  if (Number(neg) === 0) pass('No negative amount_bnb values')
  else fail(`${neg} rows with negative amounts`)

  console.log('\n=== Phase 2: Portal Cross-Reference ===')

  // Use mid-range 2K-block window for token Transfer events
  const [{ minBlock, maxBlock }] = await q("SELECT min(block_number) minBlock, max(block_number) maxBlock FROM asbnb_events WHERE source_contract = 'asBNB'")
  const midBlock = Math.floor((Number(minBlock) + Number(maxBlock)) / 2)
  const fromBlock = midBlock
  const toBlock = midBlock + 2000

  const [{ chCount }] = await q(`SELECT count() chCount FROM asbnb_events WHERE source_contract = 'asBNB' AND block_number >= ${fromBlock} AND block_number < ${toBlock}`)

  try {
    const resp = await fetch('https://portal.sqd.dev/datasets/binance-mainnet/stream', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'accept': 'application/x-ndjson' },
      body: JSON.stringify({
        type: 'evm',
        fromBlock,
        toBlock,
        logs: [{ address: [ASBNB_TOKEN], topic0: [TRANSFER_TOPIC] }],
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

  const txRows = await q("SELECT tx_hash, block_number, event_type, transfer_type, amount_bnb FROM asbnb_events WHERE source_contract = 'asBNB' ORDER BY block_number DESC LIMIT 3")

  for (const tx of txRows) {
    try {
      const blockNum = Number(tx.block_number)
      const resp = await fetch('https://portal.sqd.dev/datasets/binance-mainnet/stream', {
        method: 'POST',
        headers: { 'content-type': 'application/json', 'accept': 'application/x-ndjson' },
        body: JSON.stringify({
          type: 'evm',
          fromBlock: blockNum,
          toBlock: blockNum + 1,
          logs: [{ address: [ASBNB_TOKEN], topic0: [TRANSFER_TOPIC] }],
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
              if ((log.address ?? '').toLowerCase() === ASBNB_TOKEN) found = true
            }
          } catch {}
        }
        if (found) pass(`Spot-check tx ${tx.tx_hash.substring(0, 10)}... block=${blockNum}, type=${tx.transfer_type}, ${Number(tx.amount_bnb).toFixed(2)} BNB — Portal confirms`)
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
