import 'dotenv/config'
import path from 'node:path'
import { createClient } from '@clickhouse/client'
import { event, indexed } from '@subsquid/evm-abi'
import * as p from '@subsquid/evm-codec'
import { evmDecoder, evmPortalStream } from '@subsquid/pipes/evm'
import { clickhouseTarget } from '@subsquid/pipes/targets/clickhouse'
import { enrichEvents, serializeJsonWithBigInt } from './utils/index.js'

// New BOLD token (post-redeployment)
const BOLD = '0x6440f144b7e50d6a8439336510312d2f54beb01d'
const ZERO = '0x0000000000000000000000000000000000000000'

const Transfer = event(
  '0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef',
  'Transfer(address,address,uint256)',
  { from: indexed(p.address), to: indexed(p.address), value: p.uint256 },
)

// 90-day lookback
const LOOKBACK_DAYS = 90
const startDate = new Date(Date.now() - LOOKBACK_DAYS * 86_400_000)

const env = {
  CLICKHOUSE_USER: process.env.CLICKHOUSE_USER!,
  CLICKHOUSE_PASSWORD: process.env.CLICKHOUSE_PASSWORD!,
  CLICKHOUSE_URL: process.env.CLICKHOUSE_URL!,
  CLICKHOUSE_DATABASE: process.env.CLICKHOUSE_DATABASE!,
}

function classifyTransfer(from: string, to: string): string {
  if (from === ZERO) return 'borrow'   // mint = new BOLD issued = borrowing
  if (to === ZERO) return 'repay'      // burn = BOLD destroyed = repaying
  return 'transfer'
}

const decoder = evmDecoder({
  range: { from: startDate },
  contracts: [BOLD],
  events: { Transfer },
}).pipe(enrichEvents)

export async function main() {
  await evmPortalStream({
    id: 'liquity-v2-bold-pulse',
    portal: 'https://portal.sqd.dev/datasets/ethereum-mainnet',
    outputs: { decoder },
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
        for (const e of data.decoder.Transfer) {
          const from = e.from.toLowerCase()
          const to = e.to.toLowerCase()
          rows.push({
            event_type: classifyTransfer(from, to),
            from_addr: from,
            to_addr: to,
            amount: String(e.value),
            amount_bold: Number(e.value) / 1e18,
            block_number: e.blockNumber,
            tx_hash: e.txHash,
            log_index: e.logIndex,
            timestamp: new Date(e.timestamp * 1000).toISOString(),
          })
        }
        if (rows.length > 0) {
          await store.insert({ table: 'bold_events', values: rows, format: 'JSONEachRow' })
        }
      },
      onRollback: async ({ safeCursor, store }) => {
        await store.removeAllRows({
          tables: ['bold_events'],
          where: 'block_number > {latest:UInt32}',
          params: { latest: safeCursor.number },
        })
      },
    }),
  )
}

void main()
