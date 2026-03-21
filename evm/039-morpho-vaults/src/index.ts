import 'dotenv/config'
import path from 'node:path'
import { createClient } from '@clickhouse/client'
import { evmDecoder, evmPortalSource } from '@subsquid/pipes/evm'
import { clickhouseTarget } from '@subsquid/pipes/targets/clickhouse'
import { z } from 'zod'
import { events as metaMorphoEvents } from './contracts/0x833adaef212c5cd3f78906b44bbfb18258f238f0.js'

const env = z
  .object({
    CLICKHOUSE_USER: z.string(),
    CLICKHOUSE_PASSWORD: z.string(),
    CLICKHOUSE_URL: z.string(),
    CLICKHOUSE_DATABASE: z.string(),
  })
  .parse(process.env)

function serializeJsonWithBigInt(obj: unknown): string {
  return JSON.stringify(obj, (_key, value) =>
    typeof value === 'bigint' ? value.toString() : value
  )
}

// Morpho Blue deployed at block 18883124 (Jan 2024)
// MetaMorpho vaults started deploying shortly after
const FROM_BLOCK = 18_900_000

// Track curator reallocation events across ALL MetaMorpho vaults
// No contracts filter — topic0-only global filtering captures every vault
const reallocations = evmDecoder({
  range: { from: FROM_BLOCK },
  events: {
    ReallocateSupply: metaMorphoEvents.ReallocateSupply,
    ReallocateWithdraw: metaMorphoEvents.ReallocateWithdraw,
  },
})

interface ReallocationRow {
  block_number: number
  timestamp: string
  tx_hash: string
  log_index: number
  vault: string
  event_type: string
  caller: string
  market_id: string
  assets: string
  shares: string
  sign: number
}

export async function main() {
  await evmPortalSource({
    id: 'metamorpho-reallocations',
    portal: 'https://portal.sqd.dev/datasets/ethereum-mainnet',
    outputs: { reallocations },
  })
    .pipe(({ reallocations }) => {
      const rows: ReallocationRow[] = []

      for (const d of reallocations.ReallocateSupply) {
        rows.push({
          block_number: d.block.number,
          timestamp: d.timestamp.toISOString(),
          tx_hash: d.rawEvent.transactionHash,
          log_index: d.rawEvent.logIndex,
          vault: d.contract,
          event_type: 'supply',
          caller: d.event.caller,
          market_id: d.event.id,
          assets: d.event.suppliedAssets.toString(),
          shares: d.event.suppliedShares.toString(),
          sign: 1,
        })
      }

      for (const d of reallocations.ReallocateWithdraw) {
        rows.push({
          block_number: d.block.number,
          timestamp: d.timestamp.toISOString(),
          tx_hash: d.rawEvent.transactionHash,
          log_index: d.rawEvent.logIndex,
          vault: d.contract,
          event_type: 'withdraw',
          caller: d.event.caller,
          market_id: d.event.id,
          assets: d.event.withdrawnAssets.toString(),
          shares: d.event.withdrawnShares.toString(),
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
          const rows = (data as any).rows as ReallocationRow[]
          if (rows.length === 0) return
          await store.insert({
            table: 'vault_reallocations',
            values: rows,
            format: 'JSONEachRow',
          })
        },
        onRollback: async ({ safeCursor, store }) => {
          await store.removeAllRows({
            tables: ['vault_reallocations'],
            where: 'block_number > {latest:UInt64}',
            params: { latest: safeCursor.number },
          })
        },
      }),
    )
}

void main()
