import 'dotenv/config'
import path from 'node:path'
import { createClient } from '@clickhouse/client'
import { evmDecoder, evmPortalStream } from '@subsquid/pipes/evm'
import { clickhouseTarget } from '@subsquid/pipes/targets/clickhouse'
import { z } from 'zod'
import { events } from './contracts/monocooler.js'
import { enrichEvents, serializeJsonWithBigInt } from './utils/index.js'

const MONOCOOLER = '0xdb591Ea2e5Db886dA872654D58f6cc584b68e7cC'
const DEPLOYMENT_BLOCK = 22425730

const env = z.object({
  CLICKHOUSE_USER: z.string(),
  CLICKHOUSE_PASSWORD: z.string(),
  CLICKHOUSE_URL: z.string(),
  CLICKHOUSE_DATABASE: z.string(),
}).parse(process.env)

const decoder = evmDecoder({
  range: { from: String(DEPLOYMENT_BLOCK) },
  contracts: [MONOCOOLER],
  events: {
    Borrow: events.Borrow,
    Repay: events.Repay,
    CollateralAdded: events.CollateralAdded,
    CollateralWithdrawn: events.CollateralWithdrawn,
    Liquidated: events.Liquidated,
  },
}).pipe(enrichEvents)

export async function main() {
  await evmPortalStream({
    id: 'cooler-loans-lending-book',
    portal: 'https://portal.sqd.dev/datasets/ethereum-mainnet',
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
        // Loan lifecycle events: Borrow, Repay, CollateralAdded, CollateralWithdrawn
        for (const eventType of ['Borrow', 'Repay', 'CollateralAdded', 'CollateralWithdrawn'] as const) {
          const evts = data.decoder[eventType]
          if (evts.length > 0) {
            await store.insert({
              table: 'loan_events',
              values: evts.map(e => ({
                event_type: eventType,
                caller: e.caller,
                account: e.onBehalfOf ?? (e as any).account ?? e.caller,
                recipient: (e as any).recipient ?? '',
                amount: String((e as any).amount ?? (e as any).collateralAmount ?? (e as any).repayAmount ?? 0n),
                block_number: e.blockNumber,
                tx_hash: e.txHash,
                log_index: e.logIndex,
                timestamp: new Date(e.timestamp * 1000).toISOString(),
              })),
              format: 'JSONEachRow',
            })
          }
        }

        // Liquidations
        const liqs = data.decoder.Liquidated
        if (liqs.length > 0) {
          await store.insert({
            table: 'liquidations',
            values: liqs.map(e => ({
              caller: e.caller,
              account: e.account,
              collateral_seized: String(e.collateralSeized),
              debt_wiped: String(e.debtWiped),
              incentives: String(e.incentives),
              block_number: e.blockNumber,
              tx_hash: e.txHash,
              log_index: e.logIndex,
              timestamp: new Date(e.timestamp * 1000).toISOString(),
            })),
            format: 'JSONEachRow',
          })
        }
      },
      onRollback: async ({ safeCursor, store }) => {
        for (const table of ['loan_events', 'liquidations']) {
          await store.removeAllRows({
            tables: [table],
            where: 'block_number > {latest:UInt32}',
            params: { latest: safeCursor.number },
          })
        }
      },
    }),
  )
}

void main()
