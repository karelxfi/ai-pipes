import 'dotenv/config'
import path from 'node:path'
import { createClient } from '@clickhouse/client'
import { evmPortalStream, evmDecoder } from '@subsquid/pipes/evm'
import { clickhouseTarget } from '@subsquid/pipes/targets/clickhouse'
import { z } from 'zod'
import { events as troveManagerEvents } from './contracts/0xA39739EF8b0231DbFA0DcdA07d7e29faAbCf4bb2.js'

const env = z
  .object({
    CLICKHOUSE_USER: z.string(),
    CLICKHOUSE_PASSWORD: z.string(),
    CLICKHOUSE_URL: z.string(),
    CLICKHOUSE_DATABASE: z.string(),
  })
  .parse(process.env)

const TROVE_MANAGER = '0xa39739ef8b0231dbfa0dcda07d7e29faabcf4bb2'

// TroveManager operation enum
const TM_OPERATIONS: Record<number, string> = {
  0: 'applyPendingRewards',
  1: 'liquidateInNormalMode',
  2: 'liquidateInRecoveryMode',
  3: 'redeemCollateral',
}

const WEI = 1e18

interface TroveEvent {
  block_number: number
  timestamp: string
  tx_hash: string
  tx_index: number
  log_index: number
  event_type: string
  borrower: string
  debt_lusd: number
  coll_eth: number
  operation: string
  sign: number
}

// Decode TroveUpdated, TroveLiquidated, Redemption, and Liquidation events
const troveDecoder = evmDecoder({
  range: { from: 12_178_557 },
  contracts: [TROVE_MANAGER],
  events: {
    TroveUpdated: troveManagerEvents.TroveUpdated,
    TroveLiquidated: troveManagerEvents.TroveLiquidated,
    Redemption: troveManagerEvents.Redemption,
    Liquidation: troveManagerEvents.Liquidation,
  },
}).pipe(({ TroveUpdated, TroveLiquidated, Redemption, Liquidation }) => {
  const rows: TroveEvent[] = []

  for (const d of TroveUpdated) {
    rows.push({
      block_number: d.block.number,
      timestamp: d.timestamp.toISOString(),
      tx_hash: d.rawEvent.transactionHash,
      tx_index: d.rawEvent.transactionIndex,
      log_index: d.rawEvent.logIndex,
      event_type: 'TroveUpdated',
      borrower: d.event._borrower,
      debt_lusd: Number(d.event._debt) / WEI,
      coll_eth: Number(d.event._coll) / WEI,
      operation: TM_OPERATIONS[d.event._operation] ?? `unknown_${d.event._operation}`,
      sign: 1,
    })
  }

  for (const d of TroveLiquidated) {
    rows.push({
      block_number: d.block.number,
      timestamp: d.timestamp.toISOString(),
      tx_hash: d.rawEvent.transactionHash,
      tx_index: d.rawEvent.transactionIndex,
      log_index: d.rawEvent.logIndex,
      event_type: 'TroveLiquidated',
      borrower: d.event._borrower,
      debt_lusd: Number(d.event._debt) / WEI,
      coll_eth: Number(d.event._coll) / WEI,
      operation: TM_OPERATIONS[d.event._operation] ?? `unknown_${d.event._operation}`,
      sign: 1,
    })
  }

  for (const d of Redemption) {
    rows.push({
      block_number: d.block.number,
      timestamp: d.timestamp.toISOString(),
      tx_hash: d.rawEvent.transactionHash,
      tx_index: d.rawEvent.transactionIndex,
      log_index: d.rawEvent.logIndex,
      event_type: 'Redemption',
      borrower: '',
      debt_lusd: Number(d.event._actualLUSDAmount) / WEI,
      coll_eth: Number(d.event._ETHSent) / WEI,
      operation: 'redemption',
      sign: 1,
    })
  }

  for (const d of Liquidation) {
    rows.push({
      block_number: d.block.number,
      timestamp: d.timestamp.toISOString(),
      tx_hash: d.rawEvent.transactionHash,
      tx_index: d.rawEvent.transactionIndex,
      log_index: d.rawEvent.logIndex,
      event_type: 'Liquidation',
      borrower: '',
      debt_lusd: Number(d.event._liquidatedDebt) / WEI,
      coll_eth: Number(d.event._liquidatedColl) / WEI,
      operation: 'liquidation',
      sign: 1,
    })
  }

  return { rows }
})

export async function main() {
  await evmPortalStream({
    id: 'liquity-v1-troves',
    portal: 'https://portal.sqd.dev/datasets/ethereum-mainnet',
    outputs: { troveDecoder },
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
          },
        }),
        onStart: async ({ store }) => {
          const migrationsDir = path.join(process.cwd(), 'migrations')
          await store.executeFiles(migrationsDir)
        },
        onData: async ({ data, store }) => {
          const rows = data.troveDecoder.rows as TroveEvent[]
          if (rows.length === 0) return
          await store.insert({
            table: 'trove_events',
            values: rows,
            format: 'JSONEachRow',
          })
        },
        onRollback: async ({ safeCursor, store }) => {
          await store.removeAllRows({
            tables: ['trove_events'],
            where: 'block_number > {latest:UInt64}',
            params: { latest: safeCursor.number },
          })
        },
      }),
    )
}

void main()
