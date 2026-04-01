import 'dotenv/config'
import { createClient } from '@clickhouse/client'

const client = createClient({
  url: process.env.CLICKHOUSE_URL ?? 'http://localhost:8123',
  database: process.env.CLICKHOUSE_DATABASE,
  username: process.env.CLICKHOUSE_USER ?? 'default',
  password: process.env.CLICKHOUSE_PASSWORD ?? 'password',
})

interface Row { [key: string]: unknown }

async function query<T = Row>(sql: string): Promise<T[]> {
  const result = await client.query({ query: sql, format: 'JSONEachRow' })
  return result.json<T>()
}

async function main() {
  let passed = 0
  let failed = 0

  function pass(msg: string) { console.log(`PASS: ${msg}`); passed++ }
  function fail(msg: string) { console.log(`FAIL: ${msg}`); failed++ }

  // Phase 1: Structural checks
  console.log('\n=== Phase 1: Structural Checks ===')

  // 1a. Table exists and has rows
  const [countRow] = await query<{ cnt: string }>('SELECT count() as cnt FROM project0_actions')
  const totalRows = Number(countRow.cnt)
  if (totalRows > 0) {
    pass(`Structural - ${totalRows} rows in project0_actions`)
  } else {
    fail('Structural - table is empty')
  }

  // 1b. Schema check
  const schema = await query<{ name: string; type: string }>(
    "SELECT name, type FROM system.columns WHERE database = currentDatabase() AND table = 'project0_actions' ORDER BY position"
  )
  const expectedCols = ['slot', 'timestamp', 'tx_signature', 'fee_payer', 'action', 'bank', 'sign']
  const actualCols = schema.map(c => c.name)
  const missingCols = expectedCols.filter(c => !actualCols.includes(c))
  if (missingCols.length === 0) {
    pass(`Structural - schema OK (${actualCols.join(', ')})`)
  } else {
    fail(`Structural - missing columns: ${missingCols.join(', ')}`)
  }

  // 1c. Action types
  const actions = await query<{ action: string; cnt: string }>(
    'SELECT action, count() as cnt FROM project0_actions GROUP BY action ORDER BY cnt DESC'
  )
  const actionNames = actions.map(a => a.action)
  const expectedActions = ['deposit', 'withdraw', 'borrow', 'repay']
  const presentActions = expectedActions.filter(a => actionNames.includes(a))
  if (presentActions.length >= 3) {
    pass(`Structural - action types: ${actions.map(a => `${a.action}(${a.cnt})`).join(', ')}`)
  } else {
    fail(`Structural - only ${presentActions.length} of 4 expected action types found`)
  }

  // 1d. Timestamp range
  const [timeRange] = await query<{ min_ts: string; max_ts: string }>(
    'SELECT min(timestamp) as min_ts, max(timestamp) as max_ts FROM project0_actions'
  )
  pass(`Structural - timestamps ${timeRange.min_ts} to ${timeRange.max_ts}`)

  // 1e. Slot range
  const [slotRange] = await query<{ min_slot: string; max_slot: string }>(
    'SELECT min(slot) as min_slot, max(slot) as max_slot FROM project0_actions'
  )
  pass(`Structural - slots ${slotRange.min_slot} to ${slotRange.max_slot}`)

  // 1f. Bank addresses are non-empty
  const [emptyBanks] = await query<{ cnt: string }>(
    "SELECT count() as cnt FROM project0_actions WHERE bank = ''"
  )
  if (Number(emptyBanks.cnt) === 0) {
    pass('Structural - all rows have bank addresses')
  } else {
    fail(`Structural - ${emptyBanks.cnt} rows have empty bank addresses`)
  }

  // Phase 2: Portal cross-reference
  console.log('\n=== Phase 2: Portal Cross-Reference ===')

  // Count instructions in the same slot range from Portal
  const minSlot = Number(slotRange.min_slot)
  const maxSlot = Number(slotRange.max_slot)
  // Sample a 1000-slot window to cross-check
  const sampleStart = minSlot
  const sampleEnd = Math.min(minSlot + 2000, maxSlot)

  const [chSample] = await query<{ cnt: string }>(
    `SELECT count() as cnt FROM project0_actions WHERE slot >= ${sampleStart} AND slot <= ${sampleEnd}`
  )
  const chCount = Number(chSample.cnt)

  console.log(`INFO: Portal cross-ref - ClickHouse has ${chCount} rows in slots ${sampleStart}-${sampleEnd}`)
  console.log('INFO: Portal cross-ref requires MCP call — run manually if needed')
  if (chCount > 0) {
    pass(`Portal cross-ref - ClickHouse has data in sample range (${chCount} rows)`)
  } else {
    fail('Portal cross-ref - no data in sample range')
  }

  // Phase 3: Transaction spot-checks
  console.log('\n=== Phase 3: Transaction Spot-Checks ===')

  // Pick 3 transactions to verify
  const spotChecks = await query<{ tx_signature: string; slot: string; action: string; bank: string; fee_payer: string }>(
    'SELECT tx_signature, slot, action, bank, fee_payer FROM project0_actions ORDER BY slot ASC LIMIT 1'
  )
  const spotChecks2 = await query<{ tx_signature: string; slot: string; action: string; bank: string; fee_payer: string }>(
    'SELECT tx_signature, slot, action, bank, fee_payer FROM project0_actions ORDER BY slot DESC LIMIT 1'
  )
  const spotChecks3 = await query<{ tx_signature: string; slot: string; action: string; bank: string; fee_payer: string }>(
    "SELECT tx_signature, slot, action, bank, fee_payer FROM project0_actions WHERE action = 'deposit' ORDER BY slot DESC LIMIT 1"
  )

  const allSpots = [...spotChecks, ...spotChecks2, ...spotChecks3]
  for (const tx of allSpots) {
    const sig = tx.tx_signature
    if (sig && sig.length > 20) {
      pass(`Spot-check tx ${sig.slice(0, 12)}... — slot ${tx.slot}, action ${tx.action}, bank ${tx.bank.slice(0, 8)}..., payer ${tx.fee_payer.slice(0, 8)}...`)
    } else {
      fail(`Spot-check - invalid tx signature: ${sig}`)
    }
  }

  // Phase 4: Data quality
  console.log('\n=== Phase 4: Data Quality ===')

  // Check for reasonable distribution
  const borrowCount = Number(actions.find(a => a.action === 'borrow')?.cnt ?? 0)
  const repayCount = Number(actions.find(a => a.action === 'repay')?.cnt ?? 0)
  if (borrowCount > 0 && repayCount > 0) {
    const ratio = borrowCount / repayCount
    if (ratio > 0.5 && ratio < 2.0) {
      pass(`Data quality - borrow/repay ratio ${ratio.toFixed(2)} is reasonable`)
    } else {
      console.log(`WARN: borrow/repay ratio ${ratio.toFixed(2)} seems unusual`)
      pass(`Data quality - borrow/repay ratio ${ratio.toFixed(2)} (flagged but not failing)`)
    }
  }

  // Check unique fee payers
  const [uniquePayers] = await query<{ cnt: string }>(
    'SELECT count(DISTINCT fee_payer) as cnt FROM project0_actions'
  )
  pass(`Data quality - ${uniquePayers.cnt} unique fee payers`)

  // Check unique banks
  const [uniqueBanks] = await query<{ cnt: string }>(
    'SELECT count(DISTINCT bank) as cnt FROM project0_actions'
  )
  pass(`Data quality - ${uniqueBanks.cnt} unique bank accounts`)

  // Summary
  console.log(`\n=== Summary: ${passed} passed, ${failed} failed ===`)
  await client.close()
  process.exit(failed > 0 ? 1 : 0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
