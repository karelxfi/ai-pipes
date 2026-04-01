import 'dotenv/config'
import path from 'node:path'
import { createClient } from '@clickhouse/client'
import { event, indexed } from '@subsquid/evm-abi'
import * as p from '@subsquid/evm-codec'
import { evmDecoder, evmPortalStream } from '@subsquid/pipes/evm'
import { clickhouseTarget } from '@subsquid/pipes/targets/clickhouse'
import { events as boosterEvents } from './contracts/AuraBooster.js'
import { enrichEvents, serializeJsonWithBigInt } from './utils/index.js'

const AURA = '0xc0c293ce456ff0ed870add98a0828dd4d2903dbf'
const AURABAL = '0x616e8bfa43f920657b3497dbf40d6b1a02d4608d'
const BOOSTER = '0xa57b8d98dae62b26ec3bcc4a365338157060b234'
const ZERO = '0x0000000000000000000000000000000000000000'

const TOKEN_LABELS: Record<string, string> = {
  [AURA]: 'AURA',
  [AURABAL]: 'auraBAL',
  [BOOSTER]: 'Booster',
}

const Transfer = event(
  '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
  'Transfer(address,address,uint256)',
  { from: indexed(p.address), to: indexed(p.address), value: p.uint256 },
)

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
  contracts: [AURA, AURABAL],
  events: { Transfer },
}).pipe(enrichEvents)

const boosterDecoder = evmDecoder({
  range: { from: startDate },
  contracts: [BOOSTER],
  events: {
    Deposited: boosterEvents.Deposited,
    Withdrawn: boosterEvents.Withdrawn,
  },
}).pipe(enrichEvents)

export async function main() {
  await evmPortalStream({
    id: 'aura-yield-pulse',
    portal: 'https://portal.sqd.dev/datasets/ethereum-mainnet',
    outputs: { tokenDecoder, boosterDecoder },
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

        for (const e of data.tokenDecoder.Transfer) {
          const from = e.from.toLowerCase()
          const to = e.to.toLowerCase()
          rows.push({
            source: TOKEN_LABELS[e.contract.toLowerCase()] ?? 'UNKNOWN',
            event_type: classifyTransfer(from, to),
            from_addr: from,
            to_addr: to,
            user_addr: '',
            amount: String(e.value),
            amount_dec: Number(e.value) / 1e18,
            block_number: e.blockNumber,
            tx_hash: e.txHash,
            log_index: e.logIndex,
            timestamp: new Date(e.timestamp * 1000).toISOString(),
          })
        }

        for (const e of data.boosterDecoder.Deposited) {
          rows.push({
            source: 'Booster',
            event_type: 'deposit',
            from_addr: '',
            to_addr: '',
            user_addr: e.user.toLowerCase(),
            pool_id: Number(e.poolid),
            amount: String(e.amount),
            amount_dec: Number(e.amount) / 1e18,
            block_number: e.blockNumber,
            tx_hash: e.txHash,
            log_index: e.logIndex,
            timestamp: new Date(e.timestamp * 1000).toISOString(),
          })
        }

        for (const e of data.boosterDecoder.Withdrawn) {
          rows.push({
            source: 'Booster',
            event_type: 'withdraw',
            from_addr: '',
            to_addr: '',
            user_addr: e.user.toLowerCase(),
            pool_id: Number(e.poolid),
            amount: String(e.amount),
            amount_dec: Number(e.amount) / 1e18,
            block_number: e.blockNumber,
            tx_hash: e.txHash,
            log_index: e.logIndex,
            timestamp: new Date(e.timestamp * 1000).toISOString(),
          })
        }

        if (rows.length > 0) {
          await store.insert({ table: 'aura_events', values: rows, format: 'JSONEachRow' })
        }
      },
      onRollback: async ({ safeCursor, store }) => {
        await store.removeAllRows({
          tables: ['aura_events'],
          where: 'block_number > {latest:UInt32}',
          params: { latest: safeCursor.number },
        })
      },
    }),
  )
}

void main()
