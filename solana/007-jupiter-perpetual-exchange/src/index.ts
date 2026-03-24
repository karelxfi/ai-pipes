import 'dotenv/config'
import path from 'node:path'
import { createClient } from '@clickhouse/client'
import { solanaPortalStream, solanaQuery } from '@subsquid/pipes/solana'
import { clickhouseTarget } from '@subsquid/pipes/targets/clickhouse'
import { z } from 'zod'
import * as perps from './abi/perpetuals/index.js'

const env = z
  .object({
    CLICKHOUSE_USER: z.string(),
    CLICKHOUSE_PASSWORD: z.string(),
    CLICKHOUSE_URL: z.string(),
    CLICKHOUSE_DATABASE: z.string(),
  })
  .parse(process.env)

// Start from ~Mar 2025 (slot 385M) — recent high activity
const FROM_SLOT = 385_000_000

// Position-related instruction d8 values we want to track
const TRACKED_D8 = [
  perps.instructions.instantIncreasePosition.d8,
  perps.instructions.instantDecreasePosition.d8,
  perps.instructions.increasePosition4.d8,
  perps.instructions.decreasePosition4.d8,
  perps.instructions.liquidateFullPosition4.d8,
  perps.instructions.instantCreateTpsl.d8,
  perps.instructions.instantCreateLimitOrder.d8,
  perps.instructions.decreasePositionWithTpsl.d8,
  perps.instructions.instantIncreasePositionPreSwap.d8,
  perps.instructions.closePositionRequest2.d8,
  perps.instructions.createDecreasePositionMarketRequest.d8,
]

// Map d8 to action name
const D8_TO_ACTION: Record<string, string> = {
  [perps.instructions.instantIncreasePosition.d8]: 'open_long_short',
  [perps.instructions.instantDecreasePosition.d8]: 'close_position',
  [perps.instructions.increasePosition4.d8]: 'keeper_increase',
  [perps.instructions.decreasePosition4.d8]: 'keeper_decrease',
  [perps.instructions.liquidateFullPosition4.d8]: 'liquidation',
  [perps.instructions.instantCreateTpsl.d8]: 'create_tpsl',
  [perps.instructions.instantCreateLimitOrder.d8]: 'create_limit',
  [perps.instructions.decreasePositionWithTpsl.d8]: 'decrease_with_tpsl',
  [perps.instructions.instantIncreasePositionPreSwap.d8]: 'increase_preswap',
  [perps.instructions.closePositionRequest2.d8]: 'close_request',
  [perps.instructions.createDecreasePositionMarketRequest.d8]: 'decrease_market_request',
}

interface PerpPosition {
  slot: number
  timestamp: string
  tx_signature: string
  action: string
  owner: string
  custody: string
  side: string
  size_usd_delta: string
  collateral_delta: string
  sign: number
}

function serializeJsonWithBigInt(obj: unknown): string {
  return JSON.stringify(obj, (_key, value) =>
    typeof value === 'bigint' ? value.toString() : value
  )
}

const query = solanaQuery()
  .addFields({
    block: { number: true, timestamp: true },
    transaction: { transactionIndex: true, signatures: true },
    instruction: {
      transactionIndex: true,
      programId: true,
      data: true,
      accounts: true,
    },
  })
  .addInstruction({
    range: { from: FROM_SLOT },
    request: {
      programId: [perps.programId],
      d8: TRACKED_D8,
      isCommitted: true,
      transaction: true,
    },
  })

export async function main() {
  await solanaPortalStream({
    id: 'jupiter-perps',
    portal: 'https://portal.sqd.dev/datasets/solana-mainnet',
    outputs: query,
  })
    .pipe((blocks: any[]) => {
      const positions: PerpPosition[] = []

      for (const block of blocks) {
        if (!block.instructions) continue

        for (const ins of block.instructions) {
          if (ins.programId !== perps.programId) continue

          // Decode each instruction type with its typed decoder
          let action = ''
          let owner = ''
          let custody = ''
          let side = 'n/a'
          let sizeUsdDelta = 0n
          let collateralDelta = 0n

          // Each decode() throws if d8 doesn't match — use try/catch chain
          try {
            const d = perps.instructions.instantIncreasePosition.decode(ins)
            action = 'open_position'
            owner = d.accounts.owner; custody = d.accounts.custody
            side = d.data.params.side.kind
            sizeUsdDelta = d.data.params.sizeUsdDelta
            collateralDelta = d.data.params.collateralTokenDelta ?? 0n
          } catch { try {
            const d = perps.instructions.instantDecreasePosition.decode(ins)
            action = 'close_position'
            owner = d.accounts.owner; custody = d.accounts.custody
            sizeUsdDelta = d.data.params.sizeUsdDelta
            collateralDelta = d.data.params.collateralUsdDelta
          } catch { try {
            const d = perps.instructions.instantDecreasePosition2.decode(ins)
            action = 'close_position'
            owner = d.accounts.owner; custody = d.accounts.custody
            sizeUsdDelta = d.data.params.sizeUsdDelta
            collateralDelta = d.data.params.collateralUsdDelta
          } catch { try {
            const d = perps.instructions.increasePosition4.decode(ins)
            action = 'keeper_increase'
            owner = d.accounts.keeper; custody = d.accounts.custody
          } catch { try {
            const d = perps.instructions.decreasePosition4.decode(ins)
            action = 'keeper_decrease'
            owner = d.accounts.keeper; custody = d.accounts.custody
          } catch { try {
            const d = perps.instructions.liquidateFullPosition4.decode(ins)
            action = 'liquidation'
            owner = d.accounts.signer; custody = d.accounts.custody
          } catch { try {
            const d = perps.instructions.instantCreateTpsl.decode(ins)
            action = 'create_tpsl'
            owner = d.accounts.owner; custody = d.accounts.custody
          } catch { try {
            const d = perps.instructions.instantCreateLimitOrder.decode(ins)
            action = 'create_limit_order'
            owner = d.accounts.owner; custody = d.accounts.custody
            side = d.data.params.side.kind
            sizeUsdDelta = d.data.params.sizeUsdDelta
          } catch { try {
            const d = perps.instructions.decreasePositionWithTpsl.decode(ins)
            action = 'decrease_with_tpsl'
            owner = d.accounts.owner; custody = d.accounts.custody
          } catch { try {
            const d = perps.instructions.instantIncreasePositionPreSwap.decode(ins)
            action = 'increase_preswap'
            owner = d.accounts.owner
          } catch { try {
            const d = perps.instructions.closePositionRequest2.decode(ins)
            action = 'close_request'
            owner = d.accounts.owner
          } catch { try {
            const d = perps.instructions.createDecreasePositionMarketRequest.decode(ins)
            action = 'decrease_market_request'
            owner = d.accounts.owner
            sizeUsdDelta = d.data.params.sizeUsdDelta
            collateralDelta = d.data.params.collateralUsdDelta
          } catch {
            continue // Unknown instruction — skip
          } } } } } } } } } } } }

          if (!action) continue

          const tx = block.transactions?.find(
            (t: any) => t.transactionIndex === ins.transactionIndex
          )
          const txSignature = tx?.signatures?.[0] ?? ''

          positions.push({
            slot: block.header.number,
            timestamp: new Date(block.header.timestamp * 1000).toISOString(),
            tx_signature: txSignature,
            action,
            owner,
            custody,
            side,
            size_usd_delta: sizeUsdDelta.toString(),
            collateral_delta: collateralDelta.toString(),
            sign: 1,
          })
        }
      }

      return { positions }
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
          const positions = data.positions as PerpPosition[]
          if (positions.length === 0) return
          await store.insert({
            table: 'perp_positions',
            values: positions,
            format: 'JSONEachRow',
          })
        },
        onRollback: async ({ safeCursor, store }) => {
          await store.removeAllRows({
            tables: ['perp_positions'],
            where: 'slot > {latest:UInt64}',
            params: { latest: safeCursor.number },
          })
        },
      }),
    )
}

void main()
