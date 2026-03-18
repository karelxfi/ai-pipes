import { createClient } from '@clickhouse/client'

const CLICKHOUSE_URL = process.env.CLICKHOUSE_URL ?? 'http://localhost:8123'
const CLICKHOUSE_DATABASE = process.env.CLICKHOUSE_DATABASE ?? 'aave_v3_pool'
const TABLE = 'aave_v_3_pool_liquidation_call'

const client = createClient({
  url: CLICKHOUSE_URL,
  database: CLICKHOUSE_DATABASE,
})

let failures = 0

function assert(condition: boolean, message: string) {
  if (!condition) {
    console.error(`FAIL: ${message}`)
    failures++
  } else {
    console.log(`PASS: ${message}`)
  }
}

async function query<T = Record<string, unknown>>(sql: string): Promise<T[]> {
  const result = await client.query({ query: sql, format: 'JSONEachRow' })
  return result.json<T>()
}

async function main() {
  console.log(`Validating ${CLICKHOUSE_DATABASE}.${TABLE}...\n`)

  // 1. Table exists and has rows
  const countRows = await query<{ count: string }>(`SELECT count() as count FROM ${TABLE}`)
  const rowCount = Number(countRows[0]?.count ?? 0)
  assert(rowCount > 0, `Table has rows (found ${rowCount})`)

  // 2. Schema has expected columns
  const columns = await query<{ name: string }>(
    `SELECT name FROM system.columns WHERE database = '${CLICKHOUSE_DATABASE}' AND table = '${TABLE}'`
  )
  const columnNames = columns.map((c) => c.name)
  const expectedColumns = [
    'collateral_asset',
    'debt_asset',
    'user',
    'debt_to_cover',
    'liquidated_collateral_amount',
    'liquidator',
    'receive_a_token',
    'block_number',
    'tx_hash',
    'log_index',
    'timestamp',
    'sign',
  ]
  for (const col of expectedColumns) {
    assert(columnNames.includes(col), `Column '${col}' exists`)
  }

  // 3. Timestamps are in reasonable range (2023+)
  const timeRange = await query<{ min_ts: string; max_ts: string }>(
    `SELECT min(timestamp) as min_ts, max(timestamp) as max_ts FROM ${TABLE}`
  )
  if (timeRange.length > 0) {
    const minTs = new Date(timeRange[0].min_ts)
    const maxTs = new Date(timeRange[0].max_ts)
    assert(minTs.getFullYear() >= 2023, `Min timestamp is 2023+ (got ${minTs.toISOString()})`)
    assert(maxTs.getFullYear() >= 2023, `Max timestamp is 2023+ (got ${maxTs.toISOString()})`)
    assert(maxTs > minTs, `Max timestamp > min timestamp`)
  }

  // 4. Amounts are non-negative
  const negativeAmounts = await query<{ count: string }>(
    `SELECT count() as count FROM ${TABLE} WHERE debt_to_cover < 0 OR liquidated_collateral_amount < 0`
  )
  const negCount = Number(negativeAmounts[0]?.count ?? 0)
  assert(negCount === 0, `No negative amounts (found ${negCount} negative rows)`)

  // 5. Addresses are non-empty
  const emptyAddresses = await query<{ count: string }>(
    `SELECT count() as count FROM ${TABLE} WHERE collateral_asset = '' OR debt_asset = '' OR user = '' OR liquidator = ''`
  )
  const emptyCount = Number(emptyAddresses[0]?.count ?? 0)
  assert(emptyCount === 0, `No empty addresses (found ${emptyCount} empty rows)`)

  // 6. Block numbers are in expected range
  const blockRange = await query<{ min_block: string; max_block: string }>(
    `SELECT min(block_number) as min_block, max(block_number) as max_block FROM ${TABLE}`
  )
  if (blockRange.length > 0) {
    const minBlock = Number(blockRange[0].min_block)
    assert(minBlock >= 18000000, `Min block >= 18000000 (got ${minBlock})`)
  }

  console.log(`\n${failures === 0 ? 'ALL CHECKS PASSED' : `${failures} CHECK(S) FAILED`}`)
  await client.close()
  process.exit(failures === 0 ? 0 : 1)
}

main().catch((err) => {
  console.error('Validation error:', err)
  process.exit(1)
})
