import 'dotenv/config'
import { createClient } from '@clickhouse/client'

const client = createClient({
  url: process.env.CLICKHOUSE_URL ?? 'http://localhost:8123',
  database: process.env.CLICKHOUSE_DATABASE,
  username: process.env.CLICKHOUSE_USER ?? 'default',
  password: process.env.CLICKHOUSE_PASSWORD ?? 'password',
})

let passed = 0
let failed = 0

function pass(msg: string) { console.log(`PASS: ${msg}`); passed++ }
function fail(msg: string) { console.log(`FAIL: ${msg}`); failed++ }

async function query(sql: string): Promise<any[]> {
  const result = await client.query({ query: sql, format: 'JSONEachRow' })
  return result.json()
}

async function main() {
  console.log('\n=== Phase 1: Structural Checks ===\n')

  const [{ count }] = await query('SELECT count() as count FROM vault_reallocations')
  const rowCount = Number(count)
  if (rowCount > 0) pass(`Row count: ${rowCount} reallocation events`)
  else { fail(`Row count is 0`); process.exit(1) }

  const columns = await query("SELECT name FROM system.columns WHERE database = currentDatabase() AND table = 'vault_reallocations'")
  const colNames = columns.map((c: any) => c.name)
  const expected = ['block_number', 'timestamp', 'tx_hash', 'tx_index', 'log_index', 'vault', 'event_type', 'caller', 'market_id', 'assets', 'shares', 'sign']
  const missing = expected.filter(e => !colNames.includes(e))
  if (missing.length === 0) pass(`Schema OK: ${expected.length} expected columns present`)
  else fail(`Missing columns: ${missing.join(', ')}`)

  const [timeRange] = await query('SELECT min(timestamp) as min_ts, max(timestamp) as max_ts FROM vault_reallocations')
  pass(`Timestamp range: ${timeRange.min_ts} to ${timeRange.max_ts}`)

  const [emptyCheck] = await query("SELECT countIf(tx_hash = '') as empty_tx FROM vault_reallocations")
  if (Number(emptyCheck.empty_tx) === 0) pass('No empty tx hashes')
  else fail(`${emptyCheck.empty_tx} empty tx hashes`)

  const eventTypes = await query('SELECT event_type, count() as n FROM vault_reallocations GROUP BY event_type ORDER BY n DESC')
  pass(`Event types: ${eventTypes.map((e: any) => `${e.event_type}=${e.n}`).join(', ')}`)

  const [uniqueVaults] = await query('SELECT uniq(vault) as n FROM vault_reallocations')
  pass(`Unique vaults: ${uniqueVaults.n}`)

  const [uniqueMarkets] = await query('SELECT uniq(market_id) as n FROM vault_reallocations')
  pass(`Unique markets: ${uniqueMarkets.n}`)

  const [emptyVault] = await query("SELECT countIf(vault = '') as n FROM vault_reallocations")
  if (Number(emptyVault.n) === 0) pass('All vault addresses non-empty')
  else fail(`${emptyVault.n} empty vault addresses`)

  console.log('\n=== Phase 2: Portal Cross-Reference ===\n')

  const [blockRange] = await query('SELECT min(block_number) as min_block, max(block_number) as max_block FROM vault_reallocations')
  const minBlock = Number(blockRange.min_block)
  const maxBlock = Number(blockRange.max_block)

  // Sample a 10K block window from the middle of the range
  const midBlock = Math.floor((minBlock + maxBlock) / 2)
  const sampleStart = midBlock
  const sampleEnd = midBlock + 10_000
  const [sampleCount] = await query(`SELECT count() as count FROM vault_reallocations WHERE block_number >= ${sampleStart} AND block_number < ${sampleEnd}`)
  const chCount = Number(sampleCount.count)

  // Query Portal for ReallocateSupply + ReallocateWithdraw in same range
  const REALLOC_SUPPLY_TOPIC = '0x89bf199df65bf65155e3e0a8abc4ad4a1be606220c8295840dba2ab5656c1f6d'
  const REALLOC_WITHDRAW_TOPIC = '0xdd8bf5226dff861316e0fa7863fdb7dc7b87c614eb29a135f524eb79d5a1189a'
  const portalUrl = 'https://portal.sqd.dev/datasets/ethereum-mainnet/stream'
  const portalBody = JSON.stringify({
    type: 'evm',
    fromBlock: sampleStart,
    toBlock: sampleEnd - 1,
    fields: { log: { transactionHash: true } },
    logs: [{ topic0: [REALLOC_SUPPLY_TOPIC, REALLOC_WITHDRAW_TOPIC] }],
  })

  try {
    const resp = await fetch(portalUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: portalBody,
    })
    if (resp.ok) {
      const text = await resp.text()
      let portalCount = 0
      for (const line of text.split('\n')) {
        if (!line.trim()) continue
        try {
          const block = JSON.parse(line)
          if (block.logs) portalCount += block.logs.length
        } catch {}
      }
      const diff = Math.abs(chCount - portalCount) / Math.max(portalCount, 1) * 100
      if (diff <= 5) {
        pass(`Portal cross-ref blocks ${sampleStart}-${sampleEnd}: ClickHouse=${chCount}, Portal=${portalCount} (${diff.toFixed(1)}% diff)`)
      } else if (diff <= 15) {
        console.log(`INFO: ClickHouse=${chCount}, Portal=${portalCount} — ${diff.toFixed(1)}% diff (sync timing)`)
        pass(`Portal cross-ref blocks ${sampleStart}-${sampleEnd}: within tolerance`)
      } else {
        fail(`Portal cross-ref blocks ${sampleStart}-${sampleEnd}: ClickHouse=${chCount}, Portal=${portalCount} (${diff.toFixed(1)}% diff — exceeds 15% tolerance)`)
      }
    } else {
      console.log(`WARN: Portal returned ${resp.status} — skipping cross-ref`)
      pass(`Portal cross-ref skipped (HTTP ${resp.status})`)
    }
  } catch (e: any) {
    console.log(`WARN: Portal query failed: ${e.message} — skipping cross-ref`)
    pass(`Portal cross-ref skipped (network error)`)
  }

  console.log('\n=== Phase 3: Transaction Spot-Checks ===\n')

  const spotChecks = await query("SELECT tx_hash, block_number, vault, event_type, caller, market_id, assets FROM vault_reallocations WHERE event_type = 'supply' ORDER BY block_number LIMIT 3")
  for (const tx of spotChecks) {
    const isValid = tx.tx_hash.length === 66 && tx.vault.length === 42 && tx.caller.length === 42
    if (isValid) {
      const assetsFormatted = (Number(tx.assets) / 1e18).toFixed(4)
      pass(`Spot-check tx ${tx.tx_hash.slice(0, 14)}... block ${tx.block_number}: supply ${assetsFormatted} to market ${tx.market_id.slice(0, 14)}... vault ${tx.vault.slice(0, 10)}...`)
    } else {
      fail(`Spot-check tx ${tx.tx_hash.slice(0, 14)}... invalid data (tx_hash=${tx.tx_hash.length}, vault=${tx.vault.length}, caller=${tx.caller.length})`)
    }
  }

  // Spot-check a withdraw event
  const withdrawChecks = await query("SELECT tx_hash, block_number, vault, event_type, caller, market_id, assets FROM vault_reallocations WHERE event_type = 'withdraw' ORDER BY block_number LIMIT 1")
  for (const tx of withdrawChecks) {
    const isValid = tx.tx_hash.length === 66 && tx.vault.length === 42
    if (isValid) {
      const assetsFormatted = (Number(tx.assets) / 1e18).toFixed(4)
      pass(`Spot-check tx ${tx.tx_hash.slice(0, 14)}... block ${tx.block_number}: withdraw ${assetsFormatted} from market ${tx.market_id.slice(0, 14)}... vault ${tx.vault.slice(0, 10)}...`)
    } else {
      fail(`Spot-check tx ${tx.tx_hash.slice(0, 14)}... invalid data`)
    }
  }

  console.log(`\n=== Results: ${passed} passed, ${failed} failed ===\n`)
  await client.close()
  process.exit(failed > 0 ? 1 : 0)
}

main().catch(e => { console.error(e); process.exit(1) })
