import 'dotenv/config'
import path from 'node:path'
import { createClient } from '@clickhouse/client'
import { evmDecoder, evmPortalStream } from '@subsquid/pipes/evm'
import { clickhouseTarget } from '@subsquid/pipes/targets/clickhouse'
import { z } from 'zod'
import { events as lidoEvents } from './contracts/0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84.js'
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
  range: { from: '17000000' },
  contracts: ['0xae7ab96520DE3A18E5e111B5EaAb095312D7fE84'],
  /**
   * Or optionally use pass all events object directly to listen to all contract events
   * ```ts
   * events: myContractEvents,
   * ```
   */
  events: {
    TokenRebased: lidoEvents.TokenRebased,
  },
}).pipe(enrichEvents)

export async function main() {
  await evmPortalStream({
    id: 'lido-rebases',
    portal: 'https://portal.sqd.dev/datasets/ethereum-mainnet',
    outputs: { custom },
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
            table: 'lido_token_rebased',
            values: toSnakeKeysArray(data.custom.TokenRebased),
            format: 'JSONEachRow',
          })
        },
        onRollback: async ({ safeCursor, store }) => {
          await store.removeAllRows({
            tables: ['lido_token_rebased'],
            where: 'block_number > {latest:UInt32}',
            params: { latest: safeCursor.number },
          })
        },
      }),
    )
}

void main()
