import 'dotenv/config'
import path from 'node:path'
import { createClient } from '@clickhouse/client'
import { evmDecoder, evmPortalStream } from '@subsquid/pipes/evm'
import { clickhouseTarget } from '@subsquid/pipes/targets/clickhouse'
import { z } from 'zod'
// All Venus Core Pool vTokens share the same Compound V2 ABI
import { events as vTokenEvents } from './contracts/0xfD5840Cd36d94D7229439859C0112a4185BC0255.js'
import { serializeJsonWithBigInt } from './utils/index.js'

const env = z
  .object({
    CLICKHOUSE_USER: z.string(),
    CLICKHOUSE_PASSWORD: z.string(),
    CLICKHOUSE_URL: z.string(),
    CLICKHOUSE_DATABASE: z.string(),
  })
  .parse(process.env)

// Venus Core Pool vToken markets on BSC
const MARKETS: Record<string, string> = {
  '0xa07c5b74c9b40447a954e1466938b865b6bbea36': 'vBNB',
  '0xfd5840cd36d94d7229439859c0112a4185bc0255': 'vUSDT',
  '0x95c78222b3d6e262426483d42cfa53685a67ab9d': 'vBUSD',
  '0x882c173bc7ff3b7786ca16dfed3dfffb9ee7847b': 'vBTC',
  '0xf508fcd89b8bd15579dc79a6827cb4686a3592c8': 'vETH',
}

const marketAddresses = Object.keys(MARKETS)

const actions = evmDecoder({
  // Venus launched late 2020, block ~4000000 on BSC
  range: { from: '4000000' },
  contracts: marketAddresses,
  events: {
    mints: vTokenEvents.Mint,
    redeems: vTokenEvents.Redeem,
    borrows: vTokenEvents.Borrow,
    repays: vTokenEvents.RepayBorrow,
  },
}).pipe(({ mints, redeems, borrows, repays }) => {
  const rows = [
    ...mints.map((d) => ({
      market: d.contract.toLowerCase(),
      market_name: MARKETS[d.contract.toLowerCase()] ?? 'Unknown',
      action: 'mint',
      user: d.event.minter,
      block_number: d.block.number,
      tx_hash: d.rawEvent.transactionHash,
      log_index: d.rawEvent.logIndex,
      timestamp: Math.floor(new Date(d.timestamp).getTime() / 1000),
      sign: 1,
    })),
    ...redeems.map((d) => ({
      market: d.contract.toLowerCase(),
      market_name: MARKETS[d.contract.toLowerCase()] ?? 'Unknown',
      action: 'redeem',
      user: d.event.redeemer,
      block_number: d.block.number,
      tx_hash: d.rawEvent.transactionHash,
      log_index: d.rawEvent.logIndex,
      timestamp: Math.floor(new Date(d.timestamp).getTime() / 1000),
      sign: 1,
    })),
    ...borrows.map((d) => ({
      market: d.contract.toLowerCase(),
      market_name: MARKETS[d.contract.toLowerCase()] ?? 'Unknown',
      action: 'borrow',
      user: d.event.borrower,
      block_number: d.block.number,
      tx_hash: d.rawEvent.transactionHash,
      log_index: d.rawEvent.logIndex,
      timestamp: Math.floor(new Date(d.timestamp).getTime() / 1000),
      sign: 1,
    })),
    ...repays.map((d) => ({
      market: d.contract.toLowerCase(),
      market_name: MARKETS[d.contract.toLowerCase()] ?? 'Unknown',
      action: 'repay',
      user: d.event.borrower,
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
    id: 'venus-core-pool-actions',
    portal: 'https://portal.sqd.dev/datasets/binance-mainnet',
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
              table: 'venus_actions',
              values: data.actions.actions,
              format: 'JSONEachRow',
            })
          }
        },
        onRollback: async ({ safeCursor, store }) => {
          await store.removeAllRows({
            tables: ['venus_actions'],
            where: 'block_number > {latest:UInt32}',
            params: { latest: safeCursor.number },
          })
        },
      }),
    )
}

void main()
