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

// dSOL mint address (Drift Staked SOL)
const DSOL_MINT = 'Dso1bDeDjCQxTrWHqUUi63oBvV7Mdm6WaobLbQ7gnPQ'

// SPL Token program
const TOKEN_PROGRAM = 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'

const LAMPORTS_PER_SOL = 1_000_000_000

// SPL Token instruction d1 discriminators
// MintTo (0x07): mint, dest, authority — a0 = mint
// Burn (0x08): source, mint, authority — a1 = mint
// MintToChecked (0x0e): mint, dest, authority — a0 = mint
// BurnChecked (0x0f): source, mint, authority — a1 = mint
const MINT_D1 = ['0x07', '0x0e']  // MintTo, MintToChecked
const BURN_D1 = ['0x08', '0x0f']  // Burn, BurnChecked

// Start from ~Mar 2026 (slot 405M) — captures recent weeks of dSOL activity
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

interface DsolOp {
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

// Two separate queries — mints (a0 = dSOL mint) and burns (a1 = dSOL mint)
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
  // MintTo/MintToChecked — a0 is the mint
  .addInstruction({
    range: { from: FROM_SLOT },
    request: {
      programId: [TOKEN_PROGRAM],
      d1: MINT_D1,
      a0: [DSOL_MINT],
      isCommitted: true,
      transaction: true,
    },
  })
  // Burn/BurnChecked — a1 is the mint
  .addInstruction({
    range: { from: FROM_SLOT },
    request: {
      programId: [TOKEN_PROGRAM],
      d1: BURN_D1,
      a1: [DSOL_MINT],
      isCommitted: true,
      transaction: true,
    },
  })

export async function main() {
  await solanaPortalStream({
    id: 'dsol-staking',
    portal: 'https://portal.sqd.dev/datasets/solana-mainnet',
    outputs: query,
  })
    .pipe((blocks: any[]) => {
      const ops: DsolOp[] = []

      for (const block of blocks) {
        if (!block.instructions) continue

        for (const ins of block.instructions) {
          if (ins.programId !== TOKEN_PROGRAM) continue

          let data: Uint8Array
          try {
            data = base58Decode(ins.data)
          } catch {
            continue
          }

          if (data.length === 0) continue
          const d1Hex = '0x' + data[0].toString(16).padStart(2, '0')

          let action: string
          let mintAccount: string

          if (MINT_D1.includes(d1Hex)) {
            action = 'Deposit'
            mintAccount = ins.accounts?.[0] ?? ''
          } else if (BURN_D1.includes(d1Hex)) {
            action = 'Withdraw'
            mintAccount = ins.accounts?.[1] ?? ''
          } else {
            continue
          }

          // Verify it's dSOL mint
          if (mintAccount !== DSOL_MINT) continue

          // Extract amount (u64 LE after d1 byte)
          let amountLamports = 0n
          if (data.length >= 9) {
            amountLamports = readU64LE(data, 1)
          }

          // Authority is the last account (a2 for basic, a2 for checked)
          const authority = ins.accounts?.[2] ?? ins.accounts?.[ins.accounts.length - 1] ?? ''

          const tx = block.transactions?.find(
            (t: any) => t.transactionIndex === ins.transactionIndex
          )
          const txSignature = tx?.signatures?.[0] ?? ''

          ops.push({
            slot: block.header.number,
            timestamp: new Date(block.header.timestamp * 1000).toISOString(),
            tx_signature: txSignature,
            action,
            amount_lamports: amountLamports.toString(),
            amount_sol: Number(amountLamports) / LAMPORTS_PER_SOL,
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
          const ops = data.ops as DsolOp[]
          if (ops.length === 0) return
          await store.insert({
            table: 'dsol_ops',
            values: ops,
            format: 'JSONEachRow',
          })
        },
        onRollback: async ({ safeCursor, store }) => {
          await store.removeAllRows({
            tables: ['dsol_ops'],
            where: 'slot > {latest:UInt64}',
            params: { latest: safeCursor.number },
          })
        },
      }),
    )
}

void main()
