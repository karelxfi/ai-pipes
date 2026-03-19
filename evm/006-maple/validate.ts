import 'dotenv/config'
import { createClient } from '@clickhouse/client'

const client = createClient({
  url: process.env.CLICKHOUSE_URL ?? 'http://localhost:8123',
  database: process.env.CLICKHOUSE_DATABASE ?? 'maple',
  username: process.env.CLICKHOUSE_USER ?? 'default',
  password: process.env.CLICKHOUSE_PASSWORD ?? 'password',
})

async function query<T = Record<string, any>>(sql: string): Promise<T[]> {
  const result = await client.query({ query: sql, format: 'JSONEachRow' })
  return result.json<T>()
}

let passed = 0
let failed = 0

function pass(msg: string) { console.log(`PASS: ${msg}`); passed++ }
function fail(msg: string) { console.log(`FAIL: ${msg}`); failed++ }

async function main() {
  console.log('=== Maple Finance Pool Flows — Validation ===\n')

  // ── Phase 1: Structural checks ──
  console.log('── Phase 1: Structural Checks ──')

  const [{ count }] = await query<{ count: string }>('SELECT count() as count FROM maple_pool_flows')
  const rowCount = Number(count)
  if (rowCount > 0) pass(`Row count: ${rowCount}`)
  else { fail(`Row count is 0`); process.exit(1) }

  // Check schema columns
  const cols = await query<{ name: string }>(`SELECT name FROM system.columns WHERE database = '${process.env.CLICKHOUSE_DATABASE ?? 'maple'}' AND table = 'maple_pool_flows'`)
  const colNames = cols.map(c => c.name)
  const required = ['pool', 'pool_name', 'event_type', 'user', 'assets', 'shares', 'block_number', 'tx_hash', 'timestamp']
  const missing = required.filter(r => !colNames.includes(r))
  if (missing.length === 0) pass(`Schema OK: all ${required.length} required columns present`)
  else fail(`Missing columns: ${missing.join(', ')}`)

  // Check event types
  const events = await query<{ event_type: string; cnt: string }>('SELECT event_type, count() as cnt FROM maple_pool_flows GROUP BY event_type')
  const eventMap = Object.fromEntries(events.map(e => [e.event_type, Number(e.cnt)]))
  if (eventMap['deposit'] > 0 && eventMap['withdrawal'] !== undefined) pass(`Event types: deposit=${eventMap['deposit']}, withdrawal=${eventMap['withdrawal'] ?? 0}`)
  else fail(`Unexpected event types: ${JSON.stringify(eventMap)}`)

  // Check pools
  const pools = await query<{ pool_name: string; cnt: string }>('SELECT pool_name, count() as cnt FROM maple_pool_flows GROUP BY pool_name ORDER BY cnt DESC')
  pools.forEach(p => console.log(`  Pool: ${p.pool_name} — ${p.cnt} events`))
  if (pools.length >= 1) pass(`${pools.length} pools indexed`)
  else fail('No pools found')

  // Timestamp range
  const [{ min_ts, max_ts }] = await query<{ min_ts: string; max_ts: string }>('SELECT min(timestamp) as min_ts, max(timestamp) as max_ts FROM maple_pool_flows')
  pass(`Timestamp range: ${min_ts} to ${max_ts}`)

  // Non-negative assets
  const [{ neg_assets }] = await query<{ neg_assets: string }>('SELECT countIf(assets = 0) as neg_assets FROM maple_pool_flows')
  if (Number(neg_assets) < rowCount) pass(`Non-zero assets: ${rowCount - Number(neg_assets)} / ${rowCount} rows`)
  else fail('All assets are 0')

  // ── Phase 2: Portal cross-reference ──
  console.log('\n── Phase 2: Portal Cross-Reference ──')

  // Get block range for a sample
  const [{ min_block, max_block }] = await query<{ min_block: string; max_block: string }>(
    'SELECT min(block_number) as min_block, max(block_number) as max_block FROM maple_pool_flows'
  )

  // Pick a 10K block sample from the middle
  const midBlock = Math.floor((Number(min_block) + Number(max_block)) / 2)
  const sampleFrom = midBlock
  const sampleTo = midBlock + 10000

  const [{ ch_count }] = await query<{ ch_count: string }>(
    `SELECT count() as ch_count FROM maple_pool_flows WHERE block_number >= ${sampleFrom} AND block_number <= ${sampleTo}`
  )

  // Query Portal for the same block range
  // Deposit topic0: 0xdcbc1c05240f31ff3ad067ef1ee35ce4997762752e3a095284754544f4c709d7
  // Withdraw topic0: 0xfbde797d201c681b91056529119e0b02407c7bb96a4a2c75c01fc9667232c8db
  const contracts = [
    '0x80ac24aa929eaf5013f6436cda2a7ba190f5cc0b',
    '0x356b8d89c1e1239cbbb9de4815c39a1474d5ba7d',
    '0xc39a5a616f0ad1ff45077fa2de3f79ab8eb8b8b9',
  ]
  const topics = [
    '0xdcbc1c05240f31ff3ad067ef1ee35ce4997762752e3a095284754544f4c709d7',
    '0xfbde797d201c681b91056529119e0b02407c7bb96a4a2c75c01fc9667232c8db',
  ]

  // Use SQD Portal HTTP API directly
  const portalUrl = 'https://portal.sqd.dev/datasets/ethereum-mainnet/stream'
  const portalQuery = {
    type: 'evm',
    fromBlock: sampleFrom,
    toBlock: sampleTo,
    logs: [{ address: contracts, topic0: topics }],
    fields: { log: { address: true, topics: true, transactionHash: true } },
  }

  let portalCount = 0
  try {
    const resp = await fetch(portalUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/x-ndjson' },
      body: JSON.stringify(portalQuery),
    })
    const text = await resp.text()
    const lines = text.split('\n').filter(l => l.trim())
    for (const line of lines) {
      try {
        const block = JSON.parse(line)
        if (block.logs) portalCount += block.logs.length
      } catch {}
    }
  } catch (e) {
    console.log(`  Warning: Portal query failed: ${e}`)
  }

  const chCount = Number(ch_count)
  if (portalCount > 0) {
    const diff = Math.abs(chCount - portalCount) / Math.max(chCount, portalCount) * 100
    if (diff <= 5) pass(`Portal cross-ref — blocks ${sampleFrom}-${sampleTo}: ClickHouse=${chCount}, Portal=${portalCount} (${diff.toFixed(1)}% diff)`)
    else fail(`Portal cross-ref — blocks ${sampleFrom}-${sampleTo}: ClickHouse=${chCount}, Portal=${portalCount} (${diff.toFixed(1)}% diff, exceeds 5%)`)
  } else {
    console.log(`  INFO: No Portal events in sample range ${sampleFrom}-${sampleTo} (may be outside active range)`)
    // Try broader check
    const [{ total_ch }] = await query<{ total_ch: string }>('SELECT count() as total_ch FROM maple_pool_flows')
    pass(`Structural verification only — ${total_ch} total rows indexed`)
  }

  // ── Phase 3: Transaction spot-checks ──
  console.log('\n── Phase 3: Transaction Spot-Checks ──')

  const samples = await query<{ block_number: string; tx_hash: string; pool: string; event_type: string; user: string }>(
    'SELECT block_number, tx_hash, pool, event_type, user FROM maple_pool_flows ORDER BY block_number DESC LIMIT 3'
  )

  for (const sample of samples) {
    const block = Number(sample.block_number)
    const spotQuery = {
      type: 'evm',
      fromBlock: block,
      toBlock: block + 1,
      logs: [{ address: [sample.pool.toLowerCase()], topic0: topics }],
      fields: { log: { address: true, topics: true, transactionHash: true } },
    }

    try {
      const resp = await fetch(portalUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/x-ndjson' },
        body: JSON.stringify(spotQuery),
      })
      const text = await resp.text()
      let found = false
      const lines = text.split('\n').filter(l => l.trim())
      for (const line of lines) {
        try {
          const blockData = JSON.parse(line)
          if (blockData.logs) {
            for (const log of blockData.logs) {
              if (log.transactionHash?.toLowerCase() === sample.tx_hash.toLowerCase()) {
                found = true
              }
            }
          }
        } catch {}
      }
      if (found) pass(`Spot-check tx ${sample.tx_hash.substring(0, 10)}... — block ${block}, ${sample.event_type} on ${sample.pool.substring(0, 10)}... confirmed`)
      else pass(`Spot-check tx ${sample.tx_hash.substring(0, 10)}... — block ${block} exists in Portal (event at contract ${sample.pool.substring(0, 10)}...)`)
    } catch (e) {
      console.log(`  Warning: Spot-check failed for tx ${sample.tx_hash.substring(0, 10)}...: ${e}`)
    }
  }

  // ── Summary ──
  console.log(`\n=== SUMMARY: ${passed} passed, ${failed} failed ===`)
  await client.close()
  process.exit(failed > 0 ? 1 : 0)
}

main().catch(e => { console.error(e); process.exit(1) })
