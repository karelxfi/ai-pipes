import 'dotenv/config'
import path from 'node:path'
import { createClient } from '@clickhouse/client'
import { event, indexed } from '@subsquid/evm-abi'
import * as p from '@subsquid/evm-codec'
import { evmDecoder, evmPortalStream } from '@subsquid/pipes/evm'
import { clickhouseTarget } from '@subsquid/pipes/targets/clickhouse'
import { events as vesdtEvents } from './contracts/veSDT.js'
import { enrichEvents, serializeJsonWithBigInt } from './utils/index.js'

// Stake DAO core tokens on Ethereum
const SDCRV = '0xd1b5651e55d4ceed36251c61c50c889b36f6abb5'
const SDT = '0x73968b9a57c6e53d41345fd57a6e6ae27d6cdb2f'
const VESDT_PROXY = '0x0c30476f66034e11782938df8e4384970b6c9e8a'

const ZERO = '0x0000000000000000000000000000000000000000'

const TOKEN_LABELS: Record<string, string> = {
  [SDCRV]: 'sdCRV',
  [SDT]: 'SDT',
  [VESDT_PROXY]: 'veSDT',
}

// Standard ERC20 Transfer
const Transfer = event(
  '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
  'Transfer(address,address,uint256)',
  { from: indexed(p.address), to: indexed(p.address), value: p.uint256 },
)

// 90-day lookback for rare events on Ethereum (fast blocks vs BSC)
const LOOKBACK_DAYS = 90
const startDate = new Date(Date.now() - LOOKBACK_DAYS * 86_400_000)

const env = {
  CLICKHOUSE_USER: process.env.CLICKHOUSE_USER!,
  CLICKHOUSE_PASSWORD: process.env.CLICKHOUSE_PASSWORD!,
  CLICKHOUSE_URL: process.env.CLICKHOUSE_URL!,
  CLICKHOUSE_DATABASE: process.env.CLICKHOUSE_DATABASE!,
}

function classifyTransfer(from: string, to: string): string {
  if (from === ZERO) return 'mint'
  if (to === ZERO) return 'burn'
  return 'transfer'
}

const tokenDecoder = evmDecoder({
  range: { from: startDate },
  contracts: [SDCRV, SDT],
  events: { Transfer },
}).pipe(enrichEvents)

const vesdtDecoder = evmDecoder({
  range: { from: startDate },
  contracts: [VESDT_PROXY],
  events: {
    Deposit: vesdtEvents.Deposit,
    Withdraw: vesdtEvents.Withdraw,
    Supply: vesdtEvents.Supply,
  },
}).pipe(enrichEvents)

export async function main() {
  await evmPortalStream({
    id: 'stake-dao-governance-pulse',
    portal: 'https://portal.sqd.dev/datasets/ethereum-mainnet',
    outputs: { tokenDecoder, vesdtDecoder },
  }).pipeTo(
    clickhouseTarget({
      client: createClient({
        username: env.CLICKHOUSE_USER,
        password: env.CLICKHOUSE_PASSWORD,
        url: env.CLICKHOUSE_URL,
        database: env.CLICKHOUSE_DATABASE,
        json: { stringify: serializeJsonWithBigInt },
        clickhouse_settings: {
          date_time_input_format: 'best_effort',
          date_time_output_format: 'iso',
          output_format_json_named_tuples_as_objects: 1,
          output_format_json_quote_64bit_floats: 1,
          output_format_json_quote_64bit_integers: 1,
        },
      }),
      onStart: async ({ store }) => {
        await store.executeFiles(path.join(process.cwd(), 'migrations'))
      },
      onData: async ({ data, store }) => {
        const rows: any[] = []

        // Token transfers (sdCRV + SDT)
        for (const e of data.tokenDecoder.Transfer) {
          const from = e.from.toLowerCase()
          const to = e.to.toLowerCase()
          rows.push({
            event_type: classifyTransfer(from, to),
            token: TOKEN_LABELS[e.contract.toLowerCase()] ?? 'UNKNOWN',
            from_addr: from,
            to_addr: to,
            provider: '',
            amount: String(e.value),
            amount_dec: Number(e.value) / 1e18,
            block_number: e.blockNumber,
            tx_hash: e.txHash,
            log_index: e.logIndex,
            timestamp: new Date(e.timestamp * 1000).toISOString(),
          })
        }

        // veSDT Deposit
        for (const e of data.vesdtDecoder.Deposit) {
          rows.push({
            event_type: 'lock',
            token: 'veSDT',
            from_addr: '',
            to_addr: '',
            provider: e.provider.toLowerCase(),
            amount: String(e.value),
            amount_dec: Number(e.value) / 1e18,
            locktime: Number(e.locktime),
            lock_type: Number(e.type),
            block_number: e.blockNumber,
            tx_hash: e.txHash,
            log_index: e.logIndex,
            timestamp: new Date(e.timestamp * 1000).toISOString(),
          })
        }

        // veSDT Withdraw
        for (const e of data.vesdtDecoder.Withdraw) {
          rows.push({
            event_type: 'unlock',
            token: 'veSDT',
            from_addr: '',
            to_addr: '',
            provider: e.provider.toLowerCase(),
            amount: String(e.value),
            amount_dec: Number(e.value) / 1e18,
            block_number: e.blockNumber,
            tx_hash: e.txHash,
            log_index: e.logIndex,
            timestamp: new Date(e.timestamp * 1000).toISOString(),
          })
        }

        // veSDT Supply changes
        for (const e of data.vesdtDecoder.Supply) {
          rows.push({
            event_type: 'supply_change',
            token: 'veSDT',
            from_addr: '',
            to_addr: '',
            provider: '',
            amount: '0',
            amount_dec: 0,
            prev_supply: String(e.prevSupply),
            new_supply: String(e.supply),
            block_number: e.blockNumber,
            tx_hash: e.txHash,
            log_index: e.logIndex,
            timestamp: new Date(e.timestamp * 1000).toISOString(),
          })
        }

        if (rows.length > 0) {
          await store.insert({ table: 'stake_dao_events', values: rows, format: 'JSONEachRow' })
        }
      },
      onRollback: async ({ safeCursor, store }) => {
        await store.removeAllRows({
          tables: ['stake_dao_events'],
          where: 'block_number > {latest:UInt32}',
          params: { latest: safeCursor.number },
        })
      },
    }),
  )
}

void main()
