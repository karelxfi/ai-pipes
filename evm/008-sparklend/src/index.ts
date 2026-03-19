import 'dotenv/config'
import path from 'node:path'
import { createClient } from '@clickhouse/client'
import { evmDecoder, evmPortalSource } from '@subsquid/pipes/evm'
import { clickhouseTarget } from '@subsquid/pipes/targets/clickhouse'
import { z } from 'zod'
// Import from implementation ABI (proxy address used in contracts array)
import { events as poolEvents } from './contracts/0x5ae329203e00f76891094dcfedd5aca082a50e1b.js'
import { serializeJsonWithBigInt } from './utils/index.js'

const env = z
  .object({
    CLICKHOUSE_USER: z.string(),
    CLICKHOUSE_PASSWORD: z.string(),
    CLICKHOUSE_URL: z.string(),
    CLICKHOUSE_DATABASE: z.string(),
  })
  .parse(process.env)

// SparkLend Pool proxy on Ethereum — Aave V3 fork
const PROXY = '0xC13e21B648A5Ee794902342038FF3aDAB66BE987'

const actions = evmDecoder({
  // SparkLend deployed April 2023, block ~17000000
  range: { from: '17000000' },
  contracts: [PROXY],
  events: {
    supply: poolEvents.Supply,
    withdraw: poolEvents.Withdraw,
    borrow: poolEvents.Borrow,
    repay: poolEvents.Repay,
  },
}).pipe(({ supply, withdraw, borrow, repay }) => {
  const rows = [
    ...supply.map((d) => ({
      action: 'supply',
      reserve: d.event.reserve,
      user: d.event.onBehalfOf,
      amount: d.event.amount,
      block_number: d.block.number,
      tx_hash: d.rawEvent.transactionHash,
      log_index: d.rawEvent.logIndex,
      timestamp: Math.floor(new Date(d.timestamp).getTime() / 1000),
      sign: 1,
    })),
    ...withdraw.map((d) => ({
      action: 'withdraw',
      reserve: d.event.reserve,
      user: d.event.user,
      amount: d.event.amount,
      block_number: d.block.number,
      tx_hash: d.rawEvent.transactionHash,
      log_index: d.rawEvent.logIndex,
      timestamp: Math.floor(new Date(d.timestamp).getTime() / 1000),
      sign: 1,
    })),
    ...borrow.map((d) => ({
      action: 'borrow',
      reserve: d.event.reserve,
      user: d.event.onBehalfOf,
      amount: d.event.amount,
      block_number: d.block.number,
      tx_hash: d.rawEvent.transactionHash,
      log_index: d.rawEvent.logIndex,
      timestamp: Math.floor(new Date(d.timestamp).getTime() / 1000),
      sign: 1,
    })),
    ...repay.map((d) => ({
      action: 'repay',
      reserve: d.event.reserve,
      user: d.event.user,
      amount: d.event.amount,
      block_number: d.block.number,
      tx_hash: d.rawEvent.transactionHash,
      log_index: d.rawEvent.logIndex,
      timestamp: Math.floor(new Date(d.timestamp).getTime() / 1000),
      sign: 1,
    })),
  ]
  return { actions: rows }
})

export async function main() {
  await evmPortalSource({
    portal: 'https://portal.sqd.dev/datasets/ethereum-mainnet',
  })
    .pipeComposite({ actions })
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
          if (data.actions.actions.length > 0) {
            await store.insert({
              table: 'sparklend_actions',
              values: data.actions.actions,
              format: 'JSONEachRow',
            })
          }
        },
        onRollback: async ({ safeCursor, store }) => {
          await store.removeAllRows({
            tables: ['sparklend_actions'],
            where: 'block_number > {latest:UInt32}',
            params: { latest: safeCursor.number },
          })
        },
      }),
    )
}

void main()
