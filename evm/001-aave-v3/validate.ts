import 'dotenv/config'
import { createClient } from '@clickhouse/client'

const CLICKHOUSE_URL = process.env.CLICKHOUSE_URL ?? 'http://localhost:8123'
const CLICKHOUSE_DATABASE = process.env.CLICKHOUSE_DATABASE ?? 'aave_v3_pool'
const CLICKHOUSE_USER = process.env.CLICKHOUSE_USER ?? 'default'
const CLICKHOUSE_PASSWORD = process.env.CLICKHOUSE_PASSWORD ?? 'password'
const TABLE = 'aave_v_3_pool_liquidation_call'

// Aave V3 Pool on Ethereum
const CONTRACT = '0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2'
// LiquidationCall event signature
const LIQUIDATION_TOPIC0 = '0xe413a321e8681d831f4dbccbca790d2952b56f977908e45be37335533e005286'

const client = createClient({
  url: CLICKHOUSE_URL,
  database: CLICKHOUSE_DATABASE,
  username: CLICKHOUSE_USER,
  password: CLICKHOUSE_PASSWORD,
})

let failures = 0
let passes = 0

function pass(message: string) {
  console.log(`PASS: ${message}`)
  passes++
}

function fail(message: string) {
  console.error(`FAIL: ${message}`)
  failures++
}

function assert(condition: boolean, message: string) {
  if (condition) pass(message)
  else fail(message)
}

async function query<T = Record<string, unknown>>(sql: string): Promise<T[]> {
  const result = await client.query({ query: sql, format: 'JSONEachRow' })
  return result.json<T>()
}

// Portal query helper (HTTP API)
async function portalQuery(dataset: string, body: object): Promise<any[]> {
  const res = await fetch(`https://portal.sqd.dev/datasets/${dataset}/stream`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type: 'evm', ...body }),
  })
  if (!res.ok) throw new Error(`Portal API error: ${res.status} ${await res.text()}`)
  // Portal returns JSONL (one JSON object per line)
  const text = await res.text()
  return text.trim().split('\n').filter(Boolean).map(line => JSON.parse(line))
}

async function main() {
  console.log('=' .repeat(60))
  console.log(`Validating ${CLICKHOUSE_DATABASE}.${TABLE}`)
  console.log('=' .repeat(60))

  // ============================================================
  // Phase 1: Structural checks
  // ============================================================
  console.log('\n--- Phase 1: Structural Checks ---')

  const countRows = await query<{ count: string }>(`SELECT count() as count FROM ${TABLE}`)
  const rowCount = Number(countRows[0]?.count ?? 0)
  assert(rowCount > 0, `Table has rows (found ${rowCount})`)

  const columns = await query<{ name: string }>(
    `SELECT name FROM system.columns WHERE database = '${CLICKHOUSE_DATABASE}' AND table = '${TABLE}'`
  )
  const columnNames = columns.map((c) => c.name)
  const expectedColumns = [
    'collateral_asset', 'debt_asset', 'user', 'debt_to_cover',
    'liquidated_collateral_amount', 'liquidator', 'receive_a_token',
    'block_number', 'tx_hash', 'tx_index', 'log_index', 'timestamp', 'sign',
  ]
  for (const col of expectedColumns) {
    assert(columnNames.includes(col), `Column '${col}' exists`)
  }

  const timeRange = await query<{ min_ts: string; max_ts: string }>(
    `SELECT min(timestamp) as min_ts, max(timestamp) as max_ts FROM ${TABLE}`
  )
  if (timeRange.length > 0) {
    const minTs = new Date(timeRange[0].min_ts)
    const maxTs = new Date(timeRange[0].max_ts)
    assert(minTs.getFullYear() >= 2023, `Min timestamp is 2023+ (got ${minTs.toISOString()})`)
    assert(maxTs.getFullYear() >= 2023, `Max timestamp is 2023+ (got ${maxTs.toISOString()})`)
    assert(maxTs > minTs, `Time range spans multiple dates`)
  }

  const negativeAmounts = await query<{ count: string }>(
    `SELECT count() as count FROM ${TABLE} WHERE debt_to_cover < 0 OR liquidated_collateral_amount < 0`
  )
  assert(Number(negativeAmounts[0]?.count ?? 0) === 0, 'No negative amounts')

  const emptyAddresses = await query<{ count: string }>(
    `SELECT count() as count FROM ${TABLE} WHERE collateral_asset = '' OR debt_asset = '' OR user = '' OR liquidator = ''`
  )
  assert(Number(emptyAddresses[0]?.count ?? 0) === 0, 'No empty addresses')

  const blockRange = await query<{ min_block: string; max_block: string }>(
    `SELECT min(block_number) as min_block, max(block_number) as max_block FROM ${TABLE}`
  )
  const minBlock = Number(blockRange[0]?.min_block ?? 0)
  const maxBlock = Number(blockRange[0]?.max_block ?? 0)
  assert(minBlock >= 18000000, `Min block >= 18000000 (got ${minBlock})`)

  // ============================================================
  // Phase 2: Portal cross-reference
  // ============================================================
  console.log('\n--- Phase 2: Portal Cross-Reference ---')

  try {
    // Use Portal count endpoint for accurate event count in the block range
    // The streaming API has limits, so we sample a smaller range and extrapolate
    // Pick a 10K block sample from the middle of our range
    const sampleStart = minBlock
    const sampleEnd = Math.min(minBlock + 10000, maxBlock)

    const portalBlocks = await portalQuery('ethereum-mainnet', {
      fromBlock: sampleStart,
      toBlock: sampleEnd,
      logs: [{
        address: [CONTRACT.toLowerCase()],
        topic0: [LIQUIDATION_TOPIC0],
      }],
      fields: { log: { transactionHash: true } },
    })

    let portalSampleCount = 0
    for (const block of portalBlocks) {
      if (block.logs) portalSampleCount += block.logs.length
    }

    // Get ClickHouse count for same sample range
    const chSample = await query<{ count: string }>(
      `SELECT count() as count FROM ${TABLE} WHERE block_number >= ${sampleStart} AND block_number <= ${sampleEnd}`
    )
    const chSampleCount = Number(chSample[0]?.count ?? 0)

    if (portalSampleCount === chSampleCount) {
      pass(`Portal cross-ref (blocks ${sampleStart}-${sampleEnd}) — ClickHouse: ${chSampleCount}, Portal: ${portalSampleCount} (exact match)`)
    } else {
      const diff = Math.abs(chSampleCount - portalSampleCount)
      const diffPct = portalSampleCount > 0 ? (diff / portalSampleCount) * 100 : 0
      if (diffPct <= 5) {
        pass(`Portal cross-ref (blocks ${sampleStart}-${sampleEnd}) — ClickHouse: ${chSampleCount}, Portal: ${portalSampleCount} (${diffPct.toFixed(1)}% diff, within tolerance)`)
      } else {
        fail(`Portal cross-ref (blocks ${sampleStart}-${sampleEnd}) — ClickHouse: ${chSampleCount}, Portal: ${portalSampleCount} (${diffPct.toFixed(1)}% diff, EXCEEDS 5% tolerance)`)
      }
    }
  } catch (err) {
    fail(`Portal cross-ref failed: ${(err as Error).message}`)
  }

  // ============================================================
  // Phase 3: Transaction spot-checks
  // ============================================================
  console.log('\n--- Phase 3: Transaction Spot-Checks ---')

  try {
    // Pick 3 transactions from ClickHouse
    const samples = await query<{
      tx_hash: string;
      block_number: string;
      collateral_asset: string;
      debt_asset: string;
      user: string;
    }>(`SELECT tx_hash, block_number, collateral_asset, debt_asset, user FROM ${TABLE} ORDER BY block_number LIMIT 3`)

    for (const sample of samples) {
      const blockNum = Number(sample.block_number)
      // Query Portal for logs in that specific block
      const blockData = await portalQuery('ethereum-mainnet', {
        fromBlock: blockNum,
        toBlock: blockNum,
        logs: [{
          address: [CONTRACT.toLowerCase()],
          topic0: [LIQUIDATION_TOPIC0],
        }],
        fields: {
          log: { transactionHash: true, topics: true, address: true },
        },
      })

      // Find our tx in Portal data
      const portalLogs = blockData.flatMap((b: any) => b.logs || [])
      const match = portalLogs.find(
        (l: any) => l.transactionHash?.toLowerCase() === sample.tx_hash.toLowerCase()
      )

      if (match) {
        // Verify address matches
        const addressMatch = match.address?.toLowerCase() === CONTRACT.toLowerCase()
        // Verify topic0 matches (LiquidationCall)
        const topicMatch = match.topics?.[0]?.toLowerCase() === LIQUIDATION_TOPIC0.toLowerCase()
        // Verify indexed params: topic1=collateral, topic2=debt, topic3=user
        const collateralMatch = match.topics?.[1]
          ? match.topics[1].toLowerCase().includes(sample.collateral_asset.toLowerCase().slice(2))
          : false
        const debtMatch = match.topics?.[2]
          ? match.topics[2].toLowerCase().includes(sample.debt_asset.toLowerCase().slice(2))
          : false

        if (addressMatch && topicMatch && collateralMatch && debtMatch) {
          pass(`Spot-check tx ${sample.tx_hash.slice(0, 10)}... block ${blockNum} — contract, event, collateral, debt all match Portal`)
        } else {
          fail(`Spot-check tx ${sample.tx_hash.slice(0, 10)}... block ${blockNum} — field mismatch (addr:${addressMatch} topic:${topicMatch} coll:${collateralMatch} debt:${debtMatch})`)
        }
      } else {
        fail(`Spot-check tx ${sample.tx_hash.slice(0, 10)}... block ${blockNum} — tx NOT found in Portal data`)
      }
    }
  } catch (err) {
    fail(`Spot-checks failed: ${(err as Error).message}`)
  }

  // ============================================================
  // Summary
  // ============================================================
  console.log('\n' + '=' .repeat(60))
  console.log(`Results: ${passes} passed, ${failures} failed`)
  console.log('=' .repeat(60))

  await client.close()
  process.exit(failures === 0 ? 0 : 1)
}

main().catch((err) => {
  console.error('Validation error:', err)
  process.exit(1)
})
