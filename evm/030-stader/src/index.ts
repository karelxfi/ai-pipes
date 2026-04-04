import 'dotenv/config'
import path from 'node:path'
import { createClient } from '@clickhouse/client'
import { evmPortalStream, evmDecoder } from '@subsquid/pipes/evm'
import { clickhouseTarget } from '@subsquid/pipes/targets/clickhouse'
import { z } from 'zod'

// StakePoolManager implementation ABI (proxy at 0xcf5EA1b38380f6aF39068375516Daf40Ed70D299)
import { events as poolEvents } from './contracts/0x716df97ebc05ccb2745bf04cd67df75cf2d11ee9.js'
// Oracle events removed — signature mismatch with on-chain data

const env = z
  .object({
    CLICKHOUSE_USER: z.string(),
    CLICKHOUSE_PASSWORD: z.string(),
    CLICKHOUSE_URL: z.string(),
    CLICKHOUSE_DATABASE: z.string(),
  })
  .parse(process.env)

// Stader contracts on Ethereum
const STAKE_POOL_MANAGER = '0xcf5EA1b38380f6aF39068375516Daf40Ed70D299'
// Stader ETHx launched mid-2023 (~block 17,500,000)
const FROM_BLOCK = 17_500_000

function serializeJsonWithBigInt(obj: unknown): string {
  return JSON.stringify(obj, (_key, value) =>
    typeof value === 'bigint' ? value.toString() : value
  )
}

const poolDecoder = evmDecoder({
  range: { from: FROM_BLOCK },
  contracts: [STAKE_POOL_MANAGER],
  events: {
    deposited: poolEvents.Deposited,
    depositReferral: poolEvents.DepositReferral,
    ethTransferred: poolEvents.ETHTransferredToPool,
    transferredToWithdraw: poolEvents.TransferredETHToUserWithdrawManager,
  },
})

// Oracle decoder removed — event signatures don't match on-chain data

function toIso(d: any): string {
  return d.timestamp instanceof Date ? d.timestamp.toISOString() : new Date(Number(d.timestamp) * 1000).toISOString()
}

interface StaderEvent {
  block_number: number
  timestamp: string
  tx_hash: string
  tx_index: number
  log_index: number
  event_type: string
  caller: string
  owner: string
  eth_amount: string
  ethx_shares: string
  pool_id: number
  referral_id: string
  total_eth_balance: string
  total_ethx_supply: string
  sign: number
}

export async function main() {
  await evmPortalStream({
    id: 'stader-ethx-staking',
    portal: 'https://portal.sqd.dev/datasets/ethereum-mainnet',
    outputs: {
      pool: poolDecoder,
    },
  })
    .pipe(({ pool }) => {
      const events: StaderEvent[] = []

      for (const d of pool.deposited) {
        events.push({
          block_number: d.block.number, timestamp: toIso(d), tx_hash: d.rawEvent.transactionHash,
          tx_index: d.rawEvent.transactionIndex, log_index: d.rawEvent.logIndex,
          event_type: 'deposit', caller: d.event.caller, owner: d.event.owner,
          eth_amount: d.event.assets.toString(), ethx_shares: d.event.shares.toString(),
          pool_id: 0, referral_id: '', total_eth_balance: '0', total_ethx_supply: '0', sign: 1,
        })
      }

      for (const d of pool.depositReferral) {
        events.push({
          block_number: d.block.number, timestamp: toIso(d), tx_hash: d.rawEvent.transactionHash,
          tx_index: d.rawEvent.transactionIndex, log_index: d.rawEvent.logIndex,
          event_type: 'deposit_referral', caller: d.event.caller, owner: d.event.owner,
          eth_amount: d.event.assets.toString(), ethx_shares: d.event.shares.toString(),
          pool_id: 0, referral_id: d.event.referralId, total_eth_balance: '0', total_ethx_supply: '0', sign: 1,
        })
      }

      for (const d of pool.ethTransferred) {
        events.push({
          block_number: d.block.number, timestamp: toIso(d), tx_hash: d.rawEvent.transactionHash,
          tx_index: d.rawEvent.transactionIndex, log_index: d.rawEvent.logIndex,
          event_type: 'eth_to_pool', caller: '', owner: '',
          eth_amount: '0', ethx_shares: '0',
          pool_id: Number(d.event.poolId), referral_id: '',
          total_eth_balance: d.event.validatorCount.toString(), total_ethx_supply: '0', sign: 1,
        })
      }

      for (const d of pool.transferredToWithdraw) {
        events.push({
          block_number: d.block.number, timestamp: toIso(d), tx_hash: d.rawEvent.transactionHash,
          tx_index: d.rawEvent.transactionIndex, log_index: d.rawEvent.logIndex,
          event_type: 'eth_to_withdraw', caller: '', owner: '',
          eth_amount: d.event.amount.toString(), ethx_shares: '0',
          pool_id: 0, referral_id: '', total_eth_balance: '0', total_ethx_supply: '0', sign: 1,
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
          const events = (data as any).events as StaderEvent[]
          if (events.length === 0) return
          await store.insert({
            table: 'stader_events',
            values: events,
            format: 'JSONEachRow',
          })
        },
        onRollback: async ({ safeCursor, store }) => {
          await store.removeAllRows({
            tables: ['stader_events'],
            where: 'block_number > {latest:UInt64}',
            params: { latest: safeCursor.number },
          })
        },
      }),
    )
}

void main()
