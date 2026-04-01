import 'dotenv/config'
import path from 'node:path'
import { createClient } from '@clickhouse/client'
import { evmDecoder, evmPortalStream } from '@subsquid/pipes/evm'
import { clickhouseTarget } from '@subsquid/pipes/targets/clickhouse'
import { events as tradingEvents } from './contracts/OstiumTrading.js'
import { enrichEvents, serializeJsonWithBigInt } from './utils/index.js'

const TRADING_PROXY = '0x6d0ba1f9996dbd8885827e1b2e8f6593e7702411'

// 5-day lookback — Ostium is very active (5K+ events/week)
const LOOKBACK_DAYS = 5
const startDate = new Date(Date.now() - LOOKBACK_DAYS * 86_400_000)

const env = {
  CLICKHOUSE_USER: process.env.CLICKHOUSE_USER!,
  CLICKHOUSE_PASSWORD: process.env.CLICKHOUSE_PASSWORD!,
  CLICKHOUSE_URL: process.env.CLICKHOUSE_URL!,
  CLICKHOUSE_DATABASE: process.env.CLICKHOUSE_DATABASE!,
}

const decoder = evmDecoder({
  range: { from: startDate },
  contracts: [TRADING_PROXY],
  events: {
    MarketOpenOrderInitiated: tradingEvents.MarketOpenOrderInitiated,
    MarketCloseOrderInitiatedV2: tradingEvents.MarketCloseOrderInitiatedV2,
    OpenLimitPlacedV2: tradingEvents.OpenLimitPlacedV2,
    OpenLimitCanceled: tradingEvents.OpenLimitCanceled,
    OpenLimitUpdated: tradingEvents.OpenLimitUpdated,
    AutomationOpenOrderInitiated: tradingEvents.AutomationOpenOrderInitiated,
    AutomationCloseOrderInitiated: tradingEvents.AutomationCloseOrderInitiated,
    DelegateAdded: tradingEvents.DelegateAdded,
  },
}).pipe(enrichEvents)

export async function main() {
  await evmPortalStream({
    id: 'ostium-rwa-perps-pulse',
    portal: 'https://portal.sqd.dev/datasets/arbitrum-one',
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
        const rows: any[] = []

        for (const e of data.decoder.MarketOpenOrderInitiated) {
          rows.push({
            event_type: 'market_open',
            trader: e.trader.toLowerCase(),
            pair_index: Number(e.pairIndex),
            order_id: Number(e.orderId),
            block_number: e.blockNumber,
            tx_hash: e.txHash,
            log_index: e.logIndex,
            timestamp: new Date(e.timestamp * 1000).toISOString(),
          })
        }

        for (const e of data.decoder.MarketCloseOrderInitiatedV2) {
          rows.push({
            event_type: 'market_close',
            trader: e.trader.toLowerCase(),
            pair_index: Number(e.pairIndex),
            order_id: Number(e.orderId),
            trade_id: Number(e.tradeId),
            block_number: e.blockNumber,
            tx_hash: e.txHash,
            log_index: e.logIndex,
            timestamp: new Date(e.timestamp * 1000).toISOString(),
          })
        }

        for (const e of data.decoder.OpenLimitPlacedV2) {
          rows.push({
            event_type: 'limit_placed',
            trader: e.trader.toLowerCase(),
            pair_index: Number(e.pairIndex),
            trade_index: Number(e.index),
            block_number: e.blockNumber,
            tx_hash: e.txHash,
            log_index: e.logIndex,
            timestamp: new Date(e.timestamp * 1000).toISOString(),
          })
        }

        for (const e of data.decoder.OpenLimitCanceled) {
          rows.push({
            event_type: 'limit_canceled',
            trader: e.trader.toLowerCase(),
            pair_index: Number(e.pairIndex),
            trade_index: Number(e.index),
            block_number: e.blockNumber,
            tx_hash: e.txHash,
            log_index: e.logIndex,
            timestamp: new Date(e.timestamp * 1000).toISOString(),
          })
        }

        for (const e of data.decoder.OpenLimitUpdated) {
          rows.push({
            event_type: 'limit_updated',
            trader: e.trader.toLowerCase(),
            pair_index: Number(e.pairIndex),
            trade_index: Number(e.index),
            block_number: e.blockNumber,
            tx_hash: e.txHash,
            log_index: e.logIndex,
            timestamp: new Date(e.timestamp * 1000).toISOString(),
          })
        }

        for (const e of data.decoder.AutomationOpenOrderInitiated) {
          rows.push({
            event_type: 'auto_open',
            trader: e.trader.toLowerCase(),
            pair_index: Number(e.pairIndex),
            order_id: Number(e.orderId),
            trade_index: Number(e.index),
            block_number: e.blockNumber,
            tx_hash: e.txHash,
            log_index: e.logIndex,
            timestamp: new Date(e.timestamp * 1000).toISOString(),
          })
        }

        for (const e of data.decoder.AutomationCloseOrderInitiated) {
          rows.push({
            event_type: 'auto_close',
            trader: e.trader.toLowerCase(),
            pair_index: Number(e.pairIndex),
            order_id: Number(e.orderId),
            trade_id: Number(e.tradeId),
            block_number: e.blockNumber,
            tx_hash: e.txHash,
            log_index: e.logIndex,
            timestamp: new Date(e.timestamp * 1000).toISOString(),
          })
        }

        for (const e of data.decoder.DelegateAdded) {
          rows.push({
            event_type: 'delegate_added',
            trader: e.delegator.toLowerCase(),
            pair_index: 0,
            block_number: e.blockNumber,
            tx_hash: e.txHash,
            log_index: e.logIndex,
            timestamp: new Date(e.timestamp * 1000).toISOString(),
          })
        }

        if (rows.length > 0) {
          await store.insert({ table: 'trading_events', values: rows, format: 'JSONEachRow' })
        }
      },
      onRollback: async ({ safeCursor, store }) => {
        await store.removeAllRows({
          tables: ['trading_events'],
          where: 'block_number > {latest:UInt32}',
          params: { latest: safeCursor.number },
        })
      },
    }),
  )
}

void main()
