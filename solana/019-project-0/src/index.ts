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

// Project 0 (prev. marginfi) lending program
const PROGRAM_ID = 'MFv2hWf31Z9kbCa1snEPYctwafyhdvnV7FZnsebVacA'

// Anchor d8 instruction discriminators
const DISCRIMINATORS: Record<string, string> = {
  '0xab5eeb675240d48c': 'deposit',
  '0x24484a13d2d2c0c0': 'withdraw',
  '0x047e74353005d41f': 'borrow',
  '0x4fd1acb1de33ad97': 'repay',
  '0xd6a997d5fba756db': 'liquidate',
}

const D8_VALUES = Object.keys(DISCRIMINATORS)

// Dynamic lookback: 5 days (high-frequency lending actions)
const LOOKBACK_DAYS = 5
const startDate = new Date(Date.now() - LOOKBACK_DAYS * 86_400_000)

interface Project0Action {
  slot: number
  timestamp: string
  tx_signature: string
  fee_payer: string
  action: string
  bank: string
  sign: number
}

function serializeJsonWithBigInt(obj: unknown): string {
  return JSON.stringify(obj, (_key, value) =>
    typeof value === 'bigint' ? value.toString() : value
  )
}

// Build query: fetch marginfi lending instructions
const query = solanaQuery()
  .addFields({
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
  .addInstruction({
    range: { from: startDate },
    request: {
      programId: [PROGRAM_ID],
      d8: D8_VALUES,
      isCommitted: true,
      transaction: true,
    },
  })

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

function getD8FromBase58(base58Data: string): string {
  const bytes = base58Decode(base58Data)
  if (bytes.length < 8) return ''
  let hex = '0x'
  for (let i = 0; i < 8; i++) {
    hex += bytes[i].toString(16).padStart(2, '0')
  }
  return hex
}

// Extract bank address from instruction accounts based on action type
function getBankAddress(accounts: string[], action: string): string {
  if (action === 'liquidate') {
    // For liquidate: asset_bank at index 1
    return accounts[1] ?? ''
  }
  // For deposit/withdraw/borrow/repay: bank at index 3
  return accounts[3] ?? ''
}

export async function main() {
  await solanaPortalStream({
    id: 'project0-lending',
    portal: 'https://portal.sqd.dev/datasets/solana-mainnet',
    outputs: query,
  })
    .pipe((blocks: any[]) => {
      const actions: Project0Action[] = []

      for (const block of blocks) {
        if (!block.instructions) continue

        for (const instruction of block.instructions) {
          if (instruction.programId !== PROGRAM_ID) continue

          const d8Hex = getD8FromBase58(instruction.data)
          const action = DISCRIMINATORS[d8Hex]
          if (!action) continue

          const tx = block.transactions?.find(
            (t: any) => t.transactionIndex === instruction.transactionIndex
          )
          if (!tx) continue

          const txSignature = tx.signatures?.[0] ?? ''
          const feePayer = tx.accountKeys?.[0] ?? ''
          const bank = getBankAddress(instruction.accounts, action)

          actions.push({
            slot: block.header.number,
            timestamp: new Date(block.header.timestamp * 1000).toISOString(),
            tx_signature: txSignature,
            fee_payer: feePayer,
            action,
            bank,
            sign: 1,
          })
        }
      }

      return { actions }
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
          const actions = data.actions as Project0Action[]
          if (actions.length === 0) return
          await store.insert({
            table: 'project0_actions',
            values: actions,
            format: 'JSONEachRow',
          })
        },
        onRollback: async ({ safeCursor, store }) => {
          await store.removeAllRows({
            tables: ['project0_actions'],
            where: 'slot > {latest:UInt64}',
            params: { latest: safeCursor.number },
          })
        },
      }),
    )
}

void main()
