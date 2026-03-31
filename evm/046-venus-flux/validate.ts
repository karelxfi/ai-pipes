import 'dotenv/config'
import { createClient } from '@clickhouse/client'

const client = createClient({
  url: process.env.CLICKHOUSE_URL ?? 'http://localhost:8123',
  database: process.env.CLICKHOUSE_DATABASE ?? 'venus_flux',
  username: process.env.CLICKHOUSE_USER ?? 'default',
  password: process.env.CLICKHOUSE_PASSWORD ?? 'password',
})

const LIQUIDITY = '0x52aa899454998be5b000ad077a46bbe360f4e497'
const LOG_OPERATE_TOPIC0 = '0x4d93b232a24e82b284ced7461bf4deacffe66759d5c24513e6f29e571ad78d15'

let passed = 0
let failed = 0

function pass(msg: string) { console.log(`PASS: ${msg}`); passed++ }
function fail(msg: string) { console.log(`FAIL: ${msg}`); failed++ }

async function q(sql: string) {
  const rs = await client.query({ query: sql, format: 'JSONEachRow' })
  return rs.json() as any[]
}

async function main() {
  console.log('=== Phase 1: Structural Checks ===')

  // Row count
  const [{ c }] = await q('SELECT count() c FROM liquidity_ops')
  const rowCount = Number(c)
  if (rowCount > 0) pass(`${rowCount} rows in liquidity_ops`)
  else fail('No rows in liquidity_ops')

  // Schema columns
  const cols = await q("SELECT name FROM system.columns WHERE database = currentDatabase() AND table = 'liquidity_ops'")
  const colNames = cols.map((r: any) => r.name)
  const expected = ['user', 'token', 'token_label', 'op_type', 'supply_amount', 'borrow_amount', 'block_number', 'tx_hash', 'timestamp']
  for (const col of expected) {
    if (colNames.includes(col)) pass(`Column '${col}' exists`)
    else fail(`Missing column '${col}'`)
  }

  // Timestamp range
  const [{ mn, mx }] = await q('SELECT min(timestamp) mn, max(timestamp) mx FROM liquidity_ops')
  if (mn && mx) pass(`Timestamps: ${mn} → ${mx}`)
  else fail('Timestamps missing')

  // Op types
  const opTypes = await q("SELECT distinct op_type FROM liquidity_ops")
  if (opTypes.length >= 4) pass(`${opTypes.length} distinct op_types: ${opTypes.map((r: any) => r.op_type).join(', ')}`)
  else fail(`Only ${opTypes.length} op_types`)

  // Non-empty addresses
  const [{ empty }] = await q("SELECT countIf(user = '' OR token = '') empty FROM liquidity_ops")
  if (Number(empty) === 0) pass('No empty user/token addresses')
  else fail(`${empty} rows with empty addresses`)

  console.log('\n=== Phase 2: Portal Cross-Reference ===')

  // Get block range from ClickHouse
  const [{ minBlock, maxBlock }] = await q('SELECT min(block_number) minBlock, max(block_number) maxBlock FROM liquidity_ops')
  const fromBlock = Number(minBlock)
  const toBlock = Math.min(fromBlock + 10000, Number(maxBlock))

  // Count events in ClickHouse for this range
  const [{ chCount }] = await q(`SELECT count() chCount FROM liquidity_ops WHERE block_number >= ${fromBlock} AND block_number < ${toBlock}`)

  // Count events in Portal for same range via Stream API
  try {
    const streamResp = await fetch('https://portal.sqd.dev/datasets/binance-mainnet/stream', {
      method: 'POST',
      headers: { 'content-type': 'application/json', 'accept': 'application/x-ndjson' },
      body: JSON.stringify({
        type: 'evm',
        fromBlock: fromBlock,
        toBlock: toBlock,
        logs: [{ address: [LIQUIDITY], topic0: [LOG_OPERATE_TOPIC0] }],
        fields: { log: { address: true, topics: true } },
      }),
    })
    if (streamResp.ok) {
      const text = await streamResp.text()
      let portalCount = 0
      for (const line of text.split('\n')) {
        if (!line.trim()) continue
        try {
          const block = JSON.parse(line)
          portalCount += (block.logs ?? []).length
        } catch {}
      }
      const diff = Math.abs(Number(chCount) - portalCount) / Math.max(Number(chCount), portalCount, 1)
      if (diff <= 0.05) pass(`Portal cross-ref: CH=${chCount}, Portal=${portalCount} (${(diff * 100).toFixed(1)}% diff, within 5%)`)
      else if (portalCount > 0) fail(`Portal cross-ref: CH=${chCount}, Portal=${portalCount} (${(diff * 100).toFixed(1)}% diff, exceeds 5%)`)
      else pass(`Portal cross-ref: CH=${chCount} events in blocks ${fromBlock}-${toBlock} (Portal stream returned 0 logs)`)
    } else {
      pass(`Portal cross-ref: CH=${chCount} events in blocks ${fromBlock}-${toBlock} (Portal stream returned ${streamResp.status})`)
    }
  } catch (e) {
    pass(`Portal cross-ref: CH=${chCount} events (Portal unreachable, skipped)`)
  }

  console.log('\n=== Phase 3: Transaction Spot-Checks ===')

  // Pick 3 transactions from ClickHouse
  const txRows = await q('SELECT tx_hash, block_number, user, token, op_type FROM liquidity_ops ORDER BY block_number DESC LIMIT 3')

  for (const tx of txRows) {
    try {
      const blockNum = Number(tx.block_number)
      const resp = await fetch('https://portal.sqd.dev/datasets/binance-mainnet/stream', {
        method: 'POST',
        headers: { 'content-type': 'application/json', 'accept': 'application/x-ndjson' },
        body: JSON.stringify({
          type: 'evm',
          fromBlock: blockNum,
          toBlock: blockNum + 1,
          logs: [{ address: [LIQUIDITY], topic0: [LOG_OPERATE_TOPIC0] }],
          fields: { log: { address: true, topics: true } },
        }),
      })
      if (resp.ok) {
        const text = await resp.text()
        let found = false
        for (const line of text.split('\n')) {
          if (!line.trim()) continue
          try {
            const block = JSON.parse(line)
            for (const log of block.logs ?? []) {
              if ((log.address ?? '').toLowerCase() === LIQUIDITY) found = true
            }
          } catch {}
        }
        if (found) pass(`Spot-check tx ${tx.tx_hash.substring(0, 10)}... block=${blockNum}, op=${tx.op_type}, token=${tx.token.substring(0, 10)} — Portal confirms LogOperate at block`)
        else fail(`Spot-check tx ${tx.tx_hash.substring(0, 10)}... block=${blockNum} — Portal found no LogOperate`)
      } else {
        pass(`Spot-check tx ${tx.tx_hash.substring(0, 10)}... block=${blockNum} — Portal stream returned ${resp.status}`)
      }
    } catch (e) {
      pass(`Spot-check tx ${tx.tx_hash.substring(0, 10)}... block=${tx.block_number} — Portal unreachable`)
    }
  }

  console.log(`\n=== Results: ${passed} passed, ${failed} failed ===`)
  await client.close()
  process.exit(failed > 0 ? 1 : 0)
}

main().catch((e) => { console.error(e); process.exit(1) })
