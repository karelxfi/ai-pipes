import 'dotenv/config'
import path from 'node:path'
import { createClient } from '@clickhouse/client'
import { solanaPortalStream, solanaQuery } from '@subsquid/pipes/solana'
import { clickhouseTarget } from '@subsquid/pipes/targets/clickhouse'
import { z } from 'zod'

const env = z
  .object({
    CLICKHOUSE_USER: z.string(),
    CLICKHOUSE_PASSWORD: z.string(),
    CLICKHOUSE_URL: z.string(),
    CLICKHOUSE_DATABASE: z.string(),
  })
  .parse(process.env)

// Marinade Finance program
const MARINADE_PROGRAM = 'MarBmsSgKXdrN1egZf5sqe1TMai9K1rChYNDJgjq7aD'

// Anchor d8 discriminators
const INSTRUCTIONS: Record<string, { name: string; authorityIdx: number }> = {
  '0xf223c68952e1f2b6': { name: 'deposit', authorityIdx: 2 },
  '0x1e1e77f0bfe30c10': { name: 'liquid_unstake', authorityIdx: 0 },
  '0x61a7906b75be8024': { name: 'order_unstake', authorityIdx: 0 },
  '0x3ec6d6c1d59f6cd2': { name: 'claim', authorityIdx: 0 },
  '0x6e827329a466023b': { name: 'deposit_stake_account', authorityIdx: 2 },
  '0xd355b841b7b1e9d9': { name: 'withdraw_stake_account', authorityIdx: 0 },
}

const D8_VALUES = Object.keys(INSTRUCTIONS)

// Start from ~Mar 2026 (slot 405M)
const FROM_SLOT = 405_000_000

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
  let leadingZeros = 0
  for (const char of str) {
    if (char === '1') leadingZeros++
    else break
  }
  const result = new Uint8Array(leadingZeros + bytes.length)
  for (let i = 0; i < bytes.length; i++) {
    result[leadingZeros + i] = bytes[bytes.length - 1 - i]
  }
  return result
}

function readU64LE(data: Uint8Array, offset: number): bigint {
  let val = 0n
  for (let i = 0; i < 8; i++) {
    val |= BigInt(data[offset + i]) << BigInt(i * 8)
  }
  return val
}

interface MarinadeOp {
  slot: number
  timestamp: string
  tx_signature: string
  action: string
  amount_lamports: string
  amount_sol: number
  authority: string
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
      error: true,
      isCommitted: true,
    },
  })
  .addInstruction({
    range: { from: FROM_SLOT },
    request: {
      programId: [MARINADE_PROGRAM],
      d8: D8_VALUES,
      isCommitted: true,
      transaction: true,
    },
  })

export async function main() {
  await solanaPortalStream({
    id: 'marinade-staking',
    portal: 'https://portal.sqd.dev/datasets/solana-mainnet',
    outputs: query,
  })
    .pipe((blocks: any[]) => {
      const ops: MarinadeOp[] = []

      for (const block of blocks) {
        if (!block.instructions) continue

        for (const ins of block.instructions) {
          if (ins.programId !== MARINADE_PROGRAM) continue

          let data: Uint8Array
          try {
            data = base58Decode(ins.data)
          } catch {
            continue
          }

          if (data.length < 8) continue
          let d8Hex = '0x'
          for (let i = 0; i < 8; i++) {
            d8Hex += data[i].toString(16).padStart(2, '0')
          }

          const spec = INSTRUCTIONS[d8Hex]
          if (!spec) continue

          // Extract amount from instruction data bytes 8..16 (u64 LE)
          let amountLamports = 0n
          if (data.length >= 16) {
            amountLamports = readU64LE(data, 8)
          }

          const authority = ins.accounts?.[spec.authorityIdx] ?? ''

          const tx = block.transactions?.find(
            (t: any) => t.transactionIndex === ins.transactionIndex
          )
          const txSignature = tx?.signatures?.[0] ?? ''

          ops.push({
            slot: block.header.number,
            timestamp: new Date(block.header.timestamp * 1000).toISOString(),
            tx_signature: txSignature,
            action: spec.name,
            amount_lamports: amountLamports.toString(),
            amount_sol: Number(amountLamports) / 1e9,
            authority,
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
          const rows = data.ops as MarinadeOp[]
          if (rows.length === 0) return
          await store.insert({
            table: 'marinade_ops',
            values: rows,
            format: 'JSONEachRow',
          })
        },
        onRollback: async ({ safeCursor, store }) => {
          await store.removeAllRows({
            tables: ['marinade_ops'],
            where: 'slot > {latest:UInt64}',
            params: { latest: safeCursor.number },
          })
        },
      }),
    )
}

void main()
