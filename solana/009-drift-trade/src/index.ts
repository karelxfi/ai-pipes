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

// Drift v2 program
const DRIFT_PROGRAM = 'dRiftyHA39MWEi3m9aunc5MzRF1JYuBsbn6VPcn33UH'

// Anchor d8 discriminators (SHA256("global:instruction_name")[0:8])
const INSTRUCTIONS: Record<string, string> = {
  '0x45a15dca787e4cb9': 'PlacePerpOrder',
  '0xd53301bb6cdce6e0': 'PlaceAndTakePerpOrder',
  '0x95750bed2f5f59ed': 'PlaceAndMakePerpOrder',
  '0x0dbcf86786d96af0': 'FillPerpOrder',
  '0x5f81edf00831df84': 'CancelOrder',
  '0x6bd3fa8512253964': 'CancelOrderByUserId',
  '0x2f7c75ffc9c5825e': 'ModifyOrder',
  '0x4b2377f7bf128b02': 'LiquidatePerp',
  '0xf223c68952e1f2b6': 'Deposit',
  '0xb712469c946da122': 'Withdraw',
}

const D8_VALUES = Object.keys(INSTRUCTIONS)

// Start from ~Mar 2026 (slot 405M) — recent activity
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

interface DriftAction {
  slot: number
  timestamp: string
  tx_signature: string
  action: string
  authority: string
  is_error: number
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
      programId: [DRIFT_PROGRAM],
      d8: D8_VALUES,
      isCommitted: true,
      transaction: true,
    },
  })

export async function main() {
  await solanaPortalStream({
    id: 'drift-trade',
    portal: 'https://portal.sqd.dev/datasets/solana-mainnet',
    outputs: query,
  })
    .pipe((blocks: any[]) => {
      const actions: DriftAction[] = []

      for (const block of blocks) {
        if (!block.instructions) continue

        for (const ins of block.instructions) {
          if (ins.programId !== DRIFT_PROGRAM) continue

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

          const action = INSTRUCTIONS[d8Hex]
          if (!action) continue

          // Authority/user is typically the second account (a1) in Drift instructions
          // a0 = state, a1 = user/authority
          const authority = ins.accounts?.[1] ?? ''

          const tx = block.transactions?.find(
            (t: any) => t.transactionIndex === ins.transactionIndex
          )
          const txSignature = tx?.signatures?.[0] ?? ''

          actions.push({
            slot: block.header.number,
            timestamp: new Date(block.header.timestamp * 1000).toISOString(),
            tx_signature: txSignature,
            action,
            authority,
            is_error: ins.error ? 1 : 0,
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
          const rows = data.actions as DriftAction[]
          if (rows.length === 0) return
          await store.insert({
            table: 'drift_actions',
            values: rows,
            format: 'JSONEachRow',
          })
        },
        onRollback: async ({ safeCursor, store }) => {
          await store.removeAllRows({
            tables: ['drift_actions'],
            where: 'slot > {latest:UInt64}',
            params: { latest: safeCursor.number },
          })
        },
      }),
    )
}

void main()
