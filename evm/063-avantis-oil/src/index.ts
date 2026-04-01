import 'dotenv/config'
import path from 'node:path'
import { createClient } from '@clickhouse/client'
import { evmDecoder, evmPortalStream } from '@subsquid/pipes/evm'
import { clickhouseTarget } from '@subsquid/pipes/targets/clickhouse'
import { events } from './contracts/trading.js'
import { enrichEvents, serializeJsonWithBigInt } from './utils/index.js'

// Avantis Trading contract (proxy) on Base
const TRADING = '0x44914408af82bc9983bbb330e3578e1105e11d4e'

// Commodity pair indices
const COMMODITY_PAIRS: Record<number, string> = {
  20: 'XAG/USD',  // Silver
  21: 'XAU/USD',  // Gold
  65: 'WTI/USD',  // Crude Oil
}
const COMMODITY_PAIR_IDS = new Set(Object.keys(COMMODITY_PAIRS).map(Number))

// 30-day lookback — commodity trading is less frequent than crypto pairs
const LOOKBACK_DAYS = 30
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
    TpUpdated: events.TpUpdated,
    SlUpdated: events.SlUpdated,
  },
}).pipe(enrichEvents)

function isCommodity(pairIndex: number): boolean {
  return COMMODITY_PAIR_IDS.has(pairIndex)
}

function commodityName(pairIndex: number): string {
  return COMMODITY_PAIRS[pairIndex] ?? `PAIR-${pairIndex}`
}

export async function main() {
  await evmPortalStream({
    id: 'avantis-oil-commodities',
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
        // Market orders — filter to commodity pairs
        const orderRows: any[] = []
        for (const e of data.decoder.MarketOrderInitiated) {
          const pi = Number(e.pairIndex)
          if (!isCommodity(pi)) continue
          orderRows.push({
            trader: e.trader.toLowerCase(),
            pair_index: pi,
            commodity: commodityName(pi),
            order_type: 'market',
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

        // Limit order initiations — filter to commodity pairs
        for (const e of data.decoder.LimitOrderInitiated) {
          const pi = Number(e.pairIndex)
          if (!isCommodity(pi)) continue
          orderRows.push({
            trader: e.trader.toLowerCase(),
            pair_index: pi,
            commodity: commodityName(pi),
            order_type: 'limit_initiated',
            is_open: 1,
            order_id: Number(e.orderId),
            is_buy: 0,
            is_pnl: 0,
            initial_pos_token: '0',
            leverage: 0,
            block_number: e.blockNumber,
            tx_hash: e.txHash,
            log_index: e.logIndex,
            timestamp: new Date(e.timestamp * 1000).toISOString(),
          })
        }

        if (orderRows.length > 0) {
          await store.insert({ table: 'commodity_orders', values: orderRows, format: 'JSONEachRow' })
        }

        // Open limit placed — commodity pairs
        const limitRows: any[] = []
        for (const e of data.decoder.OpenLimitPlaced) {
          const pi = Number(e.pairIndex)
          if (!isCommodity(pi)) continue
          limitRows.push({
            trader: e.trader.toLowerCase(),
            pair_index: pi,
            commodity: commodityName(pi),
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
        if (limitRows.length > 0) {
          await store.insert({ table: 'commodity_limits', values: limitRows, format: 'JSONEachRow' })
        }

        // TP/SL updates — commodity pairs
        const riskRows: any[] = []
        for (const e of data.decoder.TpUpdated) {
          const pi = Number(e.pairIndex)
          if (!isCommodity(pi)) continue
          riskRows.push({
            trader: e.trader.toLowerCase(),
            pair_index: pi,
            commodity: commodityName(pi),
            update_kind: 'tp',
            trade_index: Number(e.index),
            new_value: String(e.newTp),
            block_number: e.blockNumber,
            tx_hash: e.txHash,
            log_index: e.logIndex,
            timestamp: new Date(e.timestamp * 1000).toISOString(),
          })
        }
        for (const e of data.decoder.SlUpdated) {
          const pi = Number(e.pairIndex)
          if (!isCommodity(pi)) continue
          riskRows.push({
            trader: e.trader.toLowerCase(),
            pair_index: pi,
            commodity: commodityName(pi),
            update_kind: 'sl',
            trade_index: Number(e.index),
            new_value: String(e.newSl),
            block_number: e.blockNumber,
            tx_hash: e.txHash,
            log_index: e.logIndex,
            timestamp: new Date(e.timestamp * 1000).toISOString(),
          })
        }
        if (riskRows.length > 0) {
          await store.insert({ table: 'commodity_risk_updates', values: riskRows, format: 'JSONEachRow' })
        }
      },
      onRollback: async ({ safeCursor, store }) => {
        const tables = ['commodity_orders', 'commodity_limits', 'commodity_risk_updates']
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
