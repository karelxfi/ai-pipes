import 'dotenv/config'
import path from 'node:path'
import { createClient } from '@clickhouse/client'
import { evmDecoder, evmPortalStream } from '@subsquid/pipes/evm'
import { clickhouseTarget } from '@subsquid/pipes/targets/clickhouse'
import { z } from 'zod'
import { events as fluidLiquidityEvents } from './contracts/FluidLiquidity.js'
import { enrichEvents, serializeJsonWithBigInt } from './utils/index.js'

// Fluid Liquidity hub on BSC — all Venus Flux supply/borrow/withdraw/repay flows
const LIQUIDITY = '0x52aa899454998be5b000ad077a46bbe360f4e497'

// Dynamic 7-day lookback — resolved to block number at runtime by Portal
const LOOKBACK_DAYS = 7
const startDate = new Date(Date.now() - LOOKBACK_DAYS * 86_400_000)

// Known BSC token addresses for dashboard labels
const TOKEN_LABELS: Record<string, string> = {
  '0x55d398326f99059ff775485246999027b3197955': 'USDT',
  '0x8ac76a51cc950d9822d68b83fe1ad97b32cd580d': 'USDC',
  '0xbb4cdb9cbd36b01bd1cbaebf2de08d9173bc095c': 'WBNB',
  '0x2170ed0880ac9a755fd29b2688956bd959f933f8': 'ETH',
  '0x7130d2a12b9bcbfae4f2634d864a1ee1ce3ead9c': 'BTCB',
  '0x0000000000000000000000000000000000000000': 'BNB',
  '0xe9e7cea3dedca5984780bafc599bd69add087d56': 'BUSD',
  '0x4aae823a6a0b6ef73f7510c1b78437e7d29f7703': 'U',
}

// Known Venus Flux protocol contracts for user classification
const PROTOCOL_LABELS: Record<string, string> = {
  '0x0b1a513ee24972daef112bc777a5610d4325c9e7': 'DEX:USDT/USDC',
  '0x2886a01a0645390872a9eb99dae1283664b0c524': 'DEX:ETH/wBETH',
  '0x527c2a0b8a3edd9696b4a9443ef66ec30fd7b84a': 'fWBNB',
  '0xa5b8fca32e5252b0b58eabf1a8c79d958f8ee6a2': 'fUSDT',
  '0xfe60462e93cee34319f48cfc6acfbc13c2882df9': 'fUSDC',
  '0x007df53cda786450cf8145a73b2748b241a0069c': 'fU',
  '0xeabbfca72f8a8bf14c4ac59e69ecb2eb69f0811c': 'Vault:BNB/USDC',
  '0xbec491fef7b4f666b270f9d5e5c3f443cbf20991': 'Vault:BNB/USDT',
  '0x0c8c77b7ff4c2af7f6cebbe67350a490e3dd6cb3': 'Vault:ETH/USDC',
  '0xa0f83fc5885cebc0420ce7c7b139adc80c4f4d91': 'Vault:BTCB/USDC',
}

const env = z.object({
  CLICKHOUSE_USER: z.string(),
  CLICKHOUSE_PASSWORD: z.string(),
  CLICKHOUSE_URL: z.string(),
  CLICKHOUSE_DATABASE: z.string(),
}).parse(process.env)

function classifyOp(supplyAmount: bigint, borrowAmount: bigint): string {
  if (supplyAmount > 0n && borrowAmount === 0n) return 'supply'
  if (supplyAmount < 0n && borrowAmount === 0n) return 'withdraw'
  if (borrowAmount > 0n && supplyAmount === 0n) return 'borrow'
  if (borrowAmount < 0n && supplyAmount === 0n) return 'repay'
  if (supplyAmount > 0n && borrowAmount > 0n) return 'supply+borrow'
  if (supplyAmount < 0n && borrowAmount < 0n) return 'withdraw+repay'
  if (supplyAmount > 0n && borrowAmount < 0n) return 'supply+repay'
  if (supplyAmount < 0n && borrowAmount > 0n) return 'withdraw+borrow'
  return 'unknown'
}

const decoder = evmDecoder({
  range: { from: startDate },
  contracts: [LIQUIDITY],
  events: {
    LogOperate: fluidLiquidityEvents.LogOperate,
  },
}).pipe(enrichEvents)

export async function main() {
  await evmPortalStream({
    id: 'venus-flux-liquidity-pulse',
    portal: 'https://portal.sqd.dev/datasets/binance-mainnet',
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
        const rows = data.decoder.LogOperate.map((e) => ({
          user: e.user.toLowerCase(),
          token: e.token.toLowerCase(),
          token_label: TOKEN_LABELS[e.token.toLowerCase()] ?? e.token.substring(0, 10),
          user_label: PROTOCOL_LABELS[e.user.toLowerCase()] ?? e.user.substring(0, 10),
          op_type: classifyOp(e.supplyAmount, e.borrowAmount),
          supply_amount: String(e.supplyAmount),
          borrow_amount: String(e.borrowAmount),
          withdraw_to: e.withdrawTo.toLowerCase(),
          borrow_to: e.borrowTo.toLowerCase(),
          total_amounts: String(e.totalAmounts),
          exchange_prices_and_config: String(e.exchangePricesAndConfig),
          block_number: e.blockNumber,
          tx_hash: e.txHash,
          log_index: e.logIndex,
          timestamp: new Date(e.timestamp * 1000).toISOString(),
        }))
        if (rows.length > 0) {
          await store.insert({ table: 'liquidity_ops', values: rows, format: 'JSONEachRow' })
        }
      },
      onRollback: async ({ safeCursor, store }) => {
        await store.removeAllRows({
          tables: ['liquidity_ops'],
          where: 'block_number > {latest:UInt32}',
          params: { latest: safeCursor.number },
        })
      },
    }),
  )
}

void main()
