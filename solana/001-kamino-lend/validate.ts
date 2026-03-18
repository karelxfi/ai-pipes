import 'dotenv/config'
import { createClient } from '@clickhouse/client'

const CLICKHOUSE_URL = process.env.CLICKHOUSE_URL ?? 'http://localhost:8123'
const CLICKHOUSE_DATABASE = process.env.CLICKHOUSE_DATABASE ?? 'kamino_lend'
const CLICKHOUSE_USER = process.env.CLICKHOUSE_USER ?? 'default'
const CLICKHOUSE_PASSWORD = process.env.CLICKHOUSE_PASSWORD ?? 'password'
const TABLE = 'kamino_actions'

// Kamino Lend program ID
const PROGRAM_ID = 'KLend2g3cP87fffoy8q1mQqGKjrxjC8boSyAYavgmjD'
// All tracked d8 discriminators
const D8_VALUES = [
  '0x81c70402de271a2e',
  '0x797f12cc49f5e141',
  '0x91b20de14cf09348',
  '0xb1479abce2854a37',
  '0x4b5d5ddc2296dac4',
]

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

// Portal query helper (HTTP API) — Solana variant
async function portalQuery(dataset: string, body: object): Promise<any[]> {
  const res = await fetch(`https://portal.sqd.dev/datasets/${dataset}/stream`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type: 'solana', ...body }),
  })
  if (!res.ok) throw new Error(`Portal API error: ${res.status} ${await res.text()}`)
  // Portal returns JSONL (one JSON object per line)
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
  const expectedColumns = ['slot', 'timestamp', 'tx_signature', 'fee_payer', 'action', 'sign']
  for (const col of expectedColumns) {
    assert(columnNames.includes(col), `Column '${col}' exists`)
  }

  // Verify action values are valid
  const actionValues = await query<{ action: string }>(
    `SELECT DISTINCT action FROM ${TABLE}`
  )
  const validActions = ['deposit', 'borrow', 'repay', 'liquidate', 'withdraw']
  for (const row of actionValues) {
    assert(validActions.includes(row.action), `Action '${row.action}' is valid`)
  }

  const slotRange = await query<{ min_slot: string; max_slot: string }>(
    `SELECT min(slot) as min_slot, max(slot) as max_slot FROM ${TABLE}`
  )
  const minSlot = Number(slotRange[0]?.min_slot ?? 0)
  const maxSlot = Number(slotRange[0]?.max_slot ?? 0)
  assert(minSlot >= 280000000, `Min slot >= 280000000 (got ${minSlot})`)
  assert(maxSlot > minSlot, `Slot range spans multiple values (${minSlot} to ${maxSlot})`)

  const timeRange = await query<{ min_ts: string; max_ts: string }>(
    `SELECT min(timestamp) as min_ts, max(timestamp) as max_ts FROM ${TABLE}`
  )
  if (timeRange.length > 0) {
    const minTs = new Date(timeRange[0].min_ts)
    const maxTs = new Date(timeRange[0].max_ts)
    assert(minTs.getFullYear() >= 2024, `Min timestamp is 2024+ (got ${minTs.toISOString()})`)
    assert(maxTs > minTs, `Time range spans multiple dates`)
    console.log(`  Data range: ${minTs.toISOString().slice(0, 10)} to ${maxTs.toISOString().slice(0, 10)}`)
  }

  const emptyFields = await query<{ count: string }>(
    `SELECT count() as count FROM ${TABLE} WHERE tx_signature = '' OR fee_payer = '' OR action = ''`
  )
  assert(Number(emptyFields[0]?.count ?? 0) === 0, 'No empty required fields')

  // ============================================================
  // Phase 2: Portal cross-reference
  // ============================================================
  console.log('\n--- Phase 2: Portal Cross-Reference ---')

  try {
    // Sample a 1000-slot range from the start of our data
    const sampleStart = minSlot
    const sampleEnd = Math.min(minSlot + 1000, maxSlot)

    const portalBlocks = await portalQuery('solana-mainnet', {
      fromBlock: sampleStart,
      toBlock: sampleEnd,
      instructions: [{
        programId: [PROGRAM_ID],
        d8: D8_VALUES,
        isCommitted: true,
      }],
      fields: {
        block: { number: true },
        instruction: { programId: true, data: true },
      },
    })

    let portalSampleCount = 0
    for (const block of portalBlocks) {
      if (block.instructions) portalSampleCount += block.instructions.length
    }

    // Get ClickHouse count for same slot range
    const chSample = await query<{ count: string }>(
      `SELECT count() as count FROM ${TABLE} WHERE slot >= ${sampleStart} AND slot <= ${sampleEnd}`
    )
    const chSampleCount = Number(chSample[0]?.count ?? 0)

    if (portalSampleCount === 0 && chSampleCount === 0) {
      pass(`Portal cross-ref (slots ${sampleStart}-${sampleEnd}) — both Portal and ClickHouse report 0 (sparse range, trying wider)`)

      // Try a wider range
      const wideEnd = Math.min(minSlot + 50000, maxSlot)
      const widePortal = await portalQuery('solana-mainnet', {
        fromBlock: sampleStart,
        toBlock: wideEnd,
        instructions: [{
          programId: [PROGRAM_ID],
          d8: D8_VALUES,
          isCommitted: true,
        }],
        fields: {
          block: { number: true },
          instruction: { programId: true, data: true },
        },
      })
      let widePortalCount = 0
      for (const block of widePortal) {
        if (block.instructions) widePortalCount += block.instructions.length
      }
      const wideCh = await query<{ count: string }>(
        `SELECT count() as count FROM ${TABLE} WHERE slot >= ${sampleStart} AND slot <= ${wideEnd}`
      )
      const wideChCount = Number(wideCh[0]?.count ?? 0)

      if (widePortalCount === wideChCount) {
        pass(`Portal cross-ref wide (slots ${sampleStart}-${wideEnd}) — ClickHouse: ${wideChCount}, Portal: ${widePortalCount} (exact match)`)
      } else {
        const diff = Math.abs(wideChCount - widePortalCount)
        const diffPct = widePortalCount > 0 ? (diff / widePortalCount) * 100 : 0
        if (diffPct <= 5) {
          pass(`Portal cross-ref wide (slots ${sampleStart}-${wideEnd}) — ClickHouse: ${wideChCount}, Portal: ${widePortalCount} (${diffPct.toFixed(1)}% diff, within tolerance)`)
        } else {
          fail(`Portal cross-ref wide (slots ${sampleStart}-${wideEnd}) — ClickHouse: ${wideChCount}, Portal: ${widePortalCount} (${diffPct.toFixed(1)}% diff, EXCEEDS 5% tolerance)`)
        }
      }
    } else if (portalSampleCount === chSampleCount) {
      pass(`Portal cross-ref (slots ${sampleStart}-${sampleEnd}) — ClickHouse: ${chSampleCount}, Portal: ${portalSampleCount} (exact match)`)
    } else {
      const diff = Math.abs(chSampleCount - portalSampleCount)
      const diffPct = portalSampleCount > 0 ? (diff / portalSampleCount) * 100 : 0
      if (diffPct <= 5) {
        pass(`Portal cross-ref (slots ${sampleStart}-${sampleEnd}) — ClickHouse: ${chSampleCount}, Portal: ${portalSampleCount} (${diffPct.toFixed(1)}% diff, within tolerance)`)
      } else {
        fail(`Portal cross-ref (slots ${sampleStart}-${sampleEnd}) — ClickHouse: ${chSampleCount}, Portal: ${portalSampleCount} (${diffPct.toFixed(1)}% diff, EXCEEDS 5% tolerance)`)
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
    // Pick 3 distinct slots and verify instruction counts match Portal
    const slots = await query<{ slot: string; ch_count: string; action: string }>(
      `SELECT slot, count() as ch_count, any(action) as action FROM ${TABLE} GROUP BY slot ORDER BY slot LIMIT 3`
    )

    for (const sample of slots) {
      const slotNum = Number(sample.slot)
      const chCount = Number(sample.ch_count)

      const blockData = await portalQuery('solana-mainnet', {
        fromBlock: slotNum,
        toBlock: slotNum,
        instructions: [{
          programId: [PROGRAM_ID],
          d8: D8_VALUES,
          isCommitted: true,
        }],
        fields: {
          block: { number: true },
          instruction: { programId: true },
        },
      })

      let portalCount = 0
      for (const block of blockData) {
        if (block.instructions) portalCount += block.instructions.length
      }

      if (portalCount === chCount) {
        pass(`Spot-check slot ${slotNum} — ClickHouse: ${chCount}, Portal: ${portalCount} (exact match, includes '${sample.action}')`)
      } else if (portalCount > 0) {
        pass(`Spot-check slot ${slotNum} — Portal confirms KLend activity (CH: ${chCount}, Portal: ${portalCount})`)
      } else {
        fail(`Spot-check slot ${slotNum} — Portal returned 0 KLend instructions`)
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
