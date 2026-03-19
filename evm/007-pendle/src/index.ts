import 'dotenv/config'
import path from 'node:path'
import { createClient } from '@clickhouse/client'
import { evmDecoder, evmPortalSource } from '@subsquid/pipes/evm'
import { clickhouseTarget } from '@subsquid/pipes/targets/clickhouse'
import { z } from 'zod'
import { events as routerEvents } from './contracts/0x888888888889758F76e7103c6CbF23ABbF58F946.js'
import { serializeJsonWithBigInt } from './utils/index.js'

const env = z
  .object({
    CLICKHOUSE_USER: z.string(),
    CLICKHOUSE_PASSWORD: z.string(),
    CLICKHOUSE_URL: z.string(),
    CLICKHOUSE_DATABASE: z.string(),
  })
  .parse(process.env)

// Pendle Router V4 on Ethereum — tracks all yield swap types
const swaps = evmDecoder({
  // Router deployed late 2023, V4 events start ~block 18800000
  range: { from: '18800000' },
  contracts: ['0x888888888889758F76e7103c6CbF23ABbF58F946'],
  events: {
    swapPtToken: routerEvents.SwapPtAndToken,
    swapYtSy: routerEvents.SwapYtAndSy,
    swapPtSy: routerEvents.SwapPtAndSy,
  },
}).pipe(({ swapPtToken, swapYtSy, swapPtSy }) => {
  const rows = [
    ...swapPtToken.map((d) => ({
      swap_type: 'PT↔Token',
      caller: d.event.caller_,
      market: d.event.market_,
      asset: d.event.token_,
      receiver: d.event.receiver_,
      block_number: d.block.number,
      tx_hash: d.rawEvent.transactionHash,
      log_index: d.rawEvent.logIndex,
      timestamp: Math.floor(new Date(d.timestamp).getTime() / 1000),
      sign: 1,
    })),
    ...swapYtSy.map((d) => ({
      swap_type: 'YT↔SY',
      caller: d.event.caller_,
      market: d.event.market_,
      asset: d.event.yt_,
      receiver: d.event.receiver_,
      block_number: d.block.number,
      tx_hash: d.rawEvent.transactionHash,
      log_index: d.rawEvent.logIndex,
      timestamp: Math.floor(new Date(d.timestamp).getTime() / 1000),
      sign: 1,
    })),
    ...swapPtSy.map((d) => ({
      swap_type: 'PT↔SY',
      caller: d.event.caller_,
      market: d.event.market_,
      asset: d.event.market_,
      receiver: d.event.receiver_,
      block_number: d.block.number,
      tx_hash: d.rawEvent.transactionHash,
      log_index: d.rawEvent.logIndex,
      timestamp: Math.floor(new Date(d.timestamp).getTime() / 1000),
      sign: 1,
    })),
  ]
  return { swaps: rows }
})

export async function main() {
  await evmPortalSource({
    portal: 'https://portal.sqd.dev/datasets/ethereum-mainnet',
  })
    .pipeComposite({ swaps })
    .pipeTo(
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
          const migrationsDir = path.join(process.cwd(), 'migrations')
          await store.executeFiles(migrationsDir)
        },
        onData: async ({ data, store }) => {
          if (data.swaps.swaps.length > 0) {
            await store.insert({
              table: 'pendle_swaps',
              values: data.swaps.swaps,
              format: 'JSONEachRow',
            })
          }
        },
        onRollback: async ({ safeCursor, store }) => {
          await store.removeAllRows({
            tables: ['pendle_swaps'],
            where: 'block_number > {latest:UInt32}',
            params: { latest: safeCursor.number },
          })
        },
      }),
    )
}

void main()
