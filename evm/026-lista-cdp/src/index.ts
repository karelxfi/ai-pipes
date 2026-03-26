import 'dotenv/config'
import path from 'node:path'
import { createClient } from '@clickhouse/client'
import { evmPortalStream, evmDecoder } from '@subsquid/pipes/evm'
import { clickhouseTarget } from '@subsquid/pipes/targets/clickhouse'
import { z } from 'zod'

// Implementation ABI (proxy at 0xB68443Ee3e828baD1526b3e0Bdf2Dfc6b1975ec4)
import { events as interactionEvents } from './contracts/0x7d482de96d35daa1ce48c7ab1f7264206adb439d.js'

const env = z
  .object({
    CLICKHOUSE_USER: z.string(),
    CLICKHOUSE_PASSWORD: z.string(),
    CLICKHOUSE_URL: z.string(),
    CLICKHOUSE_DATABASE: z.string(),
  })
  .parse(process.env)

// Interaction proxy on BSC
const INTERACTION = '0xB68443Ee3e828baD1526b3e0Bdf2Dfc6b1975ec4'

// Lista CDP (ex-Helio) started mid-2023
const FROM_BLOCK = 30_000_000

function serializeJsonWithBigInt(obj: unknown): string {
  return JSON.stringify(obj, (_key, value) =>
    typeof value === 'bigint' ? value.toString() : value
  )
}

const cdpDecoder = evmDecoder({
  range: { from: FROM_BLOCK },
  contracts: [INTERACTION],
  events: {
    deposit: interactionEvents.Deposit,
    borrow: interactionEvents.Borrow,
    payback: interactionEvents.Payback,
    withdraw: interactionEvents.Withdraw,
    liquidation: interactionEvents.Liquidation,
  },
})

function toIso(d: any): string {
  return d.timestamp instanceof Date ? d.timestamp.toISOString() : new Date(Number(d.timestamp) * 1000).toISOString()
}

interface CdpEvent {
  block_number: number
  timestamp: string
  tx_hash: string
  tx_index: number
  log_index: number
  event_type: string
  user_address: string
  collateral: string
  amount: string
  total_or_debt: string
  liquidation_price: string
  sign: number
}

export async function main() {
  await evmPortalStream({
    id: 'lista-cdp-events',
    portal: 'https://portal.sqd.dev/datasets/binance-mainnet',
    outputs: {
      cdp: cdpDecoder,
    },
  })
    .pipe(({ cdp }) => {
      const events: CdpEvent[] = []

      for (const d of cdp.deposit) {
        events.push({
          block_number: d.block.number, timestamp: toIso(d), tx_hash: d.rawEvent.transactionHash,
          tx_index: d.rawEvent.transactionIndex, log_index: d.rawEvent.logIndex,
          event_type: 'deposit', user_address: d.event.user, collateral: d.event.collateral,
          amount: d.event.amount.toString(), total_or_debt: d.event.totalAmount.toString(),
          liquidation_price: '0', sign: 1,
        })
      }

      for (const d of cdp.borrow) {
        events.push({
          block_number: d.block.number, timestamp: toIso(d), tx_hash: d.rawEvent.transactionHash,
          tx_index: d.rawEvent.transactionIndex, log_index: d.rawEvent.logIndex,
          event_type: 'borrow', user_address: d.event.user, collateral: d.event.collateral,
          amount: d.event.amount.toString(), total_or_debt: d.event.collateralAmount.toString(),
          liquidation_price: d.event.liquidationPrice.toString(), sign: 1,
        })
      }

      for (const d of cdp.payback) {
        events.push({
          block_number: d.block.number, timestamp: toIso(d), tx_hash: d.rawEvent.transactionHash,
          tx_index: d.rawEvent.transactionIndex, log_index: d.rawEvent.logIndex,
          event_type: 'payback', user_address: d.event.user, collateral: d.event.collateral,
          amount: d.event.amount.toString(), total_or_debt: d.event.debt.toString(),
          liquidation_price: d.event.liquidationPrice.toString(), sign: 1,
        })
      }

      for (const d of cdp.withdraw) {
        events.push({
          block_number: d.block.number, timestamp: toIso(d), tx_hash: d.rawEvent.transactionHash,
          tx_index: d.rawEvent.transactionIndex, log_index: d.rawEvent.logIndex,
          event_type: 'withdraw', user_address: d.event.user, collateral: '',
          amount: d.event.amount.toString(), total_or_debt: '0',
          liquidation_price: '0', sign: 1,
        })
      }

      for (const d of cdp.liquidation) {
        events.push({
          block_number: d.block.number, timestamp: toIso(d), tx_hash: d.rawEvent.transactionHash,
          tx_index: d.rawEvent.transactionIndex, log_index: d.rawEvent.logIndex,
          event_type: 'liquidation', user_address: d.event.user, collateral: d.event.collateral,
          amount: d.event.amount.toString(), total_or_debt: d.event.leftover.toString(),
          liquidation_price: '0', sign: 1,
        })
      }

      return { events }
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
          const events = (data as any).events as CdpEvent[]
          if (events.length === 0) return
          await store.insert({
            table: 'lista_cdp_events',
            values: events,
            format: 'JSONEachRow',
          })
        },
        onRollback: async ({ safeCursor, store }) => {
          await store.removeAllRows({
            tables: ['lista_cdp_events'],
            where: 'block_number > {latest:UInt64}',
            params: { latest: safeCursor.number },
          })
        },
      }),
    )
}

void main()
