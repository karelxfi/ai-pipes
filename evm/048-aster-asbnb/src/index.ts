import 'dotenv/config'
import path from 'node:path'
import { createClient } from '@clickhouse/client'
import { event, indexed } from '@subsquid/evm-abi'
import * as p from '@subsquid/evm-codec'
import { evmDecoder, evmPortalStream } from '@subsquid/pipes/evm'
import { clickhouseTarget } from '@subsquid/pipes/targets/clickhouse'
import { events as minterEvents } from './contracts/AsBnbMinter.js'
import { enrichEvents, serializeJsonWithBigInt } from './utils/index.js'

// asBNB token (ERC20)
const ASBNB_TOKEN = '0x77734e70b6e88b4d82fe632a168edf6e700912b6'
// asBNB Minter proxy
const ASBNB_MINTER = '0x2f31ab8950c50080e77999fa456372f276952fd8'

const ZERO = '0x0000000000000000000000000000000000000000'

// Known addresses
const LABELS: Record<string, string> = {
  [ASBNB_MINTER]: 'AsBnbMinter',
  '0x128463a60784c4d3f46c23af3f65ed859ba87974': 'Aster:Treasury',
  '0x5412fa9a3b101ca6cf2a6139285baa1157e9ea5a': 'PCS:asBNB/USDT',
  '0x0b4bc295630ab414b7bc7d48d6340e70cc7bfc41': 'Aster:Operator',
  [ZERO]: 'ZERO',
}

// Standard ERC20 Transfer event
const Transfer = event(
  '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
  'Transfer(address,address,uint256)',
  { from: indexed(p.address), to: indexed(p.address), value: p.uint256 },
)

// 30-day lookback — BSC has fast blocks (3s), 90 days takes too long
const LOOKBACK_DAYS = 30
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
  contracts: [ASBNB_TOKEN],
  events: { Transfer },
}).pipe(enrichEvents)

const minterDecoder = evmDecoder({
  range: { from: startDate },
  contracts: [ASBNB_MINTER],
  events: {
    AsBnbMinted: minterEvents.AsBnbMinted,
    AsBnbBurned: minterEvents.AsBnbBurned,
    RewardsCompounded: minterEvents.RewardsCompounded,
  },
}).pipe(enrichEvents)

export async function main() {
  await evmPortalStream({
    id: 'aster-asbnb-pulse',
    portal: 'https://portal.sqd.dev/datasets/binance-mainnet',
    outputs: { tokenDecoder, minterDecoder },
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

        // asBNB token transfers
        for (const e of data.tokenDecoder.Transfer) {
          const from = e.from.toLowerCase()
          const to = e.to.toLowerCase()
          rows.push({
            event_type: 'transfer',
            from_addr: from,
            to_addr: to,
            amount: String(e.value),
            amount_bnb: Number(e.value) / 1e18,
            transfer_type: classifyTransfer(from, to),
            source_contract: 'asBNB',
            block_number: e.blockNumber,
            tx_hash: e.txHash,
            log_index: e.logIndex,
            timestamp: new Date(e.timestamp * 1000).toISOString(),
          })
        }

        // Minter events
        for (const e of data.minterDecoder.AsBnbMinted) {
          rows.push({
            event_type: 'minted',
            from_addr: e.user.toLowerCase(),
            to_addr: '',
            amount: String(e.amountOut),
            amount_bnb: Number(e.amountOut) / 1e18,
            transfer_type: 'mint',
            source_contract: 'minter',
            block_number: e.blockNumber,
            tx_hash: e.txHash,
            log_index: e.logIndex,
            timestamp: new Date(e.timestamp * 1000).toISOString(),
          })
        }

        for (const e of data.minterDecoder.AsBnbBurned) {
          rows.push({
            event_type: 'burned',
            from_addr: e.user.toLowerCase(),
            to_addr: '',
            amount: String(e.amountToBurn),
            amount_bnb: Number(e.amountToBurn) / 1e18,
            transfer_type: 'burn',
            source_contract: 'minter',
            block_number: e.blockNumber,
            tx_hash: e.txHash,
            log_index: e.logIndex,
            timestamp: new Date(e.timestamp * 1000).toISOString(),
          })
        }

        for (const e of data.minterDecoder.RewardsCompounded) {
          rows.push({
            event_type: 'compound',
            from_addr: e.sender.toLowerCase(),
            to_addr: '',
            amount: String(e.amountIn),
            amount_bnb: Number(e.amountIn) / 1e18,
            transfer_type: 'compound',
            source_contract: 'minter',
            block_number: e.blockNumber,
            tx_hash: e.txHash,
            log_index: e.logIndex,
            timestamp: new Date(e.timestamp * 1000).toISOString(),
          })
        }

        if (rows.length > 0) {
          await store.insert({ table: 'asbnb_events', values: rows, format: 'JSONEachRow' })
        }
      },
      onRollback: async ({ safeCursor, store }) => {
        await store.removeAllRows({
          tables: ['asbnb_events'],
          where: 'block_number > {latest:UInt32}',
          params: { latest: safeCursor.number },
        })
      },
    }),
  )
}

void main()
