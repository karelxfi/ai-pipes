import 'dotenv/config'
import { createClient } from '@clickhouse/client'

/**
 * Contract Deployment Tracker
 *
 * Queries SQD Portal for CREATE traces from known protocol deployer addresses,
 * then stores discovered deployments in ClickHouse.
 *
 * This feeds back into the contracts-registry by discovering new deployments.
 */

const PORTAL_URL = 'https://portal.sqd.dev/datasets/ethereum-mainnet/stream'

// Known deployer addresses → protocol mapping
// These are addresses that deploy contracts for DeFi protocols we track
const DEPLOYERS: Record<string, string> = {
  // Aave V3 - PoolAddressesProvider deploys pool contracts
  '0x2f39d218133afab8f2b819b1066c7e434ad94e9e': 'aave-v3',
  // Sky/MakerDAO deployers
  '0xd6ec7a1b1f4c42c5208ff68b2436fab8cc593fb7': 'sky-lending',
  '0xbe8e3e3618f7474f8cb1d074a26affef007e98fb': 'sky-lending',
  // Rocket Pool minipool manager
  '0x54705f80d7c51fcffd9c659ce3f3c9a7dccf5788': 'rocket-pool',
  // Compound V3 Comet Factory
  '0xa7f7de6ccad4d83d7f21a2604032ebc0dd1e1e5b': 'compound-v3',
  // Morpho deployer
  '0x9c1fc418e04ab7e12a4587bca3e27e6fc62b63bd': 'morpho-v1',
  // Maple deployer
  '0x1fcc097db89a86bfc474a1028f93958295b1fb7': 'maple',
  // Fluid/Instadapp deployer
  '0x4f6f977acdd1177dcd81ab83074855ecb9c2d49e': 'fluid-lending',
  // Euler V2 factory
  '0xcafea41ff4a2eb4e600afe2ab8e3dd3e78d51e52': 'euler-v2',
  // Pendle factories
  '0x1fcc097db89a86bfc474a1028f93958295b1fb7': 'pendle',
  // SparkLend
  '0x02c3ea4e34c0cbd694d2adfa2c690eecbc1793ee': 'sparklend',
}

const chClient = createClient({
  url: process.env.CLICKHOUSE_URL ?? 'http://localhost:8123',
  database: process.env.CLICKHOUSE_DATABASE ?? 'deployment_tracker',
  username: process.env.CLICKHOUSE_USER ?? 'default',
  password: process.env.CLICKHOUSE_PASSWORD ?? 'password',
})

async function createTable() {
  await chClient.command({
    query: `
      CREATE TABLE IF NOT EXISTS contract_deployments (
        deployer String,
        protocol LowCardinality(String),
        contract_address String,
        block_number UInt32,
        timestamp DateTime,
        tx_hash String
      ) ENGINE = MergeTree()
      ORDER BY (protocol, block_number)
      PARTITION BY toYYYYMM(timestamp)
    `,
  })
}

async function queryPortal(fromBlock: number, toBlock: number, deployers: string[]): Promise<any[]> {
  const query = {
    type: 'evm',
    fromBlock,
    toBlock,
    traces: [{
      type: ['create'],
      createFrom: deployers,
    }],
    fields: {
      block: { number: true, timestamp: true },
      trace: {
        transactionIndex: true,
        createFrom: true,
        createResultAddress: true,
      },
    },
  }

  const resp = await fetch(PORTAL_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Accept': 'application/x-ndjson' },
    body: JSON.stringify(query),
  })

  if (!resp.ok) {
    const errText = await resp.text()
    throw new Error(`Portal query failed: ${resp.status} ${errText.substring(0, 200)}`)
  }

  const text = await resp.text()
  const results: any[] = []

  for (const line of text.split('\n').filter(l => l.trim())) {
    try {
      const block = JSON.parse(line)
      if (block.traces) {
        for (const trace of block.traces) {
          // Portal returns nested: action.from, result.address
          const from = trace.action?.from || ''
          const addr = trace.result?.address || ''
          if (addr) {
            results.push({
              deployer: from.toLowerCase(),
              protocol: DEPLOYERS[from.toLowerCase()] || 'unknown',
              contract_address: addr.toLowerCase(),
              block_number: block.header.number,
              timestamp: block.header.timestamp,
              tx_hash: `block:${block.header.number}:txIdx:${trace.transactionIndex}`,
            })
          }
        }
      }
    } catch {}
  }

  return results
}

async function main() {
  console.log('=== Contract Deployment Tracker ===\n')
  console.log(`Tracking ${Object.keys(DEPLOYERS).length} deployer addresses`)

  await createTable()

  const deployers = Object.keys(DEPLOYERS)

  // Query in chunks of 100K blocks
  const START_BLOCK = 11000000 // Late 2020
  const END_BLOCK = 24700000 // Current (~Mar 2025)
  const CHUNK_SIZE = 500000

  let totalDeployments = 0

  for (let from = START_BLOCK; from < END_BLOCK; from += CHUNK_SIZE) {
    const to = Math.min(from + CHUNK_SIZE, END_BLOCK)
    process.stdout.write(`Scanning blocks ${from.toLocaleString()} → ${to.toLocaleString()}... `)

    try {
      const deployments = await queryPortal(from, to, deployers)

      if (deployments.length > 0) {
        await chClient.insert({
          table: 'contract_deployments',
          values: deployments,
          format: 'JSONEachRow',
        })
        totalDeployments += deployments.length
        console.log(`${deployments.length} deployments found (total: ${totalDeployments})`)
      } else {
        console.log('0')
      }
    } catch (e: any) {
      console.log(`ERROR: ${e.message?.substring(0, 100)}`)
    }
  }

  // Print summary
  console.log(`\n=== Summary ===`)
  console.log(`Total deployments found: ${totalDeployments}`)

  const results = await chClient.query({
    query: 'SELECT protocol, count() as cnt FROM contract_deployments GROUP BY protocol ORDER BY cnt DESC',
    format: 'JSONEachRow',
  })
  const rows = await results.json<{ protocol: string; cnt: string }>()
  for (const row of rows) {
    console.log(`  ${row.protocol}: ${row.cnt} contracts deployed`)
  }

  await chClient.close()
}

main().catch(console.error)
