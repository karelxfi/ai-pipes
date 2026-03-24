import 'dotenv/config'
import path from 'node:path'
import { createClient } from '@clickhouse/client'
import { evmDecoder, evmPortalStream } from '@subsquid/pipes/evm'
import { clickhouseTarget } from '@subsquid/pipes/targets/clickhouse'
import { z } from 'zod'
import { events as poolEvents } from './contracts/0xc6845a5c768bf8d7681249f8927877efda425baf.js'
import { serializeJsonWithBigInt } from './utils/index.js'

const env = z
  .object({
    CLICKHOUSE_USER: z.string(),
    CLICKHOUSE_PASSWORD: z.string(),
    CLICKHOUSE_URL: z.string(),
    CLICKHOUSE_DATABASE: z.string(),
  })
  .parse(process.env)

// Aave V2 LendingPool proxy on Ethereum
const PROXY = '0x7d2768dE32b0b80b7a3454c06BdAc94A69DDc7A9'

const actions = evmDecoder({
  // Aave V2 deployed Dec 2020, block ~11362579
  range: { from: '11362579' },
  contracts: [PROXY],
  events: {
    deposit: poolEvents.Deposit,
    withdraw: poolEvents.Withdraw,
    borrow: poolEvents.Borrow,
    repay: poolEvents.Repay,
    liquidation: poolEvents.LiquidationCall,
  },
}).pipe(({ deposit, withdraw, borrow, repay, liquidation }) => {
  const rows = [
    ...deposit.map((d) => ({
      action: 'deposit',
      reserve: d.event.reserve,
      user: d.event.onBehalfOf,
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
      block_number: d.block.number,
      tx_hash: d.rawEvent.transactionHash,
      log_index: d.rawEvent.logIndex,
      timestamp: Math.floor(new Date(d.timestamp).getTime() / 1000),
      sign: 1,
    })),
    ...liquidation.map((d) => ({
      action: 'liquidation',
      reserve: d.event.debtAsset,
      user: d.event.user,
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
  await evmPortalStream({
    id: 'aave-v2-actions',
    portal: 'https://portal.sqd.dev/datasets/ethereum-mainnet',
    outputs: { actions },
  })
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
              table: 'aave_v2_actions',
              values: data.actions.actions,
              format: 'JSONEachRow',
            })
          }
        },
        onRollback: async ({ safeCursor, store }) => {
          await store.removeAllRows({
            tables: ['aave_v2_actions'],
            where: 'block_number > {latest:UInt32}',
            params: { latest: safeCursor.number },
          })
        },
      }),
    )
}

void main()
