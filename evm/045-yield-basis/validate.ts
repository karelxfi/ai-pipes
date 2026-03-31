import 'dotenv/config'
import { createClient } from '@clickhouse/client'

const client = createClient({
  url: process.env.CLICKHOUSE_URL ?? 'http://localhost:8123',
  database: process.env.CLICKHOUSE_DATABASE ?? 'yield_basis',
  username: process.env.CLICKHOUSE_USER ?? 'default',
  password: process.env.CLICKHOUSE_PASSWORD ?? 'password',
})

const PORTAL = 'https://portal.sqd.dev/datasets/ethereum-mainnet/stream'
const YB_WBTC_LT = '0x6095a220c5567360d459462a25b1ad5aead45204'

// Event topic0s
const DEPOSIT_TOPIC = '0xdcbc1c05240f31ff3ad067ef1ee35ce4997762752e3a095284754544f4c709d7'
const WITHDRAW_TOPIC = '0xfbde797d201c681b91056529119e0b02407c7bb96a4a2c75c01fc9667232c8db'
const DISTRIBUTE_FEES_TOPIC = '0x5bdcb9afddbd4bbebe8e11112e8b8ba0008f38b107b6c8d4bed13e9fb40acb1c'
const ALLOCATE_TOPIC = '0x6f16a992fba7b966942bb6064775e154f99de09fce962940d4e284c5c9132868'

async function query(sql: string): Promise<any[]> {
  const result = await client.query({ query: sql, format: 'JSONEachRow' })
  return result.json()
}

async function portalCount(fromBlock: number, toBlock: number, topic0s: string[]): Promise<number> {
  const body = {
    type: 'evm',
    fromBlock,
    toBlock,
    logs: [{ address: [YB_WBTC_LT], topic0: topic0s }],
    fields: { log: { address: true } },
  }
  const resp = await fetch(PORTAL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  const text = await resp.text()
  let count = 0
  for (const line of text.split('\n').filter(Boolean)) {
    const obj = JSON.parse(line)
    if (obj.logs) count += obj.logs.length
  }
  return count
}

let passed = 0
let failed = 0

function pass(msg: string) { console.log(`PASS: ${msg}`); passed++ }
function fail(msg: string) { console.log(`FAIL: ${msg}`); failed++ }

async function main() {
  console.log('\n=== Yield Basis yb-WBTC Vault Validation ===\n')

  // Phase 1: Structural checks
  console.log('--- Phase 1: Structural Checks ---')

  const [vaultCount] = await query('SELECT count() as c FROM vault_events')
  const vc = parseInt(vaultCount.c)
  if (vc > 100) pass(`Structural - vault_events has ${vc} rows`)
  else fail(`Structural - vault_events only has ${vc} rows (expected >100)`)

  const [leverageCount] = await query('SELECT count() as c FROM leverage_ops')
  const lc = parseInt(leverageCount.c)
  if (lc > 10) pass(`Structural - leverage_ops has ${lc} rows`)
  else fail(`Structural - leverage_ops only has ${lc} rows (expected >10)`)

  // Schema check
  const vaultCols = await query("SELECT name FROM system.columns WHERE database='yield_basis' AND table='vault_events'")
  const expectedVault = ['vault', 'event_type', 'sender', 'owner', 'receiver', 'assets', 'shares', 'block_number', 'tx_hash', 'log_index', 'timestamp']
  const actualVault = vaultCols.map((r: any) => r.name)
  if (expectedVault.every(c => actualVault.includes(c))) pass('Structural - vault_events schema OK')
  else fail(`Structural - vault_events missing columns: ${expectedVault.filter(c => !actualVault.includes(c))}`)

  const leverageCols = await query("SELECT name FROM system.columns WHERE database='yield_basis' AND table='leverage_ops'")
  const expectedLev = ['vault', 'op_type', 'sender', 'amount', 'secondary_amount', 'discount', 'block_number', 'tx_hash', 'log_index', 'timestamp']
  const actualLev = leverageCols.map((r: any) => r.name)
  if (expectedLev.every(c => actualLev.includes(c))) pass('Structural - leverage_ops schema OK')
  else fail(`Structural - leverage_ops missing columns: ${expectedLev.filter(c => !actualLev.includes(c))}`)

  // Timestamp range
  const [timeRange] = await query('SELECT min(timestamp) as mn, max(timestamp) as mx FROM vault_events')
  pass(`Structural - timestamps ${timeRange.mn} to ${timeRange.mx}`)

  // Event types check
  const eventTypes = await query("SELECT DISTINCT event_type FROM vault_events")
  const types = eventTypes.map((r: any) => r.event_type)
  if (types.includes('deposit') && types.includes('withdraw')) pass('Structural - both deposit and withdraw events present')
  else fail(`Structural - missing event types, got: ${types}`)

  const opTypes = await query("SELECT DISTINCT op_type FROM leverage_ops")
  const ops = opTypes.map((r: any) => r.op_type)
  if (ops.includes('distribute_borrower_fees')) pass('Structural - borrower fee distribution events present')
  else fail(`Structural - missing distribute_borrower_fees, got: ${ops}`)

  // Phase 2: Portal cross-reference (sample a 5000-block window)
  console.log('\n--- Phase 2: Portal Cross-Reference ---')

  const [blockRange] = await query('SELECT min(block_number) as mn, max(block_number) as mx FROM vault_events')
  const minBlock = parseInt(blockRange.mn)
  const maxBlock = parseInt(blockRange.mx)

  // Use a 5000-block sample window from the busiest period
  const sampleFrom = minBlock
  const sampleTo = minBlock + 5000

  // Count vault events in sample from ClickHouse
  const [chSampleVault] = await query(`SELECT count() as c FROM vault_events WHERE block_number >= ${sampleFrom} AND block_number <= ${sampleTo}`)
  const chSampleVaultCount = parseInt(chSampleVault.c)

  // Count from Portal
  const portalVaultCount = await portalCount(sampleFrom, sampleTo, [DEPOSIT_TOPIC, WITHDRAW_TOPIC])
  const vaultDiff = Math.abs(portalVaultCount - chSampleVaultCount) / Math.max(portalVaultCount, 1) * 100
  if (vaultDiff <= 5) pass(`Portal cross-ref vault events (blocks ${sampleFrom}-${sampleTo}) - ClickHouse: ${chSampleVaultCount}, Portal: ${portalVaultCount} (${vaultDiff.toFixed(1)}% diff)`)
  else fail(`Portal cross-ref vault events (blocks ${sampleFrom}-${sampleTo}) - ClickHouse: ${chSampleVaultCount}, Portal: ${portalVaultCount} (${vaultDiff.toFixed(1)}% diff, exceeds 5%)`)

  // Count fee distributions in sample
  const [chSampleFee] = await query(`SELECT count() as c FROM leverage_ops WHERE block_number >= ${sampleFrom} AND block_number <= ${sampleTo}`)
  const chSampleFeeCount = parseInt(chSampleFee.c)

  const portalFeeCount = await portalCount(sampleFrom, sampleTo, [DISTRIBUTE_FEES_TOPIC, ALLOCATE_TOPIC])
  const feeDiff = Math.abs(portalFeeCount - chSampleFeeCount) / Math.max(portalFeeCount, 1) * 100
  if (feeDiff <= 5) pass(`Portal cross-ref leverage ops (blocks ${sampleFrom}-${sampleTo}) - ClickHouse: ${chSampleFeeCount}, Portal: ${portalFeeCount} (${feeDiff.toFixed(1)}% diff)`)
  else fail(`Portal cross-ref leverage ops (blocks ${sampleFrom}-${sampleTo}) - ClickHouse: ${chSampleFeeCount}, Portal: ${portalFeeCount} (${feeDiff.toFixed(1)}% diff, exceeds 5%)`)

  // Phase 3: Transaction spot-checks
  console.log('\n--- Phase 3: Transaction Spot-Checks ---')

  // Pick first deposit tx
  const [firstDeposit] = await query("SELECT tx_hash, block_number, sender, assets, shares FROM vault_events WHERE event_type='deposit' ORDER BY block_number LIMIT 1")

  // Verify against Portal
  const spotBody1 = {
    type: 'evm',
    fromBlock: parseInt(firstDeposit.block_number),
    toBlock: parseInt(firstDeposit.block_number),
    logs: [{ address: [YB_WBTC_LT], topic0: [DEPOSIT_TOPIC] }],
    fields: { log: { address: true, topics: true, data: true, transactionHash: true }, block: { number: true } },
  }
  const spotResp1 = await fetch(PORTAL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(spotBody1) })
  const spotText1 = await spotResp1.text()
  let foundTx1 = false
  for (const line of spotText1.split('\n').filter(Boolean)) {
    const obj = JSON.parse(line)
    if (obj.logs) {
      for (const log of obj.logs) {
        if (log.transactionHash === firstDeposit.tx_hash) {
          foundTx1 = true
          if (log.address.toLowerCase() === YB_WBTC_LT) {
            pass(`Spot-check tx ${firstDeposit.tx_hash.substring(0, 12)}... - block ${firstDeposit.block_number}, contract matches`)
          } else {
            fail(`Spot-check tx ${firstDeposit.tx_hash.substring(0, 12)}... - contract mismatch`)
          }
        }
      }
    }
  }
  if (!foundTx1) fail(`Spot-check tx ${firstDeposit.tx_hash.substring(0, 12)}... - not found in Portal`)

  // Pick a fee distribution tx
  const [firstFee] = await query("SELECT tx_hash, block_number, sender, amount FROM leverage_ops WHERE op_type='distribute_borrower_fees' ORDER BY block_number LIMIT 1")

  const spotBody2 = {
    type: 'evm',
    fromBlock: parseInt(firstFee.block_number),
    toBlock: parseInt(firstFee.block_number),
    logs: [{ address: [YB_WBTC_LT], topic0: [DISTRIBUTE_FEES_TOPIC] }],
    fields: { log: { address: true, topics: true, data: true, transactionHash: true }, block: { number: true } },
  }
  const spotResp2 = await fetch(PORTAL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(spotBody2) })
  const spotText2 = await spotResp2.text()
  let foundTx2 = false
  for (const line of spotText2.split('\n').filter(Boolean)) {
    const obj = JSON.parse(line)
    if (obj.logs) {
      for (const log of obj.logs) {
        if (log.transactionHash === firstFee.tx_hash) {
          foundTx2 = true
          // Verify sender from topic1
          const senderFromTopic = '0x' + log.topics[1].substring(26).toLowerCase()
          if (senderFromTopic === firstFee.sender.toLowerCase()) {
            pass(`Spot-check fee tx ${firstFee.tx_hash.substring(0, 12)}... - block ${firstFee.block_number}, sender matches`)
          } else {
            fail(`Spot-check fee tx ${firstFee.tx_hash.substring(0, 12)}... - sender mismatch: CH=${firstFee.sender}, Portal=${senderFromTopic}`)
          }
        }
      }
    }
  }
  if (!foundTx2) fail(`Spot-check fee tx ${firstFee.tx_hash.substring(0, 12)}... - not found in Portal`)

  // Pick a recent withdraw tx
  const recentWithdraw = await query("SELECT tx_hash, block_number, sender FROM vault_events WHERE event_type='withdraw' ORDER BY block_number DESC LIMIT 1")
  if (recentWithdraw.length > 0) {
    const w = recentWithdraw[0]
    const spotBody3 = {
      type: 'evm',
      fromBlock: parseInt(w.block_number),
      toBlock: parseInt(w.block_number),
      logs: [{ address: [YB_WBTC_LT], topic0: [WITHDRAW_TOPIC] }],
      fields: { log: { address: true, topics: true, transactionHash: true }, block: { number: true } },
    }
    const spotResp3 = await fetch(PORTAL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(spotBody3) })
    const spotText3 = await spotResp3.text()
    let foundTx3 = false
    for (const line of spotText3.split('\n').filter(Boolean)) {
      const obj = JSON.parse(line)
      if (obj.logs) {
        for (const log of obj.logs) {
          if (log.transactionHash === w.tx_hash) {
            foundTx3 = true
            pass(`Spot-check withdraw tx ${w.tx_hash.substring(0, 12)}... - block ${w.block_number}, found in Portal`)
          }
        }
      }
    }
    if (!foundTx3) fail(`Spot-check withdraw tx ${w.tx_hash.substring(0, 12)}... - not found in Portal`)
  }

  // Summary
  console.log(`\n=== Results: ${passed} passed, ${failed} failed ===\n`)
  await client.close()
  process.exit(failed > 0 ? 1 : 0)
}

main().catch(e => { console.error(e); process.exit(1) })
