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

// 90 days back from current block (~928M, blocks increment ~1/sec)
const START_BLOCK = 928763082 - 90 * 86400 // ~90 days

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
      feeToken: true,
      crossed: true,
      startPosition: true,
    },
  })
  .addFill({
    range: { from: START_BLOCK },
    request: { coin: ['BTC', 'ETH', 'SOL'] }, // ~6M fills per coin per month
  })

export async function main() {
  await hyperliquidFillsPortalSource({
    id: 'hl-perps-majors',
    portal: 'https://portal.sqd.dev/datasets/hyperliquid-fills',
    outputs: query,
  })
    .pipe((blocks) => {
      const fills = blocks.flatMap((block) =>
        block.fills.map((fill) => ({
          block_number: block.header.number,
          timestamp: new Date(block.header.timestamp).toISOString(),
          user: fill.user,
          coin: fill.coin,
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
              table: 'hl_perps_fills',
              values: data.fills,
              format: 'JSONEachRow',
            })
          }
        },
        onRollback: async ({ safeCursor, store }) => {
          await store.removeAllRows({
            tables: ['hl_perps_fills'],
            where: 'block_number > {latest:UInt64}',
            params: { latest: safeCursor.number },
          })
        },
      }),
    )
}

void main()
