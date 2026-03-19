import 'dotenv/config'
import { createClient } from '@clickhouse/client'

const client = createClient({
  url: process.env.CLICKHOUSE_URL ?? 'http://localhost:8123',
  database: process.env.CLICKHOUSE_DATABASE ?? 'stakewise',
  username: process.env.CLICKHOUSE_USER ?? 'default',
  password: process.env.CLICKHOUSE_PASSWORD ?? 'password',
})

const KEEPER = '0x6B5815467da09DaA7DC83Db21c9239d98Bb487b5'.toLowerCase()
const OSTOKEN_CONTROLLER = '0x2A261e60FB14586B474C208b1B7AC6D0f5000306'.toLowerCase()
const MEV_ESCROW = '0x48319f97E5Da1233c21c48b80097c0FB7a20Ff86'.toLowerCase()

// topic0 hashes
const HARVESTED_TOPIC = '0x3f1d24dac9bcd1609d88c0def0340864f36b317d196e522a8a437da375f3d8af'
const MINT_TOPIC = '0x2f00e3cdd69a77be7ed215ec7b2a36784dd158f921fca79ac29deffa353fe6ee'
const MEV_RECEIVED_TOPIC = '0x7cb3607a76b32d6d17ca5d1aeb444650b19ac0fabbb1f24c93a0da57346b5610'

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

  // Row counts
  const tables = ['keeper_harvests', 'ostoken_mints', 'ostoken_burns', 'mev_received']
  for (const table of tables) {
    const [{ cnt }] = await query(`SELECT count() as cnt FROM ${table}`)
    const n = Number(cnt)
    if (n > 0) pass(`${table}: ${n} rows`)
    else fail(`${table}: 0 rows`)
  }

  // Block range
  const [range] = await query('SELECT min(block_number) as mn, max(block_number) as mx FROM keeper_harvests')
  const minBlock = Number(range.mn)
  const maxBlock = Number(range.mx)
  pass(`Block range: ${minBlock.toLocaleString()} → ${maxBlock.toLocaleString()}`)

  // Timestamp range
  const [tsRange] = await query("SELECT min(timestamp) as mn, max(timestamp) as mx FROM keeper_harvests")
  pass(`Timestamp range: ${tsRange.mn} → ${tsRange.mx}`)

  // Non-empty vault addresses in harvests
  const [{ empty_vaults }] = await query("SELECT count() as empty_vaults FROM keeper_harvests WHERE vault = ''")
  if (Number(empty_vaults) === 0) pass('No empty vault addresses in harvests')
  else fail(`${empty_vaults} rows with empty vault`)

  // Unique vaults
  const [{ unique_vaults }] = await query('SELECT count(DISTINCT vault) as unique_vaults FROM keeper_harvests')
  pass(`Unique vaults harvested: ${unique_vaults}`)

  console.log('\n=== Phase 2: Portal Cross-Reference ===\n')

  // Sample 10K block range from middle of data
  const sampleStart = minBlock + Math.floor((maxBlock - minBlock) * 0.4)
  const sampleEnd = sampleStart + 10000

  // Cross-reference Keeper Harvested events
  const [{ ch_harvests }] = await query(
    `SELECT count() as ch_harvests FROM keeper_harvests WHERE block_number >= ${sampleStart} AND block_number < ${sampleEnd}`
  )
  const chCount = Number(ch_harvests)

  try {
    const portalQuery = {
      type: 'evm',
      fromBlock: sampleStart,
      toBlock: sampleEnd,
      logs: [{ address: [KEEPER], topic0: [HARVESTED_TOPIC] }],
      fields: { log: { address: true, topics: true } },
    }
    const resp = await fetch('https://portal.sqd.dev/datasets/ethereum-mainnet/stream', {
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
      if (portalCount === 0 && chCount === 0) {
        pass(`Portal cross-ref: both show 0 Harvested events in blocks ${sampleStart}-${sampleEnd}`)
      } else if (portalCount === 0) {
        fail(`Portal returned 0 but ClickHouse has ${chCount} in blocks ${sampleStart}-${sampleEnd}`)
      } else {
        const diff = Math.abs(chCount - portalCount) / portalCount
        if (diff <= 0.05) {
          pass(`Portal cross-ref (Harvested): CH=${chCount}, Portal=${portalCount} (${(diff * 100).toFixed(1)}% diff) — blocks ${sampleStart}-${sampleEnd}`)
        } else {
          fail(`Portal cross-ref (Harvested): CH=${chCount}, Portal=${portalCount} (${(diff * 100).toFixed(1)}% diff) — blocks ${sampleStart}-${sampleEnd}`)
        }
      }
    } else {
      fail(`Portal API returned ${resp.status}`)
    }
  } catch (err: any) {
    fail(`Portal cross-ref error: ${err.message}`)
  }

  console.log('\n=== Phase 3: Transaction Spot-Checks ===\n')

  const samples = await query(
    `SELECT block_number, tx_hash, vault FROM keeper_harvests ORDER BY block_number DESC LIMIT 3`
  )

  for (const sample of samples) {
    const block = Number(sample.block_number)
    try {
      const spotQuery = {
        type: 'evm',
        fromBlock: block,
        toBlock: block + 1,
        logs: [{ address: [KEEPER], topic0: [HARVESTED_TOPIC] }],
        fields: { log: { address: true, topics: true, transactionHash: true } },
      }
      const resp = await fetch('https://portal.sqd.dev/datasets/ethereum-mainnet/stream', {
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
                // Verify vault address from topic1
                const vaultFromTopic = '0x' + (log.topics?.[1] ?? '').slice(26)
                if (vaultFromTopic.toLowerCase() === sample.vault.toLowerCase()) {
                  found = true
                }
              }
            }
          }
        }
        if (found) {
          pass(`Spot-check block ${block} — tx ${sample.tx_hash.slice(0, 10)}... vault ${sample.vault.slice(0, 10)}... matches Portal`)
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
