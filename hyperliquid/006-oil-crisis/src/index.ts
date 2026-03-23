import 'dotenv/config'
import path from 'node:path'
import { createClient } from '@clickhouse/client'
import { hyperliquidFillsPortalSource, HyperliquidFillsQueryBuilder } from '@subsquid/pipes/hyperliquid'
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

// ~Feb 1, 2026 — captures full Iran shock buildup + March explosion
const START_BLOCK = 920000000

const COMMODITY_COINS = /^(xyz:(CL|GOLD|SILVER)|cash:(GOLD|SILVER))$/

function assetClass(coin: string): string {
  if (coin === 'xyz:CL') return 'OIL'
  if (coin.endsWith('GOLD')) return 'GOLD'
  if (coin.endsWith('SILVER')) return 'SILVER'
  return 'UNKNOWN'
}

const query = new HyperliquidFillsQueryBuilder()
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
    request: {},  // all coins — filter in pipe
  })

export async function main() {
  await hyperliquidFillsPortalSource({
    id: 'hl-oil-crisis',
    portal: 'https://portal.sqd.dev/datasets/hyperliquid-fills',
    outputs: query,
  })
    .pipe((blocks) => {
      const fills = blocks.flatMap((block) =>
        block.fills
          .filter((fill) => COMMODITY_COINS.test(fill.coin))
          .map((fill) => ({
            block_number: block.header.number,
            timestamp: new Date(block.header.timestamp).toISOString(),
            user: fill.user,
            coin: fill.coin,
            asset_class: assetClass(fill.coin),
            px: fill.px,
            sz: fill.sz,
            side: fill.side === 'B' ? 'Buy' : 'Sell',
            dir: fill.dir,
            closed_pnl: fill.closedPnl,
            fee: fill.fee,
            notional: fill.px * fill.sz,
            sign: 1,
          })),
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
