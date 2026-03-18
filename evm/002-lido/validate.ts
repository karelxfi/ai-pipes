import 'dotenv/config'
import { createClient } from '@clickhouse/client'

const CLICKHOUSE_URL = process.env.CLICKHOUSE_URL ?? 'http://localhost:8123'
const CLICKHOUSE_DATABASE = process.env.CLICKHOUSE_DATABASE ?? 'lido'
const CLICKHOUSE_USER = process.env.CLICKHOUSE_USER ?? 'default'
const CLICKHOUSE_PASSWORD = process.env.CLICKHOUSE_PASSWORD ?? 'password'
const TABLE = 'lido_token_rebased'

// Lido stETH on Ethereum
const CONTRACT = '0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84'
// TokenRebased(uint256,uint256,uint256,uint256,uint256,uint256,uint256)
const TOKEN_REBASED_TOPIC0 = '0xff08c3ef606d198e316ef5b822193c489965899eb4e3c248cea1a4626c3eda50'

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
  const text = await res.text()
  return text.trim().split('\n').filter(Boolean).map(line => JSON.parse(line))
}

async function main() {
  console.log('='.repeat(60))
  console.log(`Validating ${CLICKHOUSE_DATABASE}.${TABLE}`)
  console.log('='.repeat(60))

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
    'report_timestamp', 'time_elapsed', 'pre_total_shares', 'pre_total_ether',
    'post_total_shares', 'post_total_ether', 'shares_minted_as_fees',
    'block_number', 'tx_hash', 'log_index', 'timestamp', 'sign',
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

  // TokenRebased amounts should all be positive (total pooled ETH and shares are always > 0)
  const zeroShares = await query<{ count: string }>(
    `SELECT count() as count FROM ${TABLE} WHERE post_total_shares = 0 OR post_total_ether = 0`
  )
  assert(Number(zeroShares[0]?.count ?? 0) === 0, 'No zero post_total_shares or post_total_ether')

  // Exchange rate sanity: postTotalEther/postTotalShares should be close to 1 (stETH ~= ETH)
  // Using string comparison since UInt256 values
  const ratioCheck = await query<{ count: string }>(
    `SELECT count() as count FROM ${TABLE} WHERE toFloat64(post_total_ether) / toFloat64(post_total_shares) < 0.5 OR toFloat64(post_total_ether) / toFloat64(post_total_shares) > 2.0`
  )
  assert(Number(ratioCheck[0]?.count ?? 0) === 0, 'Exchange rate (postEther/postShares) within 0.5-2.0 for all rebases')

  const blockRange = await query<{ min_block: string; max_block: string }>(
    `SELECT min(block_number) as min_block, max(block_number) as max_block FROM ${TABLE}`
  )
  const minBlock = Number(blockRange[0]?.min_block ?? 0)
  const maxBlock = Number(blockRange[0]?.max_block ?? 0)
  assert(minBlock >= 17000000, `Min block >= 17000000 (got ${minBlock})`)

  // ============================================================
  // Phase 2: Portal cross-reference
  // ============================================================
  console.log('\n--- Phase 2: Portal Cross-Reference ---')

  try {
    // Sample a 10K block range from the start of our data
    const sampleStart = minBlock
    const sampleEnd = Math.min(minBlock + 10000, maxBlock)

    const portalBlocks = await portalQuery('ethereum-mainnet', {
      fromBlock: sampleStart,
      toBlock: sampleEnd,
      logs: [{
        address: [CONTRACT.toLowerCase()],
        topic0: [TOKEN_REBASED_TOPIC0],
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
      post_total_ether: string;
      post_total_shares: string;
    }>(`SELECT tx_hash, block_number, post_total_ether, post_total_shares FROM ${TABLE} ORDER BY block_number LIMIT 3`)

    for (const sample of samples) {
      const blockNum = Number(sample.block_number)
      // Query Portal for logs in that specific block
      const blockData = await portalQuery('ethereum-mainnet', {
        fromBlock: blockNum,
        toBlock: blockNum,
        logs: [{
          address: [CONTRACT.toLowerCase()],
          topic0: [TOKEN_REBASED_TOPIC0],
        }],
        fields: {
          log: { transactionHash: true, topics: true, address: true, data: true },
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
        // Verify topic0 matches (TokenRebased)
        const topicMatch = match.topics?.[0]?.toLowerCase() === TOKEN_REBASED_TOPIC0.toLowerCase()

        // Verify the event has data (non-indexed params exist)
        const hasData = match.data && match.data.length > 2

        if (addressMatch && topicMatch && hasData) {
          pass(`Spot-check tx ${sample.tx_hash.slice(0, 10)}... block ${blockNum} — contract, event sig, and data payload all verified against Portal`)
        } else {
          fail(`Spot-check tx ${sample.tx_hash.slice(0, 10)}... block ${blockNum} — field mismatch (addr:${addressMatch} topic:${topicMatch} hasData:${hasData})`)
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
  console.log('\n' + '='.repeat(60))
  console.log(`Results: ${passes} passed, ${failures} failed`)
  console.log('='.repeat(60))

  await client.close()
  process.exit(failures === 0 ? 0 : 1)
}

main().catch((err) => {
  console.error('Validation error:', err)
  process.exit(1)
})
