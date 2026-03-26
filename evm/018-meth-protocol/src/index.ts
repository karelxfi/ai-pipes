import 'dotenv/config'
import path from 'node:path'
import { createClient } from '@clickhouse/client'
import { evmPortalStream, evmDecoder } from '@subsquid/pipes/evm'
import { clickhouseTarget } from '@subsquid/pipes/targets/clickhouse'
import { z } from 'zod'

// Implementation ABI (proxy at 0xe3cBd06D7dadB3F4e6557bAb7EdD924CD1489E8f)
import { events as stakingEvents } from './contracts/0x01a360392c74b5b8bf4973f438ff3983507a06a2.js'

const env = z
  .object({
    CLICKHOUSE_USER: z.string(),
    CLICKHOUSE_PASSWORD: z.string(),
    CLICKHOUSE_URL: z.string(),
    CLICKHOUSE_DATABASE: z.string(),
  })
  .parse(process.env)

// Staking proxy address on Ethereum mainnet
const STAKING = '0xe3cBd06D7dadB3F4e6557bAb7EdD924CD1489E8f'

// mETH launched ~Dec 2023 (block ~18,800,000)
const FROM_BLOCK = 18_800_000

function serializeJsonWithBigInt(obj: unknown): string {
  return JSON.stringify(obj, (_key, value) =>
    typeof value === 'bigint' ? value.toString() : value
  )
}

const stakingDecoder = evmDecoder({
  range: { from: FROM_BLOCK },
  contracts: [STAKING],
  events: {
    staked: stakingEvents.Staked,
    unstakeRequested: stakingEvents.UnstakeRequested,
    unstakeRequestClaimed: stakingEvents.UnstakeRequestClaimed,
    returnsReceived: stakingEvents.ReturnsReceived,
  },
})

function toIso(d: any): string {
  return d.timestamp instanceof Date ? d.timestamp.toISOString() : new Date(Number(d.timestamp) * 1000).toISOString()
}

interface MethEvent {
  block_number: number
  timestamp: string
  tx_hash: string
  tx_index: number
  log_index: number
  event_type: string
  staker: string
  eth_amount: string
  meth_amount: string
  unstake_id: number
  sign: number
}

export async function main() {
  await evmPortalStream({
    id: 'meth-protocol-staking',
    portal: 'https://portal.sqd.dev/datasets/ethereum-mainnet',
    outputs: {
      staking: stakingDecoder,
    },
  })
    .pipe(({ staking }) => {
      const events: MethEvent[] = []

      for (const d of staking.staked) {
        events.push({
          block_number: d.block.number,
          timestamp: toIso(d),
          tx_hash: d.rawEvent.transactionHash,
          tx_index: d.rawEvent.transactionIndex,
          log_index: d.rawEvent.logIndex,
          event_type: 'stake',
          staker: d.event.staker,
          eth_amount: d.event.ethAmount.toString(),
          meth_amount: d.event.mETHAmount.toString(),
          unstake_id: 0,
          sign: 1,
        })
      }

      for (const d of staking.unstakeRequested) {
        events.push({
          block_number: d.block.number,
          timestamp: toIso(d),
          tx_hash: d.rawEvent.transactionHash,
          tx_index: d.rawEvent.transactionIndex,
          log_index: d.rawEvent.logIndex,
          event_type: 'unstake_request',
          staker: d.event.staker,
          eth_amount: d.event.ethAmount.toString(),
          meth_amount: d.event.mETHLocked.toString(),
          unstake_id: Number(d.event.id),
          sign: 1,
        })
      }

      for (const d of staking.unstakeRequestClaimed) {
        events.push({
          block_number: d.block.number,
          timestamp: toIso(d),
          tx_hash: d.rawEvent.transactionHash,
          tx_index: d.rawEvent.transactionIndex,
          log_index: d.rawEvent.logIndex,
          event_type: 'unstake_claim',
          staker: d.event.staker,
          eth_amount: '0',
          meth_amount: '0',
          unstake_id: Number(d.event.id),
          sign: 1,
        })
      }

      for (const d of staking.returnsReceived) {
        events.push({
          block_number: d.block.number,
          timestamp: toIso(d),
          tx_hash: d.rawEvent.transactionHash,
          tx_index: d.rawEvent.transactionIndex,
          log_index: d.rawEvent.logIndex,
          event_type: 'returns',
          staker: '',
          eth_amount: d.event.amount.toString(),
          meth_amount: '0',
          unstake_id: 0,
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
          json: {
            stringify: serializeJsonWithBigInt,
          },
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
          const events = (data as any).events as MethEvent[]
          if (events.length === 0) return
          await store.insert({
            table: 'meth_events',
            values: events,
            format: 'JSONEachRow',
          })
        },
        onRollback: async ({ safeCursor, store }) => {
          await store.removeAllRows({
            tables: ['meth_events'],
            where: 'block_number > {latest:UInt64}',
            params: { latest: safeCursor.number },
          })
        },
      }),
    )
}

void main()
