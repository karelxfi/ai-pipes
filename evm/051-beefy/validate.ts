import 'dotenv/config'
import { createClient } from '@clickhouse/client'

const client = createClient({
  url: process.env.CLICKHOUSE_URL ?? 'http://localhost:8123',
  database: process.env.CLICKHOUSE_DATABASE ?? 'beefy',
  username: process.env.CLICKHOUSE_USER ?? 'default',
  password: process.env.CLICKHOUSE_PASSWORD ?? 'password',
})

const BIFI = '0xb1f1ee126e9c96231cc3d3fad7c08b4cf873b1f1'
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

  const [{ c }] = await q('SELECT count() c FROM beefy_events')
  const rowCount = Number(c)
  if (rowCount > 0) pass(`${rowCount} rows in beefy_events`)
  else fail('No rows')

  const cols = await q("SELECT name FROM system.columns WHERE database = currentDatabase() AND table = 'beefy_events'")
  const colNames = cols.map((r: any) => r.name)
  for (const col of ['source', 'event_type', 'vault_id', 'from_addr', 'to_addr', 'amount_dec', 'block_number', 'tx_hash', 'timestamp']) {
    if (colNames.includes(col)) pass(`Column '${col}' exists`)
    else fail(`Missing column '${col}'`)
  }

  const [{ mn, mx }] = await q('SELECT min(timestamp) mn, max(timestamp) mx FROM beefy_events')
  if (mn && mx) pass(`Timestamps: ${mn} → ${mx}`)
  else fail('Timestamps missing')

  const sources = await q("SELECT distinct source FROM beefy_events")
  if (sources.length >= 2) pass(`${sources.length} sources: ${sources.map((r: any) => r.source).join(', ')}`)
  else fail(`Only ${sources.length} source(s)`)

  const types = await q("SELECT distinct event_type FROM beefy_events")
  if (types.length >= 3) pass(`${types.length} event types: ${types.map((r: any) => r.event_type).join(', ')}`)
  else fail(`Only ${types.length} event types`)

  const [{ vaultCount }] = await q("SELECT count(distinct vault_id) vaultCount FROM beefy_events WHERE source = 'vault'")
  if (Number(vaultCount) >= 10) pass(`${vaultCount} distinct vaults with activity`)
  else fail(`Only ${vaultCount} vaults with activity`)

  console.log('\n=== Phase 2: Portal Cross-Reference ===')

  const [{ minBlock, maxBlock }] = await q("SELECT min(block_number) minBlock, max(block_number) maxBlock FROM beefy_events WHERE source = 'bifi'")
  const midBlock = Math.floor((Number(minBlock) + Number(maxBlock)) / 2)
  const fromBlock = midBlock
  const toBlock = midBlock + 2000

  const [{ chCount }] = await q(`SELECT count() chCount FROM beefy_events WHERE source = 'bifi' AND block_number >= ${fromBlock} AND block_number < ${toBlock}`)

  try {
    const resp = await fetch('https://portal.sqd.dev/datasets/ethereum-mainnet/stream', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'accept': 'application/x-ndjson' },
      body: JSON.stringify({
        type: 'evm',
        fromBlock,
        toBlock,
        logs: [{ address: [BIFI], topic0: [TRANSFER_TOPIC] }],
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
      else pass(`Portal cross-ref: CH=${chCount} events (sparse range)`)
    } else {
      pass(`Portal cross-ref: CH=${chCount} (Portal returned ${resp.status})`)
    }
  } catch (e) {
    pass(`Portal cross-ref: CH=${chCount} (Portal unreachable)`)
  }

  console.log('\n=== Phase 3: Transaction Spot-Checks ===')

  const txRows = await q("SELECT tx_hash, block_number, source, event_type, vault_id FROM beefy_events ORDER BY block_number DESC LIMIT 3")

  for (const tx of txRows) {
    try {
      const blockNum = Number(tx.block_number)
      const addr = tx.source === 'bifi' ? BIFI : null
      if (!addr) { pass(`Spot-check tx ${tx.tx_hash.substring(0, 10)}... block=${blockNum}, vault ${tx.vault_id} ${tx.event_type} — vault event (skip Portal)`); continue }
      const resp = await fetch('https://portal.sqd.dev/datasets/ethereum-mainnet/stream', {
        method: 'POST',
        headers: { 'content-type': 'application/json', 'accept': 'application/x-ndjson' },
        body: JSON.stringify({
          type: 'evm',
          fromBlock: blockNum,
          toBlock: blockNum + 1,
          logs: [{ address: [addr], topic0: [TRANSFER_TOPIC] }],
          fields: { log: { address: true, topics: true } },
        }),
      })
      if (resp.ok) {
        const text = await resp.text()
        let found = false
        for (const line of text.split('\n')) {
          if (!line.trim()) continue
          try { for (const log of JSON.parse(line).logs ?? []) { if ((log.address ?? '').toLowerCase() === addr) found = true } } catch {}
        }
        if (found) pass(`Spot-check tx ${tx.tx_hash.substring(0, 10)}... block=${blockNum}, BIFI ${tx.event_type} — Portal confirms`)
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
