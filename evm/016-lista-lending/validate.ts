import 'dotenv/config'
import { createClient } from '@clickhouse/client'

const client = createClient({
  url: process.env.CLICKHOUSE_URL ?? 'http://localhost:8123',
  database: process.env.CLICKHOUSE_DATABASE ?? 'lista_lending',
  username: process.env.CLICKHOUSE_USER ?? 'default',
  password: process.env.CLICKHOUSE_PASSWORD ?? 'password',
})

const MOOLAH = '0x8f73b65b4caaf64fba2af91cc5d4a2a1318e5d8c'
const SUPPLY_TOPIC = '0xedf8870433c83823eb071d3df1caa8d008f12f6440918c20d75a3602cda30fe0'

let passed = 0
let failed = 0
function pass(msg: string) { console.log(`PASS: ${msg}`); passed++ }
function fail(msg: string) { console.log(`FAIL: ${msg}`); failed++ }

async function query(sql: string): Promise<any[]> {
  const result = await client.query({ query: sql, format: 'JSONEachRow' })
  return result.json()
}

async function main() {
  console.log('=== Phase 1: Structural Checks ===\n')

  const tables = ['moolah_events', 'moolah_interest', 'moolah_flash_loans']
  for (const table of tables) {
    const [{ cnt }] = await query(`SELECT count() as cnt FROM ${table}`)
    if (Number(cnt) > 0) pass(`${table}: ${cnt} rows`)
    else fail(`${table}: 0 rows`)
  }

  const [range] = await query('SELECT min(block_number) as mn, max(block_number) as mx FROM moolah_events')
  pass(`Block range: ${Number(range.mn).toLocaleString()} → ${Number(range.mx).toLocaleString()}`)

  const [tsRange] = await query("SELECT min(timestamp) as mn, max(timestamp) as mx FROM moolah_events")
  pass(`Timestamp range: ${tsRange.mn} → ${tsRange.mx}`)

  const eventTypes = await query("SELECT event_type, count() as cnt FROM moolah_events GROUP BY event_type ORDER BY cnt DESC")
  pass(`Event types: ${eventTypes.map((e: any) => `${e.event_type}=${e.cnt}`).join(', ')}`)

  const [{ unique_markets }] = await query('SELECT count(DISTINCT market_id) as unique_markets FROM moolah_events')
  pass(`Unique markets: ${unique_markets}`)

  console.log('\n=== Phase 2: Portal Cross-Reference ===\n')

  const minBlock = Number(range.mn)
  const maxBlock = Number(range.mx)
  const sampleStart = minBlock + Math.floor((maxBlock - minBlock) * 0.3)
  const sampleEnd = sampleStart + 10000

  const [{ ch_supply }] = await query(
    `SELECT count() as ch_supply FROM moolah_events WHERE event_type = 'Supply' AND block_number >= ${sampleStart} AND block_number < ${sampleEnd}`
  )
  const chCount = Number(ch_supply)

  try {
    const portalQuery = {
      type: 'evm',
      fromBlock: sampleStart,
      toBlock: sampleEnd,
      logs: [{ address: [MOOLAH], topic0: [SUPPLY_TOPIC] }],
      fields: { log: { address: true, topics: true } },
    }
    const resp = await fetch('https://portal.sqd.dev/datasets/binance-mainnet/stream', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(portalQuery),
    })
    if (resp.ok) {
      const text = await resp.text()
      let portalCount = 0
      for (const line of text.trim().split('\n')) {
        const obj = JSON.parse(line)
        if (obj.logs) portalCount += obj.logs.length
      }
      const diff = portalCount > 0 ? Math.abs(chCount - portalCount) / portalCount : (chCount === 0 ? 0 : 1)
      if (diff <= 0.05) {
        pass(`Portal cross-ref (Supply): CH=${chCount}, Portal=${portalCount} (${(diff * 100).toFixed(1)}% diff) — blocks ${sampleStart}-${sampleEnd}`)
      } else {
        fail(`Portal cross-ref (Supply): CH=${chCount}, Portal=${portalCount} (${(diff * 100).toFixed(1)}% diff) — blocks ${sampleStart}-${sampleEnd}`)
      }
    } else {
      fail(`Portal API returned ${resp.status}`)
    }
  } catch (err: any) {
    fail(`Portal cross-ref error: ${err.message}`)
  }

  console.log('\n=== Phase 3: Transaction Spot-Checks ===\n')

  const samples = await query(
    `SELECT block_number, tx_hash, event_type, market_id FROM moolah_events WHERE event_type = 'Supply' ORDER BY block_number DESC LIMIT 3`
  )

  for (const sample of samples) {
    const block = Number(sample.block_number)
    try {
      const spotQuery = {
        type: 'evm',
        fromBlock: block,
        toBlock: block + 1,
        logs: [{ address: [MOOLAH], topic0: [SUPPLY_TOPIC] }],
        fields: { log: { address: true, topics: true, transactionHash: true } },
      }
      const resp = await fetch('https://portal.sqd.dev/datasets/binance-mainnet/stream', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(spotQuery),
      })
      if (resp.ok) {
        const text = await resp.text()
        let found = false
        for (const line of text.trim().split('\n')) {
          const obj = JSON.parse(line)
          if (obj.logs) {
            for (const log of obj.logs) {
              if (log.transactionHash?.toLowerCase() === sample.tx_hash.toLowerCase()) {
                const marketFromTopic = log.topics?.[1]
                if (marketFromTopic?.toLowerCase() === sample.market_id.toLowerCase()) {
                  found = true
                }
              }
            }
          }
        }
        if (found) {
          pass(`Spot-check block ${block} — tx ${sample.tx_hash.slice(0, 10)}... market ${sample.market_id.slice(0, 10)}... matches Portal`)
        } else {
          fail(`Spot-check block ${block} — tx ${sample.tx_hash.slice(0, 10)}... NOT matched in Portal`)
        }
      }
    } catch (err: any) {
      fail(`Spot-check error for block ${block}: ${err.message}`)
    }
  }

  console.log(`\n=== Results: ${passed} passed, ${failed} failed ===`)
  await client.close()
  process.exit(failed > 0 ? 1 : 0)
}

main().catch((err) => { console.error(err); process.exit(1) })
