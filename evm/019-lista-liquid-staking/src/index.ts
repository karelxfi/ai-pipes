import 'dotenv/config'
import path from 'node:path'
import { createClient } from '@clickhouse/client'
import { evmPortalSource, evmDecoder } from '@subsquid/pipes/evm'
import { clickhouseTarget } from '@subsquid/pipes/targets/clickhouse'
import { z } from 'zod'

import { events as stakeEvents } from './contracts/listaStakeManager.js'

const env = z
  .object({
    CLICKHOUSE_USER: z.string(),
    CLICKHOUSE_PASSWORD: z.string(),
    CLICKHOUSE_URL: z.string(),
    CLICKHOUSE_DATABASE: z.string(),
  })
  .parse(process.env)

// ListaStakeManager proxy on BSC
const STAKE_MANAGER = '0x1adB950d8bB3dA4bE104211D5AB038628e477fE6'

// Lista merged with Synclub mid-2023, contract deployed earlier
const FROM_BLOCK = 30_000_000

function serializeJsonWithBigInt(obj: unknown): string {
  return JSON.stringify(obj, (_key, value) =>
    typeof value === 'bigint' ? value.toString() : value
  )
}

const stakingDecoder = evmDecoder({
  range: { from: FROM_BLOCK },
  contracts: [STAKE_MANAGER],
  events: {
    deposit: stakeEvents.Deposit,
    requestWithdraw: stakeEvents.RequestWithdraw,
    claimWithdrawal: stakeEvents.ClaimWithdrawal,
  },
})

function toIso(d: any): string {
  return d.timestamp instanceof Date ? d.timestamp.toISOString() : new Date(Number(d.timestamp) * 1000).toISOString()
}

interface StakingEvent {
  block_number: number
  timestamp: string
  tx_hash: string
  event_type: string
  user_address: string
  amount: string
  withdraw_idx: number
  sign: number
}

export async function main() {
  await evmPortalSource({
    id: 'lista-liquid-staking',
    portal: 'https://portal.sqd.dev/datasets/binance-mainnet',
    outputs: {
      staking: stakingDecoder,
    },
  })
    .pipe(({ staking }) => {
      const events: StakingEvent[] = []

      for (const d of staking.deposit) {
        events.push({
          block_number: d.block.number,
          timestamp: toIso(d),
          tx_hash: d.rawEvent.transactionHash,
          event_type: 'deposit',
          user_address: d.event.dst,
          amount: d.event.wad.toString(),
          withdraw_idx: 0,
          sign: 1,
        })
      }

      for (const d of staking.requestWithdraw) {
        events.push({
          block_number: d.block.number,
          timestamp: toIso(d),
          tx_hash: d.rawEvent.transactionHash,
          event_type: 'request_withdraw',
          user_address: d.event.user,
          amount: d.event.amount.toString(),
          withdraw_idx: 0,
          sign: 1,
        })
      }

      for (const d of staking.claimWithdrawal) {
        events.push({
          block_number: d.block.number,
          timestamp: toIso(d),
          tx_hash: d.rawEvent.transactionHash,
          event_type: 'claim_withdrawal',
          user_address: d.event.user,
          amount: d.event.amount.toString(),
          withdraw_idx: Number(d.event.idx),
          sign: 1,
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
          const events = (data as any).events as StakingEvent[]
          if (events.length === 0) return
          await store.insert({
            table: 'lista_staking_events',
            values: events,
            format: 'JSONEachRow',
          })
        },
        onRollback: async ({ safeCursor, store }) => {
          await store.removeAllRows({
            tables: ['lista_staking_events'],
            where: 'block_number > {latest:UInt64}',
            params: { latest: safeCursor.number },
          })
        },
      }),
    )
}

void main()
