import 'dotenv/config'
import path from 'node:path'
import { createClient } from '@clickhouse/client'
import { solanaPortalSource, SolanaQueryBuilder } from '@subsquid/pipes/solana'
import { clickhouseTarget } from '@subsquid/pipes/targets/clickhouse'
import { createTransformer } from '@subsquid/pipes'
import { z } from 'zod'

const env = z
  .object({
    CLICKHOUSE_USER: z.string(),
    CLICKHOUSE_PASSWORD: z.string(),
    CLICKHOUSE_URL: z.string(),
    CLICKHOUSE_DATABASE: z.string(),
  })
  .parse(process.env)

// Kamino Lend program ID
const PROGRAM_ID = 'KLend2g3cP87fffoy8q1mQqGKjrxjC8boSyAYavgmjD'

// Anchor d8 instruction discriminators
const DISCRIMINATORS: Record<string, string> = {
  '0x81c70402de271a2e': 'deposit',
  '0x797f12cc49f5e141': 'borrow',
  '0x91b20de14cf09348': 'repay',
  '0xb1479abce2854a37': 'liquidate',
  '0x4b5d5ddc2296dac4': 'withdraw',
}

const D8_VALUES = Object.keys(DISCRIMINATORS)

// Start slot: ~Feb 2025 (recent, high activity)
const FROM_SLOT = 330000000

interface KaminoAction {
  slot: number
  timestamp: string
  tx_signature: string
  fee_payer: string
  action: string
  sign: number
}

function serializeJsonWithBigInt(obj: unknown): string {
  return JSON.stringify(obj, (_key, value) =>
    typeof value === 'bigint' ? value.toString() : value
  )
}

// Build a custom query that fetches Kamino Lend instructions filtered by program ID + d8
const kaminoClassifier = createTransformer({
  profiler: { id: 'kamino-classifier' },
  query: async ({ queryBuilder }: { queryBuilder: SolanaQueryBuilder }) => {
    queryBuilder.addFields({
      block: { number: true, timestamp: true },
      transaction: { transactionIndex: true, signatures: true, accountKeys: true },
      instruction: {
        transactionIndex: true,
        programId: true,
        data: true,
        accounts: true,
        instructionAddress: true,
      },
    })
    queryBuilder.addInstruction({
      range: { from: FROM_SLOT },
      request: {
        programId: [PROGRAM_ID],
        d8: D8_VALUES,
        isCommitted: true,
        transaction: true,
      },
    })
  },
  transform: async (data: any) => {
    const actions: KaminoAction[] = []

    for (const block of data.blocks) {
      if (!block.instructions) continue

      for (const instruction of block.instructions) {
        if (instruction.programId !== PROGRAM_ID) continue

        // Compute d8 from raw instruction data (base58-encoded)
        // The Pipes SDK provides instruction.data as base58.
        // We need to get the first 8 bytes as a hex d8 discriminator.
        const d8Hex = getD8FromBase58(instruction.data)
        const action = DISCRIMINATORS[d8Hex]
        if (!action) continue

        // Find the parent transaction to get signatures and fee_payer
        const tx = block.transactions?.find(
          (t: any) => t.transactionIndex === instruction.transactionIndex
        )
        if (!tx) continue

        const txSignature = tx.signatures?.[0] ?? ''
        // Fee payer is the first account key in the transaction
        const feePayer = tx.accountKeys?.[0] ?? ''

        actions.push({
          slot: block.header.number,
          timestamp: new Date(block.header.timestamp * 1000).toISOString(),
          tx_signature: txSignature,
          fee_payer: feePayer,
          action,
          sign: 1,
        })
      }
    }

    return { actions }
  },
})

// Helper: decode base58 to bytes and extract d8 hex discriminator
function getD8FromBase58(base58Data: string): string {
  const bytes = base58Decode(base58Data)
  if (bytes.length < 8) return ''
  // d8 = first 8 bytes as 0x-prefixed hex
  let hex = '0x'
  for (let i = 0; i < 8; i++) {
    hex += bytes[i].toString(16).padStart(2, '0')
  }
  return hex
}

// Base58 decoder (Solana uses base58 for instruction data encoding)
const BASE58_ALPHABET = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz'
function base58Decode(str: string): Uint8Array {
  if (str.length === 0) return new Uint8Array(0)

  const bytes: number[] = [0]
  for (const char of str) {
    const idx = BASE58_ALPHABET.indexOf(char)
    if (idx < 0) throw new Error(`Invalid base58 character: ${char}`)
    let carry = idx
    for (let j = 0; j < bytes.length; j++) {
      carry += bytes[j] * 58
      bytes[j] = carry & 0xff
      carry >>= 8
    }
    while (carry > 0) {
      bytes.push(carry & 0xff)
      carry >>= 8
    }
  }

  // Count leading '1's (represent leading zero bytes)
  let leadingZeros = 0
  for (const char of str) {
    if (char === '1') leadingZeros++
    else break
  }

  const result = new Uint8Array(leadingZeros + bytes.length)
  // Leading zeros are already 0 in the Uint8Array
  // Copy bytes in reverse order (they're in little-endian in the array)
  for (let i = 0; i < bytes.length; i++) {
    result[leadingZeros + i] = bytes[bytes.length - 1 - i]
  }

  return result
}

export async function main() {
  await solanaPortalSource({
    portal: 'https://portal.sqd.dev/datasets/solana-mainnet',
  })
    .pipeComposite({
      kamino: kaminoClassifier,
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
          const actions = (data as any).kamino.actions as KaminoAction[]
          if (actions.length === 0) return
          await store.insert({
            table: 'kamino_actions',
            values: actions,
            format: 'JSONEachRow',
          })
        },
        onRollback: async ({ safeCursor, store }) => {
          await store.removeAllRows({
            tables: ['kamino_actions'],
            where: 'slot > {latest:UInt64}',
            params: { latest: safeCursor.number },
          })
        },
      }),
    )
}

void main()
