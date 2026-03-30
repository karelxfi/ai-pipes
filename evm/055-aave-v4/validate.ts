import 'dotenv/config'
import { createClient } from '@clickhouse/client'

const CLICKHOUSE_URL = process.env.CLICKHOUSE_URL ?? 'http://localhost:8123'
const CLICKHOUSE_DATABASE = process.env.CLICKHOUSE_DATABASE ?? 'aave_v4'
const CLICKHOUSE_USER = process.env.CLICKHOUSE_USER ?? 'default'
const CLICKHOUSE_PASSWORD = process.env.CLICKHOUSE_PASSWORD ?? 'password'

// Aave v4 contract addresses (lowercase for comparison)
const CORE_HUB = '0xcca852bc40e560adc3b1cc58ca5b55638ce826c9'
const PLUS_HUB = '0x06002e9c4412cb7814a791ea3666d905871e536a'
const PRIME_HUB = '0x9438827dca022d0f354a8a8c332da1e5eb9f9f931'
const MAIN_SPOKE = '0x94e7a5dcbe816e498b89ab752661904e2f56c485'
const DEPLOYMENT_BLOCK = 24720891

// Event topic0 signatures
const ADD_TOPIC0 = '0xb233dd05ed21346e144167b35a6213bcf04768dbdffdc8339e8b027b94b9f305'
const SUPPLY_TOPIC0 = '0xd986db228cb1fe8392c5f45ff5f2c639b7db6cbd9ca7d1fe70b2de90c2c8c961'

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
  console.log(`Validating ${CLICKHOUSE_DATABASE} — Aave v4 Launch Monitor`)
  console.log('='.repeat(60))

  // ============================================================
  // Phase 1: Structural checks
  // ============================================================
  console.log('\n--- Phase 1: Structural Checks ---')

  // --- hub_flows ---
  const hubCount = await query<{ count: string }>(`SELECT count() as count FROM hub_flows`)
  const hubRowCount = Number(hubCount[0]?.count ?? 0)
  assert(hubRowCount > 0, `hub_flows has rows (found ${hubRowCount})`)

  const hubColumns = await query<{ name: string }>(
    `SELECT name FROM system.columns WHERE database = '${CLICKHOUSE_DATABASE}' AND table = 'hub_flows'`
  )
  const hubColumnNames = hubColumns.map(c => c.name)
  const expectedHubColumns = [
    'event_type', 'hub', 'asset_id', 'spoke', 'shares', 'amount',
    'block_number', 'tx_hash', 'log_index', 'timestamp', 'sign',
  ]
  for (const col of expectedHubColumns) {
    assert(hubColumnNames.includes(col), `hub_flows column '${col}' exists`)
  }

  // --- spoke_events ---
  const spokeCount = await query<{ count: string }>(`SELECT count() as count FROM spoke_events`)
  const spokeRowCount = Number(spokeCount[0]?.count ?? 0)
  assert(spokeRowCount > 0, `spoke_events has rows (found ${spokeRowCount})`)

  const spokeColumns = await query<{ name: string }>(
    `SELECT name FROM system.columns WHERE database = '${CLICKHOUSE_DATABASE}' AND table = 'spoke_events'`
  )
  const spokeColumnNames = spokeColumns.map(c => c.name)
  const expectedSpokeColumns = [
    'event_type', 'spoke', 'reserve_id', 'caller', 'user', 'shares', 'amount',
    'block_number', 'tx_hash', 'log_index', 'timestamp', 'sign',
  ]
  for (const col of expectedSpokeColumns) {
    assert(spokeColumnNames.includes(col), `spoke_events column '${col}' exists`)
  }

  // --- liquidations (may be empty if none have occurred yet) ---
  const liqCount = await query<{ count: string }>(`SELECT count() as count FROM liquidations`)
  const liqRowCount = Number(liqCount[0]?.count ?? 0)
  console.log(`INFO: liquidations has ${liqRowCount} rows (may be 0 if none occurred yet)`)

  const liqColumns = await query<{ name: string }>(
    `SELECT name FROM system.columns WHERE database = '${CLICKHOUSE_DATABASE}' AND table = 'liquidations'`
  )
  const liqColumnNames = liqColumns.map(c => c.name)
  const expectedLiqColumns = [
    'spoke', 'collateral_reserve_id', 'debt_reserve_id', 'user', 'liquidator',
    'receive_shares', 'debt_amount_restored', 'drawn_shares_liquidated',
    'collateral_amount_removed', 'collateral_shares_liquidated',
    'collateral_shares_to_liquidator', 'block_number', 'tx_hash', 'log_index',
    'timestamp', 'sign',
  ]
  for (const col of expectedLiqColumns) {
    assert(liqColumnNames.includes(col), `liquidations column '${col}' exists`)
  }

  // Timestamp checks — deployment is March 2026
  const hubTimeRange = await query<{ min_ts: string; max_ts: string }>(
    `SELECT min(timestamp) as min_ts, max(timestamp) as max_ts FROM hub_flows`
  )
  if (hubTimeRange.length > 0 && hubRowCount > 0) {
    const minTs = new Date(hubTimeRange[0].min_ts)
    const maxTs = new Date(hubTimeRange[0].max_ts)
    assert(minTs.getFullYear() >= 2026, `hub_flows min timestamp is 2026+ (got ${minTs.toISOString()})`)
    assert(maxTs >= minTs, `hub_flows time range is valid`)
  }

  const spokeTimeRange = await query<{ min_ts: string; max_ts: string }>(
    `SELECT min(timestamp) as min_ts, max(timestamp) as max_ts FROM spoke_events`
  )
  if (spokeTimeRange.length > 0 && spokeRowCount > 0) {
    const minTs = new Date(spokeTimeRange[0].min_ts)
    const maxTs = new Date(spokeTimeRange[0].max_ts)
    assert(minTs.getFullYear() >= 2026, `spoke_events min timestamp is 2026+ (got ${minTs.toISOString()})`)
    assert(maxTs >= minTs, `spoke_events time range is valid`)
  }

  // Block number checks
  const hubBlockRange = await query<{ min_block: string; max_block: string }>(
    `SELECT min(block_number) as min_block, max(block_number) as max_block FROM hub_flows`
  )
  const hubMinBlock = Number(hubBlockRange[0]?.min_block ?? 0)
  const hubMaxBlock = Number(hubBlockRange[0]?.max_block ?? 0)
  assert(hubMinBlock >= DEPLOYMENT_BLOCK, `hub_flows min block >= ${DEPLOYMENT_BLOCK} (got ${hubMinBlock})`)

  const spokeBlockRange = await query<{ min_block: string; max_block: string }>(
    `SELECT min(block_number) as min_block, max(block_number) as max_block FROM spoke_events`
  )
  const spokeMinBlock = Number(spokeBlockRange[0]?.min_block ?? 0)
  const spokeMaxBlock = Number(spokeBlockRange[0]?.max_block ?? 0)
  assert(spokeMinBlock >= DEPLOYMENT_BLOCK, `spoke_events min block >= ${DEPLOYMENT_BLOCK} (got ${spokeMinBlock})`)

  // No empty addresses
  const emptyHubAddrs = await query<{ count: string }>(
    `SELECT count() as count FROM hub_flows WHERE hub = '' OR spoke = ''`
  )
  assert(Number(emptyHubAddrs[0]?.count ?? 0) === 0, 'hub_flows has no empty hub/spoke addresses')

  const emptySpokeAddrs = await query<{ count: string }>(
    `SELECT count() as count FROM spoke_events WHERE spoke = '' OR caller = '' OR user = ''`
  )
  assert(Number(emptySpokeAddrs[0]?.count ?? 0) === 0, 'spoke_events has no empty spoke/caller/user addresses')

  // ============================================================
  // Phase 2: Portal cross-reference
  // ============================================================
  console.log('\n--- Phase 2: Portal Cross-Reference ---')

  // Cross-reference Hub Add events from Core Hub
  // NOTE: Near chain head, Portal query endpoint lags behind the stream API.
  // Use a narrow range from the start of indexed data (more likely fully indexed).
  try {
    const sampleStart = hubMinBlock
    const sampleEnd = Math.min(hubMinBlock + 100, hubMaxBlock)

    const portalBlocks = await portalQuery('ethereum-mainnet', {
      fromBlock: sampleStart,
      toBlock: sampleEnd,
      logs: [{
        address: [CORE_HUB],
        topic0: [ADD_TOPIC0],
      }],
      fields: { log: { transactionHash: true } },
    })

    let portalAddCount = 0
    for (const block of portalBlocks) {
      if (block.logs) portalAddCount += block.logs.length
    }

    // Get ClickHouse count for same range — filter to Core Hub Add events only
    const chAddSample = await query<{ count: string }>(
      `SELECT count() as count FROM hub_flows WHERE event_type = 'Add' AND hub = '${CORE_HUB}' AND block_number >= ${sampleStart} AND block_number <= ${sampleEnd}`
    )
    const chAddCount = Number(chAddSample[0]?.count ?? 0)

    if (portalAddCount === 0 && chAddCount === 0) {
      pass(`Hub Add cross-ref (blocks ${sampleStart}-${sampleEnd}) — both ClickHouse and Portal have 0 events`)
    } else if (portalAddCount === chAddCount) {
      pass(`Hub Add cross-ref (blocks ${sampleStart}-${sampleEnd}) — ClickHouse: ${chAddCount}, Portal: ${portalAddCount} (exact match)`)
    } else {
      const diff = Math.abs(chAddCount - portalAddCount)
      const diffPct = Math.max(portalAddCount, chAddCount) > 0 ? (diff / Math.max(portalAddCount, chAddCount)) * 100 : 0
      if (diffPct <= 10) {
        pass(`Hub Add cross-ref (blocks ${sampleStart}-${sampleEnd}) — ClickHouse: ${chAddCount}, Portal: ${portalAddCount} (${diffPct.toFixed(1)}% diff, within tolerance for near-head data)`)
      } else {
        fail(`Hub Add cross-ref (blocks ${sampleStart}-${sampleEnd}) — ClickHouse: ${chAddCount}, Portal: ${portalAddCount} (${diffPct.toFixed(1)}% diff, EXCEEDS tolerance)`)
      }
    }
  } catch (err) {
    fail(`Hub Add Portal cross-ref failed: ${(err as Error).message}`)
  }

  // Cross-reference Spoke Supply events from Main Spoke
  try {
    const sampleStart = spokeMinBlock
    const sampleEnd = Math.min(spokeMinBlock + 100, spokeMaxBlock)

    const portalBlocks = await portalQuery('ethereum-mainnet', {
      fromBlock: sampleStart,
      toBlock: sampleEnd,
      logs: [{
        address: [MAIN_SPOKE],
        topic0: [SUPPLY_TOPIC0],
      }],
      fields: { log: { transactionHash: true } },
    })

    let portalSupplyCount = 0
    for (const block of portalBlocks) {
      if (block.logs) portalSupplyCount += block.logs.length
    }

    const chSupplySample = await query<{ count: string }>(
      `SELECT count() as count FROM spoke_events WHERE event_type = 'Supply' AND spoke = '${MAIN_SPOKE}' AND block_number >= ${sampleStart} AND block_number <= ${sampleEnd}`
    )
    const chSupplyCount = Number(chSupplySample[0]?.count ?? 0)

    if (portalSupplyCount === 0 && chSupplyCount === 0) {
      pass(`Spoke Supply cross-ref (blocks ${sampleStart}-${sampleEnd}) — both ClickHouse and Portal have 0 events`)
    } else if (portalSupplyCount === chSupplyCount) {
      pass(`Spoke Supply cross-ref (blocks ${sampleStart}-${sampleEnd}) — ClickHouse: ${chSupplyCount}, Portal: ${portalSupplyCount} (exact match)`)
    } else {
      const diff = Math.abs(chSupplyCount - portalSupplyCount)
      const diffPct = Math.max(portalSupplyCount, chSupplyCount) > 0 ? (diff / Math.max(portalSupplyCount, chSupplyCount)) * 100 : 0
      if (diffPct <= 10) {
        pass(`Spoke Supply cross-ref (blocks ${sampleStart}-${sampleEnd}) — ClickHouse: ${chSupplyCount}, Portal: ${portalSupplyCount} (${diffPct.toFixed(1)}% diff, within tolerance for near-head data)`)
      } else {
        fail(`Spoke Supply cross-ref (blocks ${sampleStart}-${sampleEnd}) — ClickHouse: ${chSupplyCount}, Portal: ${portalSupplyCount} (${diffPct.toFixed(1)}% diff, EXCEEDS tolerance)`)
      }
    }
  } catch (err) {
    fail(`Spoke Supply Portal cross-ref failed: ${(err as Error).message}`)
  }

  // ============================================================
  // Phase 3: Transaction spot-checks
  // ============================================================
  console.log('\n--- Phase 3: Transaction Spot-Checks ---')

  // Spot-check spoke_events transactions
  try {
    const samples = await query<{
      tx_hash: string
      block_number: string
      spoke: string
      event_type: string
      caller: string
    }>(`SELECT tx_hash, block_number, spoke, event_type, caller FROM spoke_events ORDER BY block_number LIMIT 3`)

    for (const sample of samples) {
      const blockNum = Number(sample.block_number)
      const spokeAddr = sample.spoke.toLowerCase()

      // Determine the topic0 based on event type
      let topic0: string | null = null
      if (sample.event_type === 'Supply') topic0 = SUPPLY_TOPIC0
      // For other event types, we just verify the tx exists at the contract
      // Query Portal for any logs from the spoke contract in that block
      const blockData = await portalQuery('ethereum-mainnet', {
        fromBlock: blockNum,
        toBlock: blockNum,
        logs: [{
          address: [spokeAddr],
          ...(topic0 ? { topic0: [topic0] } : {}),
        }],
        fields: {
          log: { transactionHash: true, topics: true, address: true },
        },
      })

      const portalLogs = blockData.flatMap((b: any) => b.logs || [])
      const match = portalLogs.find(
        (l: any) => l.transactionHash?.toLowerCase() === sample.tx_hash.toLowerCase()
      )

      if (match) {
        const addressMatch = match.address?.toLowerCase() === spokeAddr
        if (addressMatch) {
          pass(`Spot-check tx ${sample.tx_hash.slice(0, 10)}... block ${blockNum} — ${sample.event_type} from spoke ${spokeAddr.slice(0, 10)}... matches Portal`)
        } else {
          fail(`Spot-check tx ${sample.tx_hash.slice(0, 10)}... block ${blockNum} — address mismatch (CH: ${spokeAddr}, Portal: ${match.address})`)
        }
      } else {
        fail(`Spot-check tx ${sample.tx_hash.slice(0, 10)}... block ${blockNum} — tx NOT found in Portal data`)
      }
    }
  } catch (err) {
    fail(`Spot-checks failed: ${(err as Error).message}`)
  }

  // Spot-check hub_flows transactions
  try {
    const hubSamples = await query<{
      tx_hash: string
      block_number: string
      hub: string
      event_type: string
    }>(`SELECT tx_hash, block_number, hub, event_type FROM hub_flows ORDER BY block_number LIMIT 2`)

    for (const sample of hubSamples) {
      const blockNum = Number(sample.block_number)
      const hubAddr = sample.hub.toLowerCase()

      const blockData = await portalQuery('ethereum-mainnet', {
        fromBlock: blockNum,
        toBlock: blockNum,
        logs: [{
          address: [hubAddr],
          ...(sample.event_type === 'Add' ? { topic0: [ADD_TOPIC0] } : {}),
        }],
        fields: {
          log: { transactionHash: true, address: true },
        },
      })

      const portalLogs = blockData.flatMap((b: any) => b.logs || [])
      const match = portalLogs.find(
        (l: any) => l.transactionHash?.toLowerCase() === sample.tx_hash.toLowerCase()
      )

      if (match) {
        const addressMatch = match.address?.toLowerCase() === hubAddr
        if (addressMatch) {
          pass(`Spot-check hub tx ${sample.tx_hash.slice(0, 10)}... block ${blockNum} — ${sample.event_type} from hub ${hubAddr.slice(0, 10)}... matches Portal`)
        } else {
          fail(`Spot-check hub tx ${sample.tx_hash.slice(0, 10)}... block ${blockNum} — address mismatch`)
        }
      } else {
        fail(`Spot-check hub tx ${sample.tx_hash.slice(0, 10)}... block ${blockNum} — tx NOT found in Portal data`)
      }
    }
  } catch (err) {
    fail(`Hub spot-checks failed: ${(err as Error).message}`)
  }

  // ============================================================
  // Summary
  // ============================================================
  console.log('\n' + '='.repeat(60))
  console.log(`Results: ${passes} passed, ${failures} failed`)
  console.log(`Tables: hub_flows (${hubRowCount} rows), spoke_events (${spokeRowCount} rows), liquidations (${liqRowCount} rows)`)
  console.log('='.repeat(60))

  await client.close()
  process.exit(failures === 0 ? 0 : 1)
}

main().catch((err) => {
  console.error('Validation error:', err)
  process.exit(1)
})
