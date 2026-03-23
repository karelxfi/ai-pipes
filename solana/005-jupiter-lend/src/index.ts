import 'dotenv/config'
import path from 'node:path'
import { createClient } from '@clickhouse/client'
import { solanaPortalSource, SolanaQueryBuilder } from '@subsquid/pipes/solana'
import { clickhouseTarget } from '@subsquid/pipes/targets/clickhouse'
import { z } from 'zod'
import * as liquidity from './abi/liquidity/index.js'

const env = z
  .object({
    CLICKHOUSE_USER: z.string(),
    CLICKHOUSE_PASSWORD: z.string(),
    CLICKHOUSE_URL: z.string(),
    CLICKHOUSE_DATABASE: z.string(),
  })
  .parse(process.env)

// Start from ~Feb 2025 (slot 375M) — activity picks up around 380M
const FROM_SLOT = 375_000_000

interface LiquidityOp {
  slot: number
  timestamp: string
  tx_signature: string
  protocol: string
  token_reserve: string
  mint: string
  supply_amount: string
  borrow_amount: string
  op_type: string
  sign: number
}

function serializeJsonWithBigInt(obj: unknown): string {
  return JSON.stringify(obj, (_key, value) =>
    typeof value === 'bigint' ? value.toString() : value
  )
}

// Classify operation type from supply/borrow amounts
function classifyOp(supplyAmount: bigint, borrowAmount: bigint): string {
  if (supplyAmount > 0n && borrowAmount === 0n) return 'supply'
  if (supplyAmount < 0n && borrowAmount === 0n) return 'withdraw'
  if (borrowAmount > 0n && supplyAmount === 0n) return 'borrow'
  if (borrowAmount < 0n && supplyAmount === 0n) return 'payback'
  if (supplyAmount > 0n && borrowAmount > 0n) return 'supply+borrow'
  if (supplyAmount > 0n && borrowAmount < 0n) return 'supply+payback'
  if (supplyAmount < 0n && borrowAmount > 0n) return 'withdraw+borrow'
  if (supplyAmount < 0n && borrowAmount < 0n) return 'withdraw+payback'
  return 'noop'
}

// Query: fetch `operate` instructions from Liquidity program
const query = new SolanaQueryBuilder()
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
      programId: [liquidity.programId],
      d8: [liquidity.instructions.operate.d8],
      isCommitted: true,
      transaction: true,
      innerInstructions: true,  // operate is always called via CPI from Lending/Vaults programs
    },
  })

export async function main() {
  await solanaPortalSource({
    id: 'jupiter-lend-ops',
    portal: 'https://portal.sqd.dev/datasets/solana-mainnet',
    outputs: query,
  })
    .pipe((blocks: any[]) => {
      const ops: LiquidityOp[] = []

      for (const block of blocks) {
        if (!block.instructions) continue

        for (const instruction of block.instructions) {
          if (instruction.programId !== liquidity.programId) continue

          let decoded: ReturnType<typeof liquidity.instructions.operate.decode>
          try {
            decoded = liquidity.instructions.operate.decode(instruction)
          } catch {
            continue
          }

          const supplyAmount = decoded.data.supplyAmount
          const borrowAmount = decoded.data.borrowAmount
          const opType = classifyOp(supplyAmount, borrowAmount)

          const tx = block.transactions?.find(
            (t: any) => t.transactionIndex === instruction.transactionIndex
          )
          const txSignature = tx?.signatures?.[0] ?? ''

          ops.push({
            slot: block.header.number,
            timestamp: new Date(block.header.timestamp * 1000).toISOString(),
            tx_signature: txSignature,
            protocol: decoded.accounts.protocol,
            token_reserve: decoded.accounts.tokenReserve,
            mint: decoded.accounts.mint,
            supply_amount: supplyAmount.toString(),
            borrow_amount: borrowAmount.toString(),
            op_type: opType,
            sign: 1,
          })
        }
      }

      return { ops }
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
          const ops = data.ops as LiquidityOp[]
          if (ops.length === 0) return
          await store.insert({
            table: 'liquidity_ops',
            values: ops,
            format: 'JSONEachRow',
          })
        },
        onRollback: async ({ safeCursor, store }) => {
          await store.removeAllRows({
            tables: ['liquidity_ops'],
            where: 'slot > {latest:UInt64}',
            params: { latest: safeCursor.number },
          })
        },
      }),
    )
}

void main()
