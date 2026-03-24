import 'dotenv/config'
import path from 'node:path'
import { createClient } from '@clickhouse/client'
import { evmDecoder, evmPortalStream } from '@subsquid/pipes/evm'
import { clickhouseTarget } from '@subsquid/pipes/targets/clickhouse'
import { z } from 'zod'
// Manual event definition — Liquidity contract is a proxy
import { events as liquidityEvents } from './contracts/FluidLiquidity.js'
import { serializeJsonWithBigInt } from './utils/index.js'

const env = z
  .object({
    CLICKHOUSE_USER: z.string(),
    CLICKHOUSE_PASSWORD: z.string(),
    CLICKHOUSE_URL: z.string(),
    CLICKHOUSE_DATABASE: z.string(),
  })
  .parse(process.env)

// Token address → symbol mapping
const TOKENS: Record<string, string> = {
  '0xeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee': 'ETH',
  '0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2': 'WETH',
  '0x7f39c581f595b53c5cb19bd0b3f8da6c935e2ca0': 'wstETH',
  '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48': 'USDC',
  '0xdac17f958d2ee523a2206206994597c13d831ec7': 'USDT',
  '0x6b175474e89094c44da98b954eedeac495271d0f': 'DAI',
  '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599': 'WBTC',
  '0xae78736cd615f374d3085123a210448e74fc6393': 'rETH',
  '0xbe9895146f7af43049ca1c1ae358b0541ea49704': 'cbETH',
  '0x83f20f44975d03b1b09e64809b757c47f942beea': 'sDAI',
  '0xdc035d45d973e3ec169d2276ddab16f1e407384f': 'USDS',
  '0xa3931d71877c0e7a3148cb7eb4463524fec27fbd': 'sUSDS',
  '0x6f40d4a6237c257fff2db00fa0510deeecd303eb': 'FLUID',
}

function tokenName(addr: string): string {
  return TOKENS[addr.toLowerCase()] || (addr.substring(0, 6) + '..' + addr.substring(38))
}

// Classify operation based on supplyAmount and borrowAmount signs
function classifyAction(supplyAmount: bigint, borrowAmount: bigint): string {
  if (supplyAmount > 0n) return 'supply'
  if (supplyAmount < 0n) return 'withdraw'
  if (borrowAmount > 0n) return 'borrow'
  if (borrowAmount < 0n) return 'repay'
  return 'other'
}

const operations = evmDecoder({
  // Fluid Liquidity deployed late 2023
  range: { from: '18900000' },
  contracts: ['0x52Aa899454998Be5b000Ad077a46Bbe360F4e497'],
  events: {
    ops: liquidityEvents.LogOperate,
  },
}).pipe(({ ops }) => {
  const rows = ops.map((d) => ({
    protocol: d.event.user_,
    token: d.event.token_,
    token_name: tokenName(d.event.token_),
    action: classifyAction(d.event.supplyAmount_, d.event.borrowAmount_),
    block_number: d.block.number,
    tx_hash: d.rawEvent.transactionHash,
    log_index: d.rawEvent.logIndex,
    timestamp: Math.floor(new Date(d.timestamp).getTime() / 1000),
    sign: 1,
  }))
  return { operations: rows }
})

export async function main() {
  await evmPortalStream({
    id: 'fluid-lending-operations',
    portal: 'https://portal.sqd.dev/datasets/ethereum-mainnet',
    outputs: { operations },
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
          if (data.operations.operations.length > 0) {
            await store.insert({
              table: 'fluid_operations',
              values: data.operations.operations,
              format: 'JSONEachRow',
            })
          }
        },
        onRollback: async ({ safeCursor, store }) => {
          await store.removeAllRows({
            tables: ['fluid_operations'],
            where: 'block_number > {latest:UInt32}',
            params: { latest: safeCursor.number },
          })
        },
      }),
    )
}

void main()
