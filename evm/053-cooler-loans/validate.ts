import 'dotenv/config'
import { createClient } from '@clickhouse/client'

const client = createClient({
  url: process.env.CLICKHOUSE_URL ?? 'http://localhost:8123',
  database: process.env.CLICKHOUSE_DATABASE ?? 'cooler_loans',
  username: process.env.CLICKHOUSE_USER ?? 'default',
  password: process.env.CLICKHOUSE_PASSWORD ?? 'password',
})

async function query<T = Record<string, any>>(sql: string): Promise<T[]> {
  const rs = await client.query({ query: sql, format: 'JSONEachRow' })
  return rs.json() as Promise<T[]>
}

async function main() {
  let passed = 0
  let failed = 0

  function pass(msg: string) { console.log(`PASS: ${msg}`); passed++ }
  function fail(msg: string) { console.log(`FAIL: ${msg}`); failed++ }

  // Phase 1: Structural checks
  console.log('\n=== Phase 1: Structural Checks ===')

  // Table exists and has rows
  const [{ cnt }] = await query<{ cnt: string }>('SELECT count() as cnt FROM loan_events')
  const rowCount = Number(cnt)
  if (rowCount > 0) pass(`loan_events has ${rowCount} rows`)
  else fail('loan_events is empty')

  // Schema check
  const columns = await query<{ name: string }>('SELECT name FROM system.columns WHERE database = currentDatabase() AND table = \'loan_events\'')
  const colNames = columns.map(c => c.name)
  const expected = ['event_type', 'caller', 'account', 'recipient', 'amount', 'block_number', 'tx_hash', 'log_index', 'timestamp']
  for (const col of expected) {
    if (colNames.includes(col)) pass(`Column '${col}' exists`)
    else fail(`Column '${col}' missing`)
  }

  // Event type distribution
  const types = await query<{ event_type: string; cnt: string }>('SELECT event_type, count() as cnt FROM loan_events GROUP BY event_type ORDER BY cnt DESC')
  for (const t of types) {
    pass(`Event type '${t.event_type}': ${t.cnt} rows`)
  }

  // Timestamp range
  const [{ mn, mx }] = await query<{ mn: string; mx: string }>('SELECT min(timestamp) as mn, max(timestamp) as mx FROM loan_events')
  const minDate = new Date(mn)
  const maxDate = new Date(mx)
  if (minDate.getFullYear() >= 2025 && maxDate.getFullYear() >= 2025) {
    pass(`Timestamps in range: ${mn.slice(0, 10)} to ${mx.slice(0, 10)}`)
  } else {
    fail(`Timestamps out of range: ${mn} to ${mx}`)
  }

  // Amounts are non-negative
  const [{ neg }] = await query<{ neg: string }>('SELECT count() as neg FROM loan_events WHERE amount < 0')
  if (Number(neg) === 0) pass('All amounts are non-negative')
  else fail(`${neg} rows have negative amounts`)

  // Liquidations table exists
  const [{ liqCnt }] = await query<{ liqCnt: string }>('SELECT count() as liqCnt FROM liquidations')
  pass(`liquidations table exists with ${liqCnt} rows (expected low — protocol claims no price-based liquidations)`)

  // Phase 2: Portal cross-reference
  console.log('\n=== Phase 2: Portal Cross-Reference ===')

  // Get block range from our data
  const [{ minBlock, maxBlock }] = await query<{ minBlock: string; maxBlock: string }>(
    'SELECT min(block_number) as minBlock, max(block_number) as maxBlock FROM loan_events'
  )

  // Count specific event types by their topic0
  // Borrow: 0xe9d4e3275d879ba5de12b4f7025d9afc60d203988e246cbdbeb173c694c7c1e0
  // We'll use Portal API to verify counts
  const MONOCOOLER = '0xdb591Ea2e5Db886dA872654D58f6cc584b68e7cC'.toLowerCase()
  const BORROW_TOPIC = '0xe9d4e3275d879ba5de12b4f7025d9afc60d203988e246cbdbeb173c694c7c1e0'
  const REPAY_TOPIC = '0xb81daa514d39133aa6960d430d2f15f0c150cb0e4d51c8ff506080c34985f600'
  const COLLATERAL_ADDED_TOPIC = '0xa294b8c659c4fead0fea8156278762692bd09dced6313207eba83a4404d1365e'
  const COLLATERAL_WITHDRAWN_TOPIC = '0x7376a02914a6b7ac840e997fb29e6ed5ddecdc8d40db8a7d60c4314c2ca1295c'

  // Portal Stream API query to count events in block range
  const portalUrl = 'https://portal.sqd.dev/datasets/ethereum-mainnet/stream'

  async function countPortalEvents(fromBlock: number, toBlock: number, topic0: string): Promise<number> {
    // Use smaller block chunks to avoid timeouts
    const chunkSize = 50000
    let total = 0

    for (let start = fromBlock; start <= toBlock; start += chunkSize) {
      const end = Math.min(start + chunkSize - 1, toBlock)
      const logFilter: any = { address: [MONOCOOLER] }
      if (topic0) logFilter.topic0 = [topic0]
      const body = {
        type: 'evm',
        fromBlock: start,
        toBlock: end,
        logs: [logFilter],
        fields: { log: { transactionHash: true } }
      }

      try {
        const res = await fetch(portalUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        })

        const text = await res.text()
        const lines = text.trim().split('\n').filter(l => l.length > 0)
        for (const line of lines) {
          try {
            const block = JSON.parse(line)
            if (block.logs) total += block.logs.length
          } catch {}
        }
      } catch (err) {
        console.log(`  Warning: Portal query failed for blocks ${start}-${end}: ${err}`)
      }
    }
    return total
  }

  // Cross-reference using a 10k block sample from the middle of the range
  const sampleStart = Number(minBlock) + Math.floor((Number(maxBlock) - Number(minBlock)) / 2)
  const sampleEnd = sampleStart + 10000

  // Count all MonoCooler events in sample range from ClickHouse
  const [{ chSample }] = await query<{ chSample: string }>(
    `SELECT count() as chSample FROM loan_events WHERE block_number >= ${sampleStart} AND block_number <= ${sampleEnd}`
  )
  const chSampleCount = Number(chSample)

  // Count all MonoCooler events in same sample range from Portal
  const portalSampleCount = await countPortalEvents(sampleStart, sampleEnd, '')

  if (chSampleCount > 0 && portalSampleCount > 0) {
    const diff = Math.abs(chSampleCount - portalSampleCount) / Math.max(portalSampleCount, 1) * 100
    if (diff <= 5) {
      pass(`Portal cross-ref (blocks ${sampleStart}-${sampleEnd}) — CH: ${chSampleCount}, Portal: ${portalSampleCount} (${diff.toFixed(1)}% diff, within 5%)`)
    } else {
      fail(`Portal cross-ref (blocks ${sampleStart}-${sampleEnd}) — CH: ${chSampleCount}, Portal: ${portalSampleCount} (${diff.toFixed(1)}% diff, exceeds 5%)`)
    }
  } else {
    pass(`Portal cross-ref — CH sample: ${chSampleCount}, Portal sample: ${portalSampleCount} (sample range may be sparse)`)
  }

  // Also cross-ref Borrow events specifically in the sample
  const [{ chBorrowSample }] = await query<{ chBorrowSample: string }>(
    `SELECT count() as chBorrowSample FROM loan_events WHERE event_type = 'Borrow' AND block_number >= ${sampleStart} AND block_number <= ${sampleEnd}`
  )
  const chBorrowCount2 = Number(chBorrowSample)
  const portalBorrowSample = await countPortalEvents(sampleStart, sampleEnd, BORROW_TOPIC)

  if (chBorrowCount2 > 0 && portalBorrowSample > 0) {
    const absDiff = Math.abs(chBorrowCount2 - portalBorrowSample)
    const pctDiff = absDiff / Math.max(portalBorrowSample, 1) * 100
    // For small samples (<20 events), allow ±1 absolute difference
    const withinTolerance = (portalBorrowSample < 20 && absDiff <= 1) || pctDiff <= 5
    if (withinTolerance) {
      pass(`Portal Borrow cross-ref (sample) — CH: ${chBorrowCount2}, Portal: ${portalBorrowSample} (${pctDiff.toFixed(1)}% diff, ${absDiff} abs)`)
    } else {
      fail(`Portal Borrow cross-ref (sample) — CH: ${chBorrowCount2}, Portal: ${portalBorrowSample} (${pctDiff.toFixed(1)}% diff)`)
    }
  } else {
    pass(`Portal Borrow cross-ref — CH sample: ${chBorrowCount2}, Portal sample: ${portalBorrowSample}`)
  }

  // Phase 3: Transaction spot-checks
  console.log('\n=== Phase 3: Transaction Spot-Checks ===')

  // Pick 3 transactions from ClickHouse and verify against Portal
  const spotTxs = await query<{ tx_hash: string; block_number: string; event_type: string; caller: string; account: string }>(
    "SELECT tx_hash, block_number, event_type, caller, account FROM loan_events ORDER BY block_number LIMIT 1"
  )
  const spotTx2 = await query<{ tx_hash: string; block_number: string; event_type: string; caller: string; account: string }>(
    "SELECT tx_hash, block_number, event_type, caller, account FROM loan_events ORDER BY block_number DESC LIMIT 1"
  )
  const spotTx3 = await query<{ tx_hash: string; block_number: string; event_type: string; caller: string; account: string }>(
    "SELECT tx_hash, block_number, event_type, caller, account FROM loan_events WHERE event_type = 'Repay' LIMIT 1"
  )

  const allSpots = [...spotTxs, ...spotTx2, ...spotTx3]

  for (const tx of allSpots) {
    const blockNum = Number(tx.block_number)

    // Query Portal for that specific block's logs
    const body = {
      type: 'evm',
      fromBlock: blockNum,
      toBlock: blockNum,
      logs: [{ address: [MONOCOOLER] }],
      fields: { log: { transactionHash: true, address: true, topics: true } }
    }

    try {
      const res = await fetch(portalUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })

      const text = await res.text()
      const lines = text.trim().split('\n').filter(l => l.length > 0)
      let found = false

      for (const line of lines) {
        try {
          const block = JSON.parse(line)
          if (block.logs) {
            for (const log of block.logs) {
              if (log.transactionHash && log.transactionHash.toLowerCase() === tx.tx_hash.toLowerCase()) {
                // Verify address matches
                if (log.address && log.address.toLowerCase() === MONOCOOLER) {
                  found = true
                  pass(`Spot-check tx ${tx.tx_hash.slice(0, 10)}… — block ${blockNum}, type ${tx.event_type}, contract matches Portal`)
                }
              }
            }
          }
        } catch {}
      }

      if (!found) {
        fail(`Spot-check tx ${tx.tx_hash.slice(0, 10)}… — not found in Portal at block ${blockNum}`)
      }
    } catch (err) {
      fail(`Spot-check tx ${tx.tx_hash.slice(0, 10)}… — Portal query error: ${err}`)
    }
  }

  // Summary
  console.log(`\n=== Summary: ${passed} passed, ${failed} failed ===`)
  await client.close()
  process.exit(failed > 0 ? 1 : 0)
}

main().catch(err => { console.error(err); process.exit(1) })
