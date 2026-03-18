import 'dotenv/config'
import path from 'node:path'
import { createClient } from '@clickhouse/client'
import { evmDecoder, evmPortalSource } from '@subsquid/pipes/evm'
import { clickhouseTarget } from '@subsquid/pipes/targets/clickhouse'
import { z } from 'zod'
import { events as aaveV3PoolEvents } from './contracts/0x5FAab9E1adbddaD0a08734BE8a52185Fd6558E14.js'
import { enrichEvents, serializeJsonWithBigInt, toSnakeKeysArray } from './utils/index.js'

const env = z
  .object({
    CLICKHOUSE_USER: z.string(),
    CLICKHOUSE_PASSWORD: z.string(),
    CLICKHOUSE_URL: z.string(),
    CLICKHOUSE_DATABASE: z.string(),
  })
  .parse(process.env)

const custom = evmDecoder({
  range: { from: '18000000' },
  contracts: ['0x87870Bca3F3fD6335C3F4ce8392D69350B4fA4E2'],
  /**
   * Or optionally use pass all events object directly to listen to all contract events
   * ```ts
   * events: myContractEvents,
   * ```
   */
  events: {
    LiquidationCall: aaveV3PoolEvents.LiquidationCall,
  },
}).pipe(enrichEvents)

export async function main() {
  await evmPortalSource({
    portal: 'https://portal.sqd.dev/datasets/ethereum-mainnet',
  })
    .pipeComposite({
      custom,
    })
    .pipeTo(
      clickhouseTarget({
        client: createClient({
          username: env.CLICKHOUSE_USER,
          password: env.CLICKHOUSE_PASSWORD,
          url: env.CLICKHOUSE_URL,
          database: env.CLICKHOUSE_DATABASE,
          json: {
            stringify: serializeJsonWithBigInt,
          },
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
          await store.insert({
            table: 'aave_v_3_pool_liquidation_call',
            values: toSnakeKeysArray(data.custom.LiquidationCall),
            format: 'JSONEachRow',
          })
        },
        onRollback: async ({ safeCursor, store }) => {
          await store.removeAllRows({
            tables: ['aave_v_3_pool_liquidation_call'],
            where: 'block_number > {latest:UInt32}',
            params: { latest: safeCursor.number },
          })
        },
      }),
    )
}

void main()
