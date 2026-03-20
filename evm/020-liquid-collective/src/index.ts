import 'dotenv/config'
import path from 'node:path'
import { createClient } from '@clickhouse/client'
import { evmPortalSource, evmDecoder } from '@subsquid/pipes/evm'
import { clickhouseTarget } from '@subsquid/pipes/targets/clickhouse'
import { z } from 'zod'

// Implementation ABI (proxy at 0x8c1BEd5b9a0928467c9B1341Da1D7BD5e10b6549)
import { events as riverEvents } from './contracts/0x34e4617764cc94620170aa0e6652ad328d196d58.js'

const env = z
  .object({
    CLICKHOUSE_USER: z.string(),
    CLICKHOUSE_PASSWORD: z.string(),
    CLICKHOUSE_URL: z.string(),
    CLICKHOUSE_DATABASE: z.string(),
  })
  .parse(process.env)

// River proxy on Ethereum mainnet
const RIVER = '0x8c1BEd5b9a0928467c9B1341Da1D7BD5e10b6549'

// River deployed ~April 2024 (block ~19,658,000)
const FROM_BLOCK = 19_650_000

function serializeJsonWithBigInt(obj: unknown): string {
  return JSON.stringify(obj, (_key, value) =>
    typeof value === 'bigint' ? value.toString() : value
  )
}

const riverDecoder = evmDecoder({
  range: { from: FROM_BLOCK },
  contracts: [RIVER],
  events: {
    userDeposit: riverEvents.UserDeposit,
    clDataUpdate: riverEvents.ConsensusLayerDataUpdate,
    rewardsEarned: riverEvents.RewardsEarned,
    validatorCount: riverEvents.SetDepositedValidatorCount,
  },
})

function toIso(d: any): string {
  return d.timestamp instanceof Date ? d.timestamp.toISOString() : new Date(Number(d.timestamp) * 1000).toISOString()
}

interface LcEvent {
  block_number: number
  timestamp: string
  tx_hash: string
  event_type: string
  depositor: string
  recipient: string
  amount: string
  validator_count: number
  validator_balance: string
  old_total_balance: string
  new_total_balance: string
  old_total_supply: string
  new_total_supply: string
  sign: number
}

export async function main() {
  await evmPortalSource({
    id: 'liquid-collective-staking',
    portal: 'https://portal.sqd.dev/datasets/ethereum-mainnet',
    outputs: {
      river: riverDecoder,
    },
  })
    .pipe(({ river }) => {
      const events: LcEvent[] = []

      for (const d of river.userDeposit) {
        events.push({
          block_number: d.block.number,
          timestamp: toIso(d),
          tx_hash: d.rawEvent.transactionHash,
          event_type: 'deposit',
          depositor: d.event.depositor,
          recipient: d.event.recipient,
          amount: d.event.amount.toString(),
          validator_count: 0,
          validator_balance: '0',
          old_total_balance: '0', new_total_balance: '0',
          old_total_supply: '0', new_total_supply: '0',
          sign: 1,
        })
      }

      for (const d of river.clDataUpdate) {
        events.push({
          block_number: d.block.number,
          timestamp: toIso(d),
          tx_hash: d.rawEvent.transactionHash,
          event_type: 'oracle_report',
          depositor: '', recipient: '',
          amount: '0',
          validator_count: Number(d.event.validatorCount),
          validator_balance: d.event.validatorTotalBalance.toString(),
          old_total_balance: '0', new_total_balance: '0',
          old_total_supply: '0', new_total_supply: '0',
          sign: 1,
        })
      }

      for (const d of river.rewardsEarned) {
        events.push({
          block_number: d.block.number,
          timestamp: toIso(d),
          tx_hash: d.rawEvent.transactionHash,
          event_type: 'rewards',
          depositor: '', recipient: d.event._collector,
          amount: '0',
          validator_count: 0,
          validator_balance: '0',
          old_total_balance: d.event._oldTotalUnderlyingBalance.toString(),
          new_total_balance: d.event._newTotalUnderlyingBalance.toString(),
          old_total_supply: d.event._oldTotalSupply.toString(),
          new_total_supply: d.event._newTotalSupply.toString(),
          sign: 1,
        })
      }

      for (const d of river.validatorCount) {
        events.push({
          block_number: d.block.number,
          timestamp: toIso(d),
          tx_hash: d.rawEvent.transactionHash,
          event_type: 'validator_funded',
          depositor: '', recipient: '',
          amount: '0',
          validator_count: Number(d.event.newDepositedValidatorCount),
          validator_balance: '0',
          old_total_balance: '0', new_total_balance: '0',
          old_total_supply: '0', new_total_supply: '0',
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
          const events = (data as any).events as LcEvent[]
          if (events.length === 0) return
          await store.insert({
            table: 'lc_events',
            values: events,
            format: 'JSONEachRow',
          })
        },
        onRollback: async ({ safeCursor, store }) => {
          await store.removeAllRows({
            tables: ['lc_events'],
            where: 'block_number > {latest:UInt64}',
            params: { latest: safeCursor.number },
          })
        },
      }),
    )
}

void main()
