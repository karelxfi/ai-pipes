import 'dotenv/config'
import path from 'node:path'
import { createClient } from '@clickhouse/client'
import { evmDecoder, evmPortalStream } from '@subsquid/pipes/evm'
import { clickhouseTarget } from '@subsquid/pipes/targets/clickhouse'
import { z } from 'zod'
import { events } from './contracts/userSafeEventEmitter.js'
import { enrichEvents, serializeJsonWithBigInt } from './utils/index.js'

const USER_SAFE_EVENT_EMITTER = '0x5423885B376eBb4e6104b8Ab1A908D350F6A162e'
const DEPLOYMENT_BLOCK = 11000000

const env = z.object({
  CLICKHOUSE_USER: z.string(),
  CLICKHOUSE_PASSWORD: z.string(),
  CLICKHOUSE_URL: z.string(),
  CLICKHOUSE_DATABASE: z.string(),
}).parse(process.env)

const decoder = evmDecoder({
  range: { from: String(DEPLOYMENT_BLOCK) },
  contracts: [USER_SAFE_EVENT_EMITTER],
  events: {
    Spend: events.Spend,
    Cashback: events.Cashback,
    AddCollateral: events.AddCollateralToDebtManager,
    Borrow: events.BorrowFromDebtManager,
    Repay: events.RepayDebtManager,
    WithdrawCollateral: events.WithdrawCollateralFromDebtManager,
    Swap: events.Swap,
  },
}).pipe(enrichEvents)

export async function main() {
  await evmPortalStream({
    id: 'etherfi-cash-credit-card',
    portal: 'https://portal.sqd.dev/datasets/scroll-mainnet',
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
        // Cash events: Spend + Cashback
        const spends = data.decoder.Spend
        if (spends.length > 0) {
          await store.insert({
            table: 'cash_events',
            values: spends.map(e => ({
              event_type: 'Spend',
              user_safe: e.userSafe,
              token: e.token,
              amount: String(e.amount),
              amount_usd: String(e.amountInUsd),
              mode: Number(e.mode),
              cashback_paid: 0,
              block_number: e.blockNumber,
              tx_hash: e.txHash,
              log_index: e.logIndex,
              timestamp: new Date(e.timestamp * 1000).toISOString(),
            })),
            format: 'JSONEachRow',
          })
        }

        const cashbacks = data.decoder.Cashback
        if (cashbacks.length > 0) {
          await store.insert({
            table: 'cash_events',
            values: cashbacks.map(e => ({
              event_type: 'Cashback',
              user_safe: e.userSafe,
              token: e.cashbackToken,
              amount: String(e.cashbackAmount),
              amount_usd: String(e.cashbackInUsd),
              mode: 0,
              cashback_paid: e.paid ? 1 : 0,
              block_number: e.blockNumber,
              tx_hash: e.txHash,
              log_index: e.logIndex,
              timestamp: new Date(e.timestamp * 1000).toISOString(),
            })),
            format: 'JSONEachRow',
          })
        }

        // Debt events: AddCollateral, Borrow, Repay, WithdrawCollateral
        for (const [eventType, key] of [
          ['AddCollateral', 'AddCollateral'],
          ['Borrow', 'Borrow'],
          ['WithdrawCollateral', 'WithdrawCollateral'],
        ] as const) {
          const evts = data.decoder[key]
          if (evts.length > 0) {
            await store.insert({
              table: 'debt_events',
              values: evts.map(e => ({
                event_type: eventType,
                user_safe: e.userSafe,
                token: e.token,
                amount: String(e.amount),
                amount_usd: '0',
                block_number: e.blockNumber,
                tx_hash: e.txHash,
                log_index: e.logIndex,
                timestamp: new Date(e.timestamp * 1000).toISOString(),
              })),
              format: 'JSONEachRow',
            })
          }
        }

        // Repay has debtAmount + debtAmountInUsd
        const repays = data.decoder.Repay
        if (repays.length > 0) {
          await store.insert({
            table: 'debt_events',
            values: repays.map(e => ({
              event_type: 'Repay',
              user_safe: e.userSafe,
              token: e.token,
              amount: String(e.debtAmount),
              amount_usd: String(e.debtAmountInUsd),
              block_number: e.blockNumber,
              tx_hash: e.txHash,
              log_index: e.logIndex,
              timestamp: new Date(e.timestamp * 1000).toISOString(),
            })),
            format: 'JSONEachRow',
          })
        }

        // Swaps
        const swaps = data.decoder.Swap
        if (swaps.length > 0) {
          await store.insert({
            table: 'swaps',
            values: swaps.map(e => ({
              user_safe: e.userSafe,
              input_token: e.inputToken,
              input_amount: String(e.inputAmount),
              output_token: e.outputToken,
              output_amount: String(e.outputAmount),
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
        for (const table of ['cash_events', 'debt_events', 'swaps']) {
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
