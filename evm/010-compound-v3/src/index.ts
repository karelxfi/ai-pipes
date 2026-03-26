import 'dotenv/config'
import path from 'node:path'
import { createClient } from '@clickhouse/client'
import { evmDecoder, evmPortalStream } from '@subsquid/pipes/evm'
import { clickhouseTarget } from '@subsquid/pipes/targets/clickhouse'
import { z } from 'zod'
// Import from Comet implementation ABI
import { events as cometEvents } from './contracts/0xeB330B7c1622E0f8b18a7dd1dECC27cf3d980E61.js'
import { serializeJsonWithBigInt } from './utils/index.js'

const env = z
  .object({
    CLICKHOUSE_USER: z.string(),
    CLICKHOUSE_PASSWORD: z.string(),
    CLICKHOUSE_URL: z.string(),
    CLICKHOUSE_DATABASE: z.string(),
  })
  .parse(process.env)

// Compound V3 Comet markets on Ethereum
const MARKETS: Record<string, string> = {
  '0xc3d688b66703497daa19211eedff47f25384cdc3': 'cUSDCv3',
  '0xa17581a9e3356d9a858b789d68b4d866e593ae94': 'cWETHv3',
}

const marketAddresses = Object.keys(MARKETS)

const actions = evmDecoder({
  // cUSDCv3 deployed Aug 2022 (~block 15331586)
  range: { from: '15300000' },
  contracts: marketAddresses,
  events: {
    supply: cometEvents.Supply,
    withdraw: cometEvents.Withdraw,
    supplyCollateral: cometEvents.SupplyCollateral,
    withdrawCollateral: cometEvents.WithdrawCollateral,
  },
}).pipe(({ supply, withdraw, supplyCollateral, withdrawCollateral }) => {
  const rows = [
    ...supply.map((d) => ({
      market: d.contract.toLowerCase(),
      market_name: MARKETS[d.contract.toLowerCase()] ?? 'Unknown',
      action: 'supply',
      user: d.event.dst,
      amount: d.event.amount,
      block_number: d.block.number,
      tx_hash: d.rawEvent.transactionHash,
      tx_index: d.rawEvent.transactionIndex,
      log_index: d.rawEvent.logIndex,
      timestamp: Math.floor(new Date(d.timestamp).getTime() / 1000),
      sign: 1,
    })),
    ...withdraw.map((d) => ({
      market: d.contract.toLowerCase(),
      market_name: MARKETS[d.contract.toLowerCase()] ?? 'Unknown',
      action: 'withdraw',
      user: d.event.src,
      amount: d.event.amount,
      block_number: d.block.number,
      tx_hash: d.rawEvent.transactionHash,
      tx_index: d.rawEvent.transactionIndex,
      log_index: d.rawEvent.logIndex,
      timestamp: Math.floor(new Date(d.timestamp).getTime() / 1000),
      sign: 1,
    })),
    ...supplyCollateral.map((d) => ({
      market: d.contract.toLowerCase(),
      market_name: MARKETS[d.contract.toLowerCase()] ?? 'Unknown',
      action: 'supply_collateral',
      user: d.event.dst,
      amount: d.event.amount,
      block_number: d.block.number,
      tx_hash: d.rawEvent.transactionHash,
      tx_index: d.rawEvent.transactionIndex,
      log_index: d.rawEvent.logIndex,
      timestamp: Math.floor(new Date(d.timestamp).getTime() / 1000),
      sign: 1,
    })),
    ...withdrawCollateral.map((d) => ({
      market: d.contract.toLowerCase(),
      market_name: MARKETS[d.contract.toLowerCase()] ?? 'Unknown',
      action: 'withdraw_collateral',
      user: d.event.src,
      amount: d.event.amount,
      block_number: d.block.number,
      tx_hash: d.rawEvent.transactionHash,
      tx_index: d.rawEvent.transactionIndex,
      log_index: d.rawEvent.logIndex,
      timestamp: Math.floor(new Date(d.timestamp).getTime() / 1000),
      sign: 1,
    })),
  ]
  return { actions: rows }
})

export async function main() {
  await evmPortalStream({
    id: 'compound-v3-actions',
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
              table: 'compound_v3_actions',
              values: data.actions.actions,
              format: 'JSONEachRow',
            })
          }
        },
        onRollback: async ({ safeCursor, store }) => {
          await store.removeAllRows({
            tables: ['compound_v3_actions'],
            where: 'block_number > {latest:UInt32}',
            params: { latest: safeCursor.number },
          })
        },
      }),
    )
}

void main()
