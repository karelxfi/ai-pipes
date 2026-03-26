import 'dotenv/config'
import path from 'node:path'
import { createClient } from '@clickhouse/client'
import { evmPortalStream, evmDecoder } from '@subsquid/pipes/evm'
import { clickhouseTarget } from '@subsquid/pipes/targets/clickhouse'
import { z } from 'zod'

// sAVAX implementation ABI (proxy at 0x2b2C81e08f1Af8835a78Bb2A90AE924ACE0eA4bE)
import { events } from './contracts/0x0ce7f620eb645a4fbf688a1c1937bc6cb0cbdd29.js'

const env = z
  .object({
    CLICKHOUSE_USER: z.string(),
    CLICKHOUSE_PASSWORD: z.string(),
    CLICKHOUSE_URL: z.string(),
    CLICKHOUSE_DATABASE: z.string(),
  })
  .parse(process.env)

// sAVAX proxy contract on Avalanche C-Chain
const SAVAX_CONTRACT = '0x2b2C81e08f1Af8835a78Bb2A90AE924ACE0eA4bE'
// sAVAX deployed ~July 2021 on Avalanche (block ~3,000,000)
const FROM_BLOCK = 3_000_000

function serializeJsonWithBigInt(obj: unknown): string {
  return JSON.stringify(obj, (_key, value) =>
    typeof value === 'bigint' ? value.toString() : value
  )
}

const savaxDecoder = evmDecoder({
  range: { from: FROM_BLOCK },
  contracts: [SAVAX_CONTRACT],
  events: {
    submitted: events.Submitted,
    unlockRequested: events.UnlockRequested,
    unlockCancelled: events.UnlockCancelled,
    redeem: events.Redeem,
    redeemOverdue: events.RedeemOverdueShares,
    accrueRewards: events.AccrueRewards,
    deposit: events.Deposit,
    withdraw: events.Withdraw,
  },
})

function toIso(d: any): string {
  return d.timestamp instanceof Date
    ? d.timestamp.toISOString()
    : new Date(Number(d.timestamp) * 1000).toISOString()
}

interface SavaxEvent {
  block_number: number
  timestamp: string
  tx_hash: string
  tx_index: number
  log_index: number
  event_type: string
  user: string
  avax_amount: string
  share_amount: string
  reward_value: string
  total_shares: string
  unlock_requested_at: string
  sign: number
}

export async function main() {
  await evmPortalStream({
    id: 'benqi-savax-staking',
    portal: 'https://portal.sqd.dev/datasets/avalanche-mainnet',
    outputs: {
      savax: savaxDecoder,
    },
  })
    .pipe(({ savax }) => {
      const rows: SavaxEvent[] = []

      for (const d of savax.submitted) {
        rows.push({
          block_number: d.block.number,
          timestamp: toIso(d),
          tx_hash: d.rawEvent.transactionHash,
          tx_index: d.rawEvent.transactionIndex,
          log_index: d.rawEvent.logIndex,
          event_type: 'submitted',
          user: d.event.user,
          avax_amount: d.event.avaxAmount.toString(),
          share_amount: d.event.shareAmount.toString(),
          reward_value: '0',
          total_shares: '0',
          unlock_requested_at: '0',
          sign: 1,
        })
      }

      for (const d of savax.unlockRequested) {
        rows.push({
          block_number: d.block.number,
          timestamp: toIso(d),
          tx_hash: d.rawEvent.transactionHash,
          tx_index: d.rawEvent.transactionIndex,
          log_index: d.rawEvent.logIndex,
          event_type: 'unlock_requested',
          user: d.event.user,
          avax_amount: '0',
          share_amount: d.event.shareAmount.toString(),
          reward_value: '0',
          total_shares: '0',
          unlock_requested_at: '0',
          sign: 1,
        })
      }

      for (const d of savax.unlockCancelled) {
        rows.push({
          block_number: d.block.number,
          timestamp: toIso(d),
          tx_hash: d.rawEvent.transactionHash,
          tx_index: d.rawEvent.transactionIndex,
          log_index: d.rawEvent.logIndex,
          event_type: 'unlock_cancelled',
          user: d.event.user,
          avax_amount: '0',
          share_amount: d.event.shareAmount.toString(),
          reward_value: '0',
          total_shares: '0',
          unlock_requested_at: d.event.unlockRequestedAt.toString(),
          sign: 1,
        })
      }

      for (const d of savax.redeem) {
        rows.push({
          block_number: d.block.number,
          timestamp: toIso(d),
          tx_hash: d.rawEvent.transactionHash,
          tx_index: d.rawEvent.transactionIndex,
          log_index: d.rawEvent.logIndex,
          event_type: 'redeem',
          user: d.event.user,
          avax_amount: d.event.avaxAmount.toString(),
          share_amount: d.event.shareAmount.toString(),
          reward_value: '0',
          total_shares: '0',
          unlock_requested_at: d.event.unlockRequestedAt.toString(),
          sign: 1,
        })
      }

      for (const d of savax.redeemOverdue) {
        rows.push({
          block_number: d.block.number,
          timestamp: toIso(d),
          tx_hash: d.rawEvent.transactionHash,
          tx_index: d.rawEvent.transactionIndex,
          log_index: d.rawEvent.logIndex,
          event_type: 'redeem_overdue',
          user: d.event.user,
          avax_amount: '0',
          share_amount: d.event.shareAmount.toString(),
          reward_value: '0',
          total_shares: '0',
          unlock_requested_at: '0',
          sign: 1,
        })
      }

      for (const d of savax.accrueRewards) {
        rows.push({
          block_number: d.block.number,
          timestamp: toIso(d),
          tx_hash: d.rawEvent.transactionHash,
          tx_index: d.rawEvent.transactionIndex,
          log_index: d.rawEvent.logIndex,
          event_type: 'accrue_rewards',
          user: '',
          avax_amount: '0',
          share_amount: '0',
          reward_value: d.event.value.toString(),
          total_shares: '0',
          unlock_requested_at: '0',
          sign: 1,
        })
      }

      for (const d of savax.deposit) {
        rows.push({
          block_number: d.block.number,
          timestamp: toIso(d),
          tx_hash: d.rawEvent.transactionHash,
          tx_index: d.rawEvent.transactionIndex,
          log_index: d.rawEvent.logIndex,
          event_type: 'deposit',
          user: d.event.user,
          avax_amount: d.event.amount.toString(),
          share_amount: '0',
          reward_value: '0',
          total_shares: '0',
          unlock_requested_at: '0',
          sign: 1,
        })
      }

      for (const d of savax.withdraw) {
        rows.push({
          block_number: d.block.number,
          timestamp: toIso(d),
          tx_hash: d.rawEvent.transactionHash,
          tx_index: d.rawEvent.transactionIndex,
          log_index: d.rawEvent.logIndex,
          event_type: 'withdraw',
          user: d.event.user,
          avax_amount: d.event.amount.toString(),
          share_amount: '0',
          reward_value: '0',
          total_shares: '0',
          unlock_requested_at: '0',
          sign: 1,
        })
      }

      return { rows }
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
          const rows = (data as any).rows as SavaxEvent[]
          if (rows.length === 0) return
          await store.insert({
            table: 'savax_events',
            values: rows,
            format: 'JSONEachRow',
          })
        },
        onRollback: async ({ safeCursor, store }) => {
          await store.removeAllRows({
            tables: ['savax_events'],
            where: 'block_number > {latest:UInt64}',
            params: { latest: safeCursor.number },
          })
        },
      }),
    )
}

void main()
