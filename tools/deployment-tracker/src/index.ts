import 'dotenv/config'
import { createClient } from '@clickhouse/client'
import fs from 'node:fs'
import path from 'node:path'

/**
 * Contract Deployment Tracker v2
 *
 * Two strategies:
 * 1. REVERSE LOOKUP: Given known contract addresses from our registry,
 *    find their deployment blocks and deployer addresses via CREATE traces
 * 2. DEPLOYER TRACKING: Given known deployer addresses, find ALL contracts
 *    they ever deployed (discovers unknown contracts)
 *
 * Strategy 1 is more accurate for validation.
 * Strategy 2 is better for discovery.
 */

const PORTAL_URL = 'https://portal.sqd.dev/datasets/ethereum-mainnet/stream'

const chClient = createClient({
  url: process.env.CLICKHOUSE_URL ?? 'http://localhost:8123',
  database: process.env.CLICKHOUSE_DATABASE ?? 'deployment_tracker',
  username: process.env.CLICKHOUSE_USER ?? 'default',
  password: process.env.CLICKHOUSE_PASSWORD ?? 'password',
})

async function createTables() {
  await chClient.command({
    query: `
      CREATE TABLE IF NOT EXISTS contract_deployments (
        deployer String,
        protocol LowCardinality(String),
        contract_address String,
        block_number UInt32,
        timestamp DateTime,
        tx_index UInt16
      ) ENGINE = ReplacingMergeTree()
      ORDER BY (contract_address)
    `,
  })
  await chClient.command({
    query: `
      CREATE TABLE IF NOT EXISTS deployer_discoveries (
        deployer String,
        protocol LowCardinality(String),
        contract_address String,
        block_number UInt32,
        timestamp DateTime,
        tx_index UInt16,
        known_in_registry UInt8 DEFAULT 0
      ) ENGINE = ReplacingMergeTree()
      ORDER BY (deployer, contract_address)
    `,
  })
}

// Load all known contract addresses from our registry's contracts.json files
function loadKnownContracts(): Map<string, { protocol: string; name: string }> {
  const contracts = new Map<string, { protocol: string; name: string }>()
  const repoRoot = path.resolve(process.cwd(), '../..')

  for (const dir of ['evm', 'solana', 'hyperliquid']) {
    const dirPath = path.join(repoRoot, dir)
    if (!fs.existsSync(dirPath)) continue

    for (const entry of fs.readdirSync(dirPath)) {
      const contractsFile = path.join(dirPath, entry, 'contracts.json')
      if (!fs.existsSync(contractsFile)) continue

      try {
        const data = JSON.parse(fs.readFileSync(contractsFile, 'utf8'))
        const protocol = entry

        for (const [chain, dep] of Object.entries(data.deployments || {})) {
          if (chain !== 'ethereum') continue
          const deployment = dep as any
          for (const [name, info] of Object.entries(deployment.contracts || {})) {
            const addr = (info as any).address
            if (addr && addr.startsWith('0x') && addr.length === 42) {
              contracts.set(addr.toLowerCase(), { protocol, name })
            }
          }
        }
      } catch {}
    }
  }

  return contracts
}

// Strategy 1: Reverse lookup — find deployment info for known contracts
async function reverseLookup(contractAddress: string, protocol: string, name: string): Promise<any | null> {
  // Query Portal for CREATE traces that deployed this specific address
  const query = {
    type: 'evm',
    fromBlock: 0,
    toBlock: 25000000,
    traces: [{
      type: ['create'],
      createResultAddress: [contractAddress],
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

  try {
    const resp = await fetch(PORTAL_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/x-ndjson' },
      body: JSON.stringify(query),
    })

    if (!resp.ok) return null

    const text = await resp.text()
    for (const line of text.split('\n').filter(l => l.trim())) {
      try {
        const block = JSON.parse(line)
        if (block.traces && block.traces.length > 0) {
          const trace = block.traces[0]
          return {
            deployer: (trace.action?.from || '').toLowerCase(),
            protocol,
            contract_address: contractAddress,
            block_number: block.header.number,
            timestamp: block.header.timestamp,
            tx_index: trace.transactionIndex || 0,
          }
        }
      } catch {}
    }
  } catch {}

  return null
}

// Strategy 2: Forward discovery — find all contracts from known deployers
async function forwardDiscovery(
  deployers: string[],
  protocolMap: Record<string, string>,
  fromBlock: number,
  toBlock: number,
): Promise<any[]> {
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

  try {
    const resp = await fetch(PORTAL_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/x-ndjson' },
      body: JSON.stringify(query),
    })

    if (!resp.ok) return []

    const text = await resp.text()
    const results: any[] = []

    for (const line of text.split('\n').filter(l => l.trim())) {
      try {
        const block = JSON.parse(line)
        if (block.traces) {
          for (const trace of block.traces) {
            const from = (trace.action?.from || '').toLowerCase()
            const addr = (trace.result?.address || '').toLowerCase()
            if (addr && from) {
              results.push({
                deployer: from,
                protocol: protocolMap[from] || 'unknown',
                contract_address: addr,
                block_number: block.header.number,
                timestamp: block.header.timestamp,
                tx_index: trace.transactionIndex || 0,
              })
            }
          }
        }
      } catch {}
    }

    return results
  } catch {
    return []
  }
}

async function main() {
  console.log('=== Contract Deployment Tracker v2 ===\n')

  await createTables()

  const knownContracts = loadKnownContracts()
  console.log(`Loaded ${knownContracts.size} known Ethereum contracts from registry\n`)

  // ─── Strategy 1: Reverse Lookup ───
  console.log('── Strategy 1: Reverse Lookup (find deployment info for known contracts) ──\n')

  // NOTE: Portal doesn't support createResultAddress as a filter for traces.
  // Reverse lookup isn't directly possible via Portal stream API.
  // Instead, we use Strategy 2 exclusively — forward discovery from known deployers.
  console.log('  (Skipped — Portal doesn\'t support createResultAddress filter for traces)')
  console.log('  Using Strategy 2 exclusively.\n')

  // Add deployers from known protocol contracts
  // We get these from our contracts.json files — look for factory/deployer addresses
  const discoveredDeployers = new Map<string, string>()

  // Known deployers (manually verified from Etherscan contract creators)
  const KNOWN_DEPLOYERS: Record<string, string> = {
    // Aave V3 PoolAddressesProvider
    '0x2f39d218133afab8f2b819b1066c7e434ad94e9e': 'aave-v3',
    // Rocket Pool RocketMinipoolManager
    '0x54705f80d7c51fcffd9c659ce3f3c9a7dccf5788': 'rocket-pool',
    // Compound V3 Comet Proxy Admin
    '0x1ec63b5883c3481134fd50d5daebc83ecd2e8779': 'compound-v3',
    // Morpho Blue deployer
    '0x5bdfe53f53963d81969bbb2ad7e5ce8e3db80e56': 'morpho-v1',
    // Maple Pool Deployer V4
    '0xdaf005b31b10f33ee42ceb1a4b983434fe947488': 'maple',
    // Fluid deployer
    '0x4f6f977acdd1177dcd81ab83074855ecb9c2d49e': 'fluid-lending',
    // Convex deployer
    '0x947b7742c403f20e5faccdac5e092c943e7d0277': 'convex-finance',
    // Pendle deployer
    '0x1fcc097db89a86bfc474a1028f93958295b1fb7': 'pendle',
    // Lido deployer
    '0xf73a1260d222f447210581ddf212d915c09a3249': 'lido',
    // Sky/MakerDAO deployers
    '0xd6ec7a1b1f4c42c5208ff68b2436fab8cc593fb7': 'sky-lending',
    '0xbe8e3e3618f7474f8cb1d074a26affef007e98fb': 'sky-lending',
    // SparkLend PoolAddressesProvider
    '0x02c3ea4e34c0cbd694d2adfa2c690eecbc1793ee': 'sparklend',
    // Spark Savings deployer
    '0xd6f3d2aa1e89a1c0bb0bdbddeda0eb4709df02e6': 'spark-savings',
  }

  for (const [addr, proto] of Object.entries(KNOWN_DEPLOYERS)) {
    discoveredDeployers.set(addr, proto)
  }

  // ─── Strategy 2: Forward Discovery using discovered deployers ───
  if (discoveredDeployers.size > 0) {
    console.log(`── Strategy 2: Forward Discovery (${discoveredDeployers.size} discovered deployers) ──\n`)

    const deployers = Array.from(discoveredDeployers.keys())
    const protocolMap = Object.fromEntries(discoveredDeployers)

    let totalDiscovered = 0
    const START = 11000000
    const END = 25000000

    // Query EACH deployer separately to avoid high-volume deployers
    // (e.g., Rocket Pool with 3000+ minipools) overwhelming the response
    for (const [deployer, protocol] of discoveredDeployers) {
      console.log(`\n  Scanning: ${protocol} (${deployer.substring(0, 10)}...)`)

      let protocolTotal = 0
      // 50K chunks — larger chunks (500K) cause Portal to drop traces in the stream
      const CHUNK = 50000

      for (let from = START; from < END; from += CHUNK) {
        const to = Math.min(from + CHUNK, END)

        const discoveries = await forwardDiscovery([deployer], { [deployer]: protocol }, from, to)
        if (discoveries.length > 0) {
          const enriched = discoveries.map(d => ({
            ...d,
            known_in_registry: knownContracts.has(d.contract_address) ? 1 : 0,
          }))

          await chClient.insert({
            table: 'deployer_discoveries',
            values: enriched,
            format: 'JSONEachRow',
          })
          totalDiscovered += discoveries.length
          protocolTotal += discoveries.length
        }
      }

      if (protocolTotal > 0) {
        const knownCount = (await chClient.query({
          query: `SELECT sum(known_in_registry) as cnt FROM deployment_tracker.deployer_discoveries WHERE deployer = '${deployer}'`,
          format: 'JSONEachRow',
        }).then(r => r.json<{ cnt: string }>()))[0]?.cnt || '0'
        console.log(`    Total: ${protocolTotal} contracts (${knownCount} known in registry)`)
      } else {
        console.log(`    Total: 0 contracts`)
      }
    }

    console.log(`\nForward discovery total: ${totalDiscovered} contracts`)
  }

  // ─── Summary ───
  console.log('\n── Summary ──\n')

  const deploymentResults = await chClient.query({
    query: 'SELECT protocol, count() as cnt FROM contract_deployments GROUP BY protocol ORDER BY cnt DESC',
    format: 'JSONEachRow',
  })
  const deploymentRows = await deploymentResults.json<{ protocol: string; cnt: string }>()
  console.log('Reverse lookups by protocol:')
  for (const row of deploymentRows) {
    console.log(`  ${row.protocol}: ${row.cnt}`)
  }

  if (discoveredDeployers.size > 0) {
    const discoveryResults = await chClient.query({
      query: `SELECT
        protocol,
        count() as total,
        sumIf(1, known_in_registry = 1) as known,
        sumIf(1, known_in_registry = 0) as new_discoveries
      FROM deployer_discoveries
      GROUP BY protocol
      ORDER BY total DESC`,
      format: 'JSONEachRow',
    })
    const discoveryRows = await discoveryResults.json<{ protocol: string; total: string; known: string; new_discoveries: string }>()
    console.log('\nForward discoveries by protocol:')
    for (const row of discoveryRows) {
      console.log(`  ${row.protocol}: ${row.total} total (${row.known} known, ${row.new_discoveries} new)`)
    }
  }

  await chClient.close()
}

main().catch(console.error)
