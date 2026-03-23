import 'dotenv/config'
import path from 'node:path'
import { createClient } from '@clickhouse/client'
import { solanaPortalSource, SolanaQueryBuilder } from '@subsquid/pipes/solana'
import { clickhouseTarget } from '@subsquid/pipes/targets/clickhouse'
import { z } from 'zod'
import * as tipDistribution from './abi/jito-tip-distribution/index.js'

const env = z
  .object({
    CLICKHOUSE_USER: z.string(),
    CLICKHOUSE_PASSWORD: z.string(),
    CLICKHOUSE_URL: z.string(),
    CLICKHOUSE_DATABASE: z.string(),
  })
  .parse(process.env)

const LAMPORTS_PER_SOL = 1_000_000_000

// Start from ~Oct 2024 (slot 300M) — tip claims became high-volume after Jito grew
const FROM_SLOT = 300_000_000

interface TipClaim {
  slot: number
  timestamp: string
  tx_signature: string
  claimant: string
  payer: string
  tip_distribution_account: string
  amount_lamports: string
  amount_sol: number
  sign: number
}

function serializeJsonWithBigInt(obj: unknown): string {
  return JSON.stringify(obj, (_key, value) =>
    typeof value === 'bigint' ? value.toString() : value
  )
}

// Build query: fetch claim instructions from the Jito Tip Distribution program
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
      programId: [tipDistribution.programId],
      d8: [tipDistribution.instructions.claim.d8],
      isCommitted: true,
      transaction: true,
    },
  })

export async function main() {
  await solanaPortalSource({
    id: 'jito-tip-claims',
    portal: 'https://portal.sqd.dev/datasets/solana-mainnet',
    outputs: query,
  })
    .pipe((blocks: any[]) => {
      const claims: TipClaim[] = []

      for (const block of blocks) {
        if (!block.instructions) continue

        for (const instruction of block.instructions) {
          if (instruction.programId !== tipDistribution.programId) continue

          // Decode using typegen — typed accounts + data
          let decoded: ReturnType<typeof tipDistribution.instructions.claim.decode>
          try {
            decoded = tipDistribution.instructions.claim.decode(instruction)
          } catch {
            continue // Skip non-claim instructions
          }
          const amountLamports = decoded.data.amount
          const amountSol = Number(amountLamports) / LAMPORTS_PER_SOL

          // Find matching transaction for signature
          const tx = block.transactions?.find(
            (t: any) => t.transactionIndex === instruction.transactionIndex
          )
          const txSignature = tx?.signatures?.[0] ?? ''

          claims.push({
            slot: block.header.number,
            timestamp: new Date(block.header.timestamp * 1000).toISOString(),
            tx_signature: txSignature,
            claimant: decoded.accounts.claimant,
            payer: decoded.accounts.payer,
            tip_distribution_account: decoded.accounts.tipDistributionAccount,
            amount_lamports: amountLamports.toString(),
            amount_sol: amountSol,
            sign: 1,
          })
        }
      }

      return { claims }
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
          const claims = data.claims as TipClaim[]
          if (claims.length === 0) return
          await store.insert({
            table: 'tip_claims',
            values: claims,
            format: 'JSONEachRow',
          })
        },
        onRollback: async ({ safeCursor, store }) => {
          await store.removeAllRows({
            tables: ['tip_claims'],
            where: 'slot > {latest:UInt64}',
            params: { latest: safeCursor.number },
          })
        },
      }),
    )
}

void main()
