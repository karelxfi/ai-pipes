import 'dotenv/config'
import path from 'node:path'
import { createClient } from '@clickhouse/client'
import { solanaPortalSource, SolanaQueryBuilder } from '@subsquid/pipes/solana'
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

// SPL Stake Pool program — shared by Jito, BNSOL, Marinade Native, etc.
const SPL_STAKE_POOL = 'SPoo1Ku8WFXoNDMHPsrGSTSG1Y47rzgn41SLUNakuHy'

// d1 discriminators (single-byte enum, NOT Anchor d8)
const INSTRUCTIONS: Record<string, string> = {
  '0x03': 'DecreaseValidatorStake',
  '0x04': 'IncreaseValidatorStake',
  '0x06': 'UpdateValidatorListBalance',
  '0x07': 'UpdateStakePoolBalance',
  '0x08': 'CleanupRemovedValidatorEntries',
  '0x09': 'DepositStake',
  '0x0a': 'WithdrawStake',
  '0x0e': 'DepositSol',
  '0x10': 'WithdrawSol',
  '0x16': 'DepositStakeWithSlippage',
  '0x17': 'WithdrawStakeWithSlippage',
  '0x18': 'DepositSolWithSlippage',
  '0x19': 'WithdrawSolWithSlippage',
}

const D1_VALUES = Object.keys(INSTRUCTIONS)

// Start from ~Jun 2024 (slot 270M) to capture the Jito growth era
const FROM_SLOT = 270_000_000

// Base58 decoder
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

// Read little-endian u64 from bytes (after d1 byte)
function readU64LE(data: Uint8Array, offset: number): bigint {
  let val = 0n
  for (let i = 0; i < 8; i++) {
    val |= BigInt(data[offset + i]) << BigInt(i * 8)
  }
  return val
}

interface StakePoolOp {
  slot: number
  timestamp: string
  tx_signature: string
  pool: string
  instruction: string
  amount_lamports: string
  signer: string
  sign: number
}

function serializeJsonWithBigInt(obj: unknown): string {
  return JSON.stringify(obj, (_key, value) =>
    typeof value === 'bigint' ? value.toString() : value
  )
}

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
      programId: [SPL_STAKE_POOL],
      d1: D1_VALUES,
      isCommitted: true,
      transaction: true,
    },
  })

export async function main() {
  await solanaPortalSource({
    id: 'spl-stake-pools',
    portal: 'https://portal.sqd.dev/datasets/solana-mainnet',
    outputs: query,
  })
    .pipe((blocks: any[]) => {
      const ops: StakePoolOp[] = []

      for (const block of blocks) {
        if (!block.instructions) continue

        for (const ins of block.instructions) {
          if (ins.programId !== SPL_STAKE_POOL) continue

          let data: Uint8Array
          try {
            data = base58Decode(ins.data)
          } catch {
            continue
          }

          if (data.length === 0) continue
          const d1Hex = '0x' + data[0].toString(16).padStart(2, '0')
          const instrName = INSTRUCTIONS[d1Hex]
          if (!instrName) continue

          // Extract amount (u64 LE after the d1 byte) for instructions that have it
          let amountLamports = 0n
          if (data.length >= 9) {
            amountLamports = readU64LE(data, 1)
          }

          // Pool account is always a0 in SPL Stake Pool
          const pool = ins.accounts?.[0] ?? ''
          // Last account in the instruction is usually the signer/authority
          const signer = ins.accounts?.[ins.accounts.length - 1] ?? ''

          const tx = block.transactions?.find(
            (t: any) => t.transactionIndex === ins.transactionIndex
          )
          const txSignature = tx?.signatures?.[0] ?? ''

          ops.push({
            slot: block.header.number,
            timestamp: new Date(block.header.timestamp * 1000).toISOString(),
            tx_signature: txSignature,
            pool,
            instruction: instrName,
            amount_lamports: amountLamports.toString(),
            signer,
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
          const ops = data.ops as StakePoolOp[]
          if (ops.length === 0) return
          await store.insert({
            table: 'stake_pool_ops',
            values: ops,
            format: 'JSONEachRow',
          })
        },
        onRollback: async ({ safeCursor, store }) => {
          await store.removeAllRows({
            tables: ['stake_pool_ops'],
            where: 'slot > {latest:UInt64}',
            params: { latest: safeCursor.number },
          })
        },
      }),
    )
}

void main()
