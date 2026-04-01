import 'dotenv/config'
import path from 'node:path'
import { createClient } from '@clickhouse/client'
import { evmDecoder, evmPortalStream } from '@subsquid/pipes/evm'
import { clickhouseTarget } from '@subsquid/pipes/targets/clickhouse'
import { events } from './contracts/trading.js'
import { enrichEvents, serializeJsonWithBigInt } from './utils/index.js'

// Avantis Trading contract (proxy) on Base
const TRADING = '0x44914408af82bc9983bbb330e3578e1105e11d4e'

// 7-day lookback for high-frequency trading events
const LOOKBACK_DAYS = 7
const startDate = new Date(Date.now() - LOOKBACK_DAYS * 86_400_000)

const env = {
  CLICKHOUSE_USER: process.env.CLICKHOUSE_USER!,
  CLICKHOUSE_PASSWORD: process.env.CLICKHOUSE_PASSWORD!,
  CLICKHOUSE_URL: process.env.CLICKHOUSE_URL!,
  CLICKHOUSE_DATABASE: process.env.CLICKHOUSE_DATABASE!,
}

const decoder = evmDecoder({
  range: { from: startDate },
  contracts: [TRADING],
  events: {
    MarketOrderInitiated: events.MarketOrderInitiated,
    LimitOrderInitiated: events.LimitOrderInitiated,
    OpenLimitPlaced: events.OpenLimitPlaced,
    MarginUpdated: events.MarginUpdated,
    TpUpdated: events.TpUpdated,
    SlUpdated: events.SlUpdated,
  },
}).pipe(enrichEvents)

export async function main() {
  await evmPortalStream({
    id: 'avantis-perps-pulse',
    portal: 'https://portal.sqd.dev/datasets/base-mainnet',
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
        // Market orders
        const marketRows: any[] = []
        for (const e of data.decoder.MarketOrderInitiated) {
          marketRows.push({
            trader: e.trader.toLowerCase(),
            pair_index: Number(e.pairIndex),
            is_open: e.open ? 1 : 0,
            order_id: Number(e.orderId ?? e.timestamp),
            is_buy: e.isBuy ? 1 : 0,
            is_pnl: e.isPnl ? 1 : 0,
            initial_pos_token: String(e.initialPosToken),
            leverage: Number(e.leverage),
            block_number: e.blockNumber,
            tx_hash: e.txHash,
            log_index: e.logIndex,
            timestamp: new Date(e.timestamp * 1000).toISOString(),
          })
        }
        if (marketRows.length > 0) {
          await store.insert({ table: 'market_orders', values: marketRows, format: 'JSONEachRow' })
        }

        // Limit orders initiated
        const limitRows: any[] = []
        for (const e of data.decoder.LimitOrderInitiated) {
          limitRows.push({
            trader: e.trader.toLowerCase(),
            pair_index: Number(e.pairIndex),
            order_id: Number(e.orderId),
            block_number: e.blockNumber,
            tx_hash: e.txHash,
            log_index: e.logIndex,
            timestamp: new Date(e.timestamp * 1000).toISOString(),
          })
        }
        if (limitRows.length > 0) {
          await store.insert({ table: 'limit_orders', values: limitRows, format: 'JSONEachRow' })
        }

        // Open limit placed
        const openLimitRows: any[] = []
        for (const e of data.decoder.OpenLimitPlaced) {
          openLimitRows.push({
            trader: e.trader.toLowerCase(),
            pair_index: Number(e.pairIndex),
            trade_index: Number(e.index),
            is_buy: e.isBuy ? 1 : 0,
            open_price: String(e.openPrice),
            order_type: Number(e.orderType),
            collateral: String(e.collateral),
            leverage: Number(e.leverage),
            block_number: e.blockNumber,
            tx_hash: e.txHash,
            log_index: e.logIndex,
            timestamp: new Date(e.timestamp * 1000).toISOString(),
          })
        }
        if (openLimitRows.length > 0) {
          await store.insert({ table: 'open_limits', values: openLimitRows, format: 'JSONEachRow' })
        }

        // Margin updates
        const marginRows: any[] = []
        for (const e of data.decoder.MarginUpdated) {
          marginRows.push({
            trader: e.trader.toLowerCase(),
            pair_index: Number(e.pairIndex),
            trade_index: Number(e.index),
            update_type: Number(e._type),
            position_size_usdc: String(e.newTrade.positionSizeUSDC),
            open_price: String(e.newTrade.openPrice),
            is_buy: e.newTrade.buy ? 1 : 0,
            leverage: Number(e.newTrade.leverage),
            margin_fees: String(e.marginFees),
            block_number: e.blockNumber,
            tx_hash: e.txHash,
            log_index: e.logIndex,
            timestamp: new Date(e.timestamp * 1000).toISOString(),
          })
        }
        if (marginRows.length > 0) {
          await store.insert({ table: 'margin_updates', values: marginRows, format: 'JSONEachRow' })
        }

        // TP updates
        const tpRows: any[] = []
        for (const e of data.decoder.TpUpdated) {
          tpRows.push({
            trader: e.trader.toLowerCase(),
            pair_index: Number(e.pairIndex),
            trade_index: Number(e.index),
            new_tp: String(e.newTp),
            block_number: e.blockNumber,
            tx_hash: e.txHash,
            log_index: e.logIndex,
            timestamp: new Date(e.timestamp * 1000).toISOString(),
          })
        }
        if (tpRows.length > 0) {
          await store.insert({ table: 'tp_updates', values: tpRows, format: 'JSONEachRow' })
        }

        // SL updates
        const slRows: any[] = []
        for (const e of data.decoder.SlUpdated) {
          slRows.push({
            trader: e.trader.toLowerCase(),
            pair_index: Number(e.pairIndex),
            trade_index: Number(e.index),
            new_sl: String(e.newSl),
            block_number: e.blockNumber,
            tx_hash: e.txHash,
            log_index: e.logIndex,
            timestamp: new Date(e.timestamp * 1000).toISOString(),
          })
        }
        if (slRows.length > 0) {
          await store.insert({ table: 'sl_updates', values: slRows, format: 'JSONEachRow' })
        }
      },
      onRollback: async ({ safeCursor, store }) => {
        const tables = ['market_orders', 'limit_orders', 'open_limits', 'margin_updates', 'tp_updates', 'sl_updates']
        await store.removeAllRows({
          tables,
          where: 'block_number > {latest:UInt32}',
          params: { latest: safeCursor.number },
        })
      },
    }),
  )
}

void main()
