import 'dotenv/config'
import { createClient } from '@clickhouse/client'

const CLICKHOUSE_URL = process.env.CLICKHOUSE_URL ?? 'http://localhost:8123'
const CLICKHOUSE_DATABASE = process.env.CLICKHOUSE_DATABASE ?? 'morpho_blue'
const CLICKHOUSE_USER = process.env.CLICKHOUSE_USER ?? 'default'
const CLICKHOUSE_PASSWORD = process.env.CLICKHOUSE_PASSWORD ?? 'password'

// Morpho Blue singleton contract on Ethereum
const CONTRACT = '0xBBBBBbbBBb9cc5e90e3b3Af64bDAF62C37EEFFCb'

// Event topic0 signatures
const SUPPLY_TOPIC0 = '0xedf8870433c83823eb071d3df1caa8d008f12f6440918c20d75a3602cda30fe0'
const BORROW_TOPIC0 = '0x570954540bed6b1304a87dfe815a5eda4a648f7097a16240dcd85c9b5fd42a43'
const LIQUIDATE_TOPIC0 = '0xa4946ede45d0c6f06a0f5ce92c9ad3b4751452d2fe0e25010783bcab57a67e41'

const TABLES = ['morpho_blue_supply', 'morpho_blue_borrow', 'morpho_blue_liquidate'] as const
const TOPIC0_MAP: Record<string, string> = {
  morpho_blue_supply: SUPPLY_TOPIC0,
  morpho_blue_borrow: BORROW_TOPIC0,
  morpho_blue_liquidate: LIQUIDATE_TOPIC0,
}

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
  console.log(`Validating ${CLICKHOUSE_DATABASE} (3 tables)`)
  console.log('='.repeat(60))

  // ============================================================
  // Phase 1: Structural checks
  // ============================================================
  console.log('\n--- Phase 1: Structural Checks ---')

  const tableCounts: Record<string, number> = {}
  let globalMinBlock = Infinity
  let globalMaxBlock = 0

  for (const table of TABLES) {
    const countRows = await query<{ count: string }>(`SELECT count() as count FROM ${table}`)
    const rowCount = Number(countRows[0]?.count ?? 0)
    tableCounts[table] = rowCount
    assert(rowCount > 0, `${table} has rows (found ${rowCount})`)

    const columns = await query<{ name: string }>(
      `SELECT name FROM system.columns WHERE database = '${CLICKHOUSE_DATABASE}' AND table = '${table}'`
    )
    const columnNames = columns.map((c) => c.name)
    const commonCols = ['id', 'block_number', 'tx_hash', 'log_index', 'timestamp', 'sign']
    for (const col of commonCols) {
      assert(columnNames.includes(col), `${table}: column '${col}' exists`)
    }

    const blockRange = await query<{ min_block: string; max_block: string }>(
      `SELECT min(block_number) as min_block, max(block_number) as max_block FROM ${table}`
    )
    const minBlock = Number(blockRange[0]?.min_block ?? 0)
    const maxBlock = Number(blockRange[0]?.max_block ?? 0)
    assert(minBlock >= 18883124, `${table}: min block >= 18883124 (got ${minBlock})`)
    if (minBlock < globalMinBlock) globalMinBlock = minBlock
    if (maxBlock > globalMaxBlock) globalMaxBlock = maxBlock
  }

  // Supply-specific columns
  const supplyCols = await query<{ name: string }>(
    `SELECT name FROM system.columns WHERE database = '${CLICKHOUSE_DATABASE}' AND table = 'morpho_blue_supply'`
  )
  for (const col of ['caller', 'on_behalf', 'assets', 'shares']) {
    assert(supplyCols.map(c => c.name).includes(col), `morpho_blue_supply: column '${col}' exists`)
  }

  // Liquidate-specific columns
  const liqCols = await query<{ name: string }>(
    `SELECT name FROM system.columns WHERE database = '${CLICKHOUSE_DATABASE}' AND table = 'morpho_blue_liquidate'`
  )
  for (const col of ['caller', 'borrower', 'repaid_assets', 'seized_assets', 'bad_debt_assets']) {
    assert(liqCols.map(c => c.name).includes(col), `morpho_blue_liquidate: column '${col}' exists`)
  }

  // Timestamp range check
  const timeRange = await query<{ min_ts: string; max_ts: string }>(
    `SELECT min(timestamp) as min_ts, max(timestamp) as max_ts FROM morpho_blue_supply`
  )
  if (timeRange.length > 0) {
    const minTs = new Date(timeRange[0].min_ts)
    assert(minTs.getFullYear() >= 2024, `Min timestamp is 2024+ (got ${minTs.toISOString()})`)
  }

  // ============================================================
  // Phase 2: Portal cross-reference
  // ============================================================
  console.log('\n--- Phase 2: Portal Cross-Reference ---')

  for (const table of TABLES) {
    try {
      const topic0 = TOPIC0_MAP[table]
      // Sample 10K blocks from start of indexed range
      const blockRange = await query<{ min_block: string; max_block: string }>(
        `SELECT min(block_number) as min_block, max(block_number) as max_block FROM ${table}`
      )
      const sampleStart = Number(blockRange[0]?.min_block ?? 0)
      const sampleEnd = Math.min(sampleStart + 10000, Number(blockRange[0]?.max_block ?? 0))

      const portalBlocks = await portalQuery('ethereum-mainnet', {
        fromBlock: sampleStart,
        toBlock: sampleEnd,
        logs: [{
          address: [CONTRACT.toLowerCase()],
          topic0: [topic0],
        }],
        fields: { log: { transactionHash: true } },
      })

      let portalSampleCount = 0
      for (const block of portalBlocks) {
        if (block.logs) portalSampleCount += block.logs.length
      }

      const chSample = await query<{ count: string }>(
        `SELECT count() as count FROM ${table} WHERE block_number >= ${sampleStart} AND block_number <= ${sampleEnd}`
      )
      const chSampleCount = Number(chSample[0]?.count ?? 0)

      if (portalSampleCount === chSampleCount) {
        pass(`${table} Portal cross-ref (blocks ${sampleStart}-${sampleEnd}) - ClickHouse: ${chSampleCount}, Portal: ${portalSampleCount} (exact match)`)
      } else {
        const diff = Math.abs(chSampleCount - portalSampleCount)
        const diffPct = portalSampleCount > 0 ? (diff / portalSampleCount) * 100 : 0
        if (diffPct <= 5) {
          pass(`${table} Portal cross-ref (blocks ${sampleStart}-${sampleEnd}) - ClickHouse: ${chSampleCount}, Portal: ${portalSampleCount} (${diffPct.toFixed(1)}% diff, within tolerance)`)
        } else {
          fail(`${table} Portal cross-ref (blocks ${sampleStart}-${sampleEnd}) - ClickHouse: ${chSampleCount}, Portal: ${portalSampleCount} (${diffPct.toFixed(1)}% diff, EXCEEDS 5% tolerance)`)
        }
      }
    } catch (err) {
      fail(`${table} Portal cross-ref failed: ${(err as Error).message}`)
    }
  }

  // ============================================================
  // Phase 3: Transaction spot-checks
  // ============================================================
  console.log('\n--- Phase 3: Transaction Spot-Checks ---')

  // Spot-check Supply events
  try {
    const samples = await query<{
      tx_hash: string;
      block_number: string;
      id: string;
    }>(`SELECT tx_hash, block_number, id FROM morpho_blue_supply ORDER BY block_number LIMIT 2`)

    for (const sample of samples) {
      const blockNum = Number(sample.block_number)
      const blockData = await portalQuery('ethereum-mainnet', {
        fromBlock: blockNum,
        toBlock: blockNum,
        logs: [{
          address: [CONTRACT.toLowerCase()],
          topic0: [SUPPLY_TOPIC0],
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
        const addressMatch = match.address?.toLowerCase() === CONTRACT.toLowerCase()
        const topicMatch = match.topics?.[0]?.toLowerCase() === SUPPLY_TOPIC0.toLowerCase()
        // topic1 = market id (bytes32, indexed)
        const idMatch = match.topics?.[1]
          ? match.topics[1].toLowerCase() === sample.id.toLowerCase()
          : false

        if (addressMatch && topicMatch && idMatch) {
          pass(`Supply spot-check tx ${sample.tx_hash.slice(0, 10)}... block ${blockNum} - contract, event, market id match Portal`)
        } else {
          fail(`Supply spot-check tx ${sample.tx_hash.slice(0, 10)}... block ${blockNum} - field mismatch (addr:${addressMatch} topic:${topicMatch} id:${idMatch})`)
        }
      } else {
        fail(`Supply spot-check tx ${sample.tx_hash.slice(0, 10)}... block ${blockNum} - tx NOT found in Portal data`)
      }
    }
  } catch (err) {
    fail(`Supply spot-checks failed: ${(err as Error).message}`)
  }

  // Spot-check a Liquidate event
  try {
    const liqSamples = await query<{
      tx_hash: string;
      block_number: string;
      id: string;
    }>(`SELECT tx_hash, block_number, id FROM morpho_blue_liquidate ORDER BY block_number LIMIT 1`)

    for (const sample of liqSamples) {
      const blockNum = Number(sample.block_number)
      const blockData = await portalQuery('ethereum-mainnet', {
        fromBlock: blockNum,
        toBlock: blockNum,
        logs: [{
          address: [CONTRACT.toLowerCase()],
          topic0: [LIQUIDATE_TOPIC0],
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
        const addressMatch = match.address?.toLowerCase() === CONTRACT.toLowerCase()
        const topicMatch = match.topics?.[0]?.toLowerCase() === LIQUIDATE_TOPIC0.toLowerCase()

        if (addressMatch && topicMatch) {
          pass(`Liquidate spot-check tx ${sample.tx_hash.slice(0, 10)}... block ${blockNum} - contract, event match Portal`)
        } else {
          fail(`Liquidate spot-check tx ${sample.tx_hash.slice(0, 10)}... block ${blockNum} - field mismatch`)
        }
      } else {
        fail(`Liquidate spot-check tx ${sample.tx_hash.slice(0, 10)}... block ${blockNum} - tx NOT found in Portal data`)
      }
    }
  } catch (err) {
    fail(`Liquidate spot-checks failed: ${(err as Error).message}`)
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
