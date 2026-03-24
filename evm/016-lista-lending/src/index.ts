import 'dotenv/config'
import path from 'node:path'
import { createClient } from '@clickhouse/client'
import { evmPortalStream, evmDecoder } from '@subsquid/pipes/evm'
import { clickhouseTarget } from '@subsquid/pipes/targets/clickhouse'
import { z } from 'zod'

import { events as moolahEvents } from './contracts/0x0af5cd9555bc52c34a5f7b20042109d0136bc34f.js'

const env = z
  .object({
    CLICKHOUSE_USER: z.string(),
    CLICKHOUSE_PASSWORD: z.string(),
    CLICKHOUSE_URL: z.string(),
    CLICKHOUSE_DATABASE: z.string(),
  })
  .parse(process.env)

// Moolah proxy address on BSC (implementation ABI loaded above)
const MOOLAH = '0x8F73b65B4caAf64FBA2aF91cC5D4a2A1318E5D8C'

// First event at block ~49,002,093 (May 2025)
const FROM_BLOCK = 49_000_000

function serializeJsonWithBigInt(obj: unknown): string {
  return JSON.stringify(obj, (_key, value) =>
    typeof value === 'bigint' ? value.toString() : value
  )
}

// Lending events (Supply, Withdraw, Borrow, Repay, SupplyCollateral, WithdrawCollateral)
const lendingDecoder = evmDecoder({
  range: { from: FROM_BLOCK },
  contracts: [MOOLAH],
  events: {
    supply: moolahEvents.Supply,
    withdraw: moolahEvents.Withdraw,
    borrow: moolahEvents.Borrow,
    repay: moolahEvents.Repay,
    supplyCollateral: moolahEvents.SupplyCollateral,
    withdrawCollateral: moolahEvents.WithdrawCollateral,
  },
})

// Interest accrual events
const interestDecoder = evmDecoder({
  range: { from: FROM_BLOCK },
  contracts: [MOOLAH],
  events: {
    accrueInterest: moolahEvents.AccrueInterest,
  },
})

// Flash loan events
const flashDecoder = evmDecoder({
  range: { from: FROM_BLOCK },
  contracts: [MOOLAH],
  events: {
    flashLoan: moolahEvents.FlashLoan,
  },
})

function toIso(d: any): string {
  return d.timestamp instanceof Date ? d.timestamp.toISOString() : new Date(Number(d.timestamp) * 1000).toISOString()
}

export async function main() {
  await evmPortalStream({
    id: 'lista-lending-moolah',
    portal: 'https://portal.sqd.dev/datasets/binance-mainnet',
    outputs: {
      lending: lendingDecoder,
      interest: interestDecoder,
      flash: flashDecoder,
    },
  })
    .pipe(({ lending, interest, flash }) => {
      const events: any[] = []

      const mapLending = (items: any[], eventType: string) => {
        for (const d of items) {
          events.push({
            block_number: d.block.number,
            timestamp: toIso(d),
            tx_hash: d.rawEvent.transactionHash,
            event_type: eventType,
            market_id: d.event.id,
            caller: d.event.caller ?? '',
            on_behalf: d.event.onBehalf ?? '',
            receiver: d.event.receiver ?? '',
            assets: (d.event.assets ?? 0n).toString(),
            shares: (d.event.shares ?? 0n).toString(),
            sign: 1,
          })
        }
      }

      mapLending(lending.supply, 'Supply')
      mapLending(lending.withdraw, 'Withdraw')
      mapLending(lending.borrow, 'Borrow')
      mapLending(lending.repay, 'Repay')
      mapLending(lending.supplyCollateral, 'SupplyCollateral')
      mapLending(lending.withdrawCollateral, 'WithdrawCollateral')

      const interestRows = interest.accrueInterest.map((d: any) => ({
        block_number: d.block.number,
        timestamp: toIso(d),
        tx_hash: d.rawEvent.transactionHash,
        market_id: d.event.id,
        prev_borrow_rate: d.event.prevBorrowRate.toString(),
        interest: d.event.interest.toString(),
        fee_shares: d.event.feeShares.toString(),
        sign: 1,
      }))

      const flashRows = flash.flashLoan.map((d: any) => ({
        block_number: d.block.number,
        timestamp: toIso(d),
        tx_hash: d.rawEvent.transactionHash,
        caller: d.event.caller,
        token: d.event.token,
        assets: d.event.assets.toString(),
        sign: 1,
      }))

      return { events, interestRows, flashRows }
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
          if (data.events.length > 0) {
            await store.insert({ table: 'moolah_events', values: data.events, format: 'JSONEachRow' })
          }
          if (data.interestRows.length > 0) {
            await store.insert({ table: 'moolah_interest', values: data.interestRows, format: 'JSONEachRow' })
          }
          if (data.flashRows.length > 0) {
            await store.insert({ table: 'moolah_flash_loans', values: data.flashRows, format: 'JSONEachRow' })
          }
        },
        onRollback: async ({ safeCursor, store }) => {
          await store.removeAllRows({
            tables: ['moolah_events', 'moolah_interest', 'moolah_flash_loans'],
            where: 'block_number > {latest:UInt64}',
            params: { latest: safeCursor.number },
          })
        },
      }),
    )
}

void main()
