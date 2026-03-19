import 'dotenv/config'
import path from 'node:path'
import { createClient } from '@clickhouse/client'
import { evmDecoder, evmPortalSource } from '@subsquid/pipes/evm'
import { clickhouseTarget } from '@subsquid/pipes/targets/clickhouse'
import { z } from 'zod'
import { events as boosterEvents } from './contracts/0xF403C135812408BFbE8713b5A23a04b3D48AAE31.js'
import { serializeJsonWithBigInt } from './utils/index.js'

const env = z
  .object({
    CLICKHOUSE_USER: z.string(),
    CLICKHOUSE_PASSWORD: z.string(),
    CLICKHOUSE_URL: z.string(),
    CLICKHOUSE_DATABASE: z.string(),
  })
  .parse(process.env)

// Convex Booster — main deposit contract for Curve LP tokens
const staking = evmDecoder({
  // Booster deployed May 2021, block ~12450000
  range: { from: '12450000' },
  contracts: ['0xF403C135812408BFbE8713b5A23a04b3D48AAE31'],
  events: {
    deposits: boosterEvents.Deposited,
    withdrawals: boosterEvents.Withdrawn,
  },
}).pipe(({ deposits, withdrawals }) => {
  const rows = [
    ...deposits.map((d) => ({
      event_type: 'deposit',
      user: d.event.user,
      pool_id: Number(d.event.poolid),
      block_number: d.block.number,
      tx_hash: d.rawEvent.transactionHash,
      log_index: d.rawEvent.logIndex,
      timestamp: Math.floor(new Date(d.timestamp).getTime() / 1000),
      sign: 1,
    })),
    ...withdrawals.map((d) => ({
      event_type: 'withdrawal',
      user: d.event.user,
      pool_id: Number(d.event.poolid),
      block_number: d.block.number,
      tx_hash: d.rawEvent.transactionHash,
      log_index: d.rawEvent.logIndex,
      timestamp: Math.floor(new Date(d.timestamp).getTime() / 1000),
      sign: 1,
    })),
  ]
  return { staking: rows }
})

export async function main() {
  await evmPortalSource({
    portal: 'https://portal.sqd.dev/datasets/ethereum-mainnet',
  })
    .pipeComposite({ staking })
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
          if (data.staking.staking.length > 0) {
            await store.insert({
              table: 'convex_staking',
              values: data.staking.staking,
              format: 'JSONEachRow',
            })
          }
        },
        onRollback: async ({ safeCursor, store }) => {
          await store.removeAllRows({
            tables: ['convex_staking'],
            where: 'block_number > {latest:UInt32}',
            params: { latest: safeCursor.number },
          })
        },
      }),
    )
}

void main()
