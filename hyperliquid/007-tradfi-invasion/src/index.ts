import 'dotenv/config'
import path from 'node:path'
import { createClient } from '@clickhouse/client'
import { hyperliquidFillsPortalStream, hyperliquidFillsQuery } from '@subsquid/pipes/hyperliquid'
import { clickhouseTarget } from '@subsquid/pipes/targets/clickhouse'
import { z } from 'zod'

const env = z
  .object({
    CLICKHOUSE_USER: z.string(),
    CLICKHOUSE_PASSWORD: z.string(),
    CLICKHOUSE_URL: z.string(),
    CLICKHOUSE_DATABASE: z.string(),
  })
  .parse(process.env)

// ~Jan 1, 2026 — captures the full tradfi invasion arc
const START_BLOCK = 910000000

// --- Asset classification ---

const COMMODITY_TICKERS = new Set([
  'CL', 'GOLD', 'SILVER', 'NG', 'NATGAS', 'WHEAT', 'CORN', 'COPPER', 'PLAT', 'PLATINUM',
  'SOYBEAN', 'COTTON', 'COFFEE', 'SUGAR', 'COCOA', 'BRENT', 'HG',
  'SI', 'GC', 'ZW', 'ZC', 'ZS', 'KC', 'SB', 'CC', 'URNM',
])

const EQUITY_TICKERS = new Set([
  'TSLA', 'AAPL', 'NVDA', 'AMZN', 'GOOG', 'GOOGL', 'MSFT', 'META', 'NFLX',
  'AMD', 'INTC', 'COIN', 'MSTR', 'GME', 'AMC', 'SPX', 'NDX', 'DJI',
  'QQQ', 'SPY', 'IWM', 'PLTR', 'UBER', 'SHOP', 'SQ', 'PYPL',
  'BA', 'DIS', 'JPM', 'GS', 'V', 'MA', 'WMT', 'KO', 'PEP',
  'HOOD', 'TSM', 'MU', 'BABA', 'ORCL', 'RIVN', 'SMSN', 'HYUNDAI',
  'CRCL', 'CRWV', 'SNDK', 'SKHX', 'XYZ100', 'USA500', 'USAR',
  'EWY', 'EWJ',
])

const FOREX_TICKERS = new Set([
  'EUR', 'GBP', 'JPY', 'CHF', 'AUD', 'CAD', 'NZD', 'CNY', 'CNH',
  'MXN', 'BRL', 'INR', 'KRW', 'SGD', 'HKD', 'SEK', 'NOK', 'DKK',
  'TRY', 'ZAR', 'PLN', 'CZK', 'HUF', 'RUB', 'PHP', 'THB',
  'DXY', 'EURUSD', 'GBPUSD', 'USDJPY',
])

function classify(coin: string): { asset_class: string; sub_class: string } {
  // xyz: or cash: prefixed = tradfi markets
  const prefixMatch = coin.match(/^(xyz|cash):(.+)$/)
  if (prefixMatch) {
    const ticker = prefixMatch[2]
    if (COMMODITY_TICKERS.has(ticker)) return { asset_class: 'COMMODITY', sub_class: ticker }
    if (EQUITY_TICKERS.has(ticker)) return { asset_class: 'EQUITY', sub_class: ticker }
    if (FOREX_TICKERS.has(ticker)) return { asset_class: 'FOREX', sub_class: ticker }
    // Unknown tradfi — classify by prefix heuristic
    return { asset_class: 'TRADFI_OTHER', sub_class: ticker }
  }

  // @NNN numbered markets = permissionless HIP-3 (could be anything, treat as OTHER)
  if (coin.startsWith('@')) return { asset_class: 'HIP3', sub_class: coin }

  // Plain name = crypto
  return { asset_class: 'CRYPTO', sub_class: coin }
}

const query = hyperliquidFillsQuery()
  .addRange({ from: START_BLOCK })
  .addFields({
    block: { number: true, timestamp: true },
    fill: {
      user: true,
      coin: true,
      px: true,
      sz: true,
      side: true,
      dir: true,
      closedPnl: true,
      fee: true,
    },
  })
  .addFill({
    range: { from: START_BLOCK },
    request: {},  // all coins
  })

export async function main() {
  await hyperliquidFillsPortalStream({
    id: 'hl-tradfi-invasion',
    portal: 'https://portal.sqd.dev/datasets/hyperliquid-fills',
    outputs: query,
  })
    .pipe((blocks) => {
      const fills = blocks.flatMap((block) =>
        block.fills.map((fill) => {
          const { asset_class, sub_class } = classify(fill.coin)
          return {
            block_number: block.header.number,
            timestamp: new Date(block.header.timestamp).toISOString(),
            user: fill.user,
            coin: fill.coin,
            asset_class,
            sub_class,
            px: fill.px,
            sz: fill.sz,
            side: fill.side === 'B' ? 'Buy' : 'Sell',
            dir: fill.dir,
            closed_pnl: fill.closedPnl,
            fee: fill.fee,
            notional: fill.px * fill.sz,
            sign: 1,
          }
        }),
      )
      return { fills }
    })
    .pipeTo(
      clickhouseTarget({
        client: createClient({
          username: env.CLICKHOUSE_USER,
          password: env.CLICKHOUSE_PASSWORD,
          url: env.CLICKHOUSE_URL,
          database: env.CLICKHOUSE_DATABASE,
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
          if (data.fills.length > 0) {
            await store.insert({
              table: 'fills',
              values: data.fills,
              format: 'JSONEachRow',
            })
          }
        },
        onRollback: async ({ safeCursor, store }) => {
          await store.removeAllRows({
            tables: ['fills'],
            where: 'block_number > {latest:UInt64}',
            params: { latest: safeCursor.number },
          })
        },
      }),
    )
}

void main()
