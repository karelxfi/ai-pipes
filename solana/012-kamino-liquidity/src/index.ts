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

// Kamino kliquidity program
const KAMINO_PROGRAM = '6LtLpnUFNByNXLyCoK9wA2MykKAmQNZKBdY8s47dehDc'

// Anchor d8 discriminators (SHA256("global:instruction_name")[0:8])
const INSTRUCTIONS: Record<string, string> = {
  '0xf223c68952e1f2b6': 'Deposit',
  '0xb712469c946da122': 'Withdraw',
  '0x0df5b467feb67904': 'Invest',
  '0x6c9e4d09d234583e': 'Rebalance',
  '0xf8c69e91e17587c8': 'Swap',
  '0xa498cf631eba13b6': 'CollectFees',
  '0x3f825ac527108fb0': 'CollectRewards',
  '0xfa8e66a0480c538b': 'SingleTokenDeposit',
  '0x76868fc0bc158311': 'SingleTokenDepositAndInvest',
  '0xc546bc70168356bd': 'WithdrawAndCollect',
  '0x87802f4d0f98f031': 'OpenPosition',
  '0x7b86510031446262': 'ClosePosition',
  '0xcceaccdb065b60f1': 'OpenLiquidityPosition',
  '0x22a86ba3c2448318': 'CloseLiquidityPosition',
  '0x9f276e8964eacc8d': 'ExecutiveWithdraw',
  '0xe2094ec9baf87c17': 'FlashSwapUnevenness',
  '0xfea2056ec00cfa95': 'PermissionlessRebalance',
  '0x2f5b8ce356cc0cdd': 'CheckRebalanceNeeded',
  '0x49e2f8d705c5d3e5': 'EmergencySwap',
  '0x169dad06bb19566d': 'DepositAndInvest',
  '0xb6a644e4677514b7': 'CollectPendingFees',
  '0x061cbcc7fd851722': 'CollectAllRewards',
  '0x5c29ac1ebe41ae5a': 'SwapRewards',
}

const D8_VALUES = Object.keys(INSTRUCTIONS)

// Start from slot 405M (~Mar 2026 recent data)
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

interface KaminoAction {
  slot: number
  timestamp: string
  tx_signature: string
  action: string
  strategy: string
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
      programId: [KAMINO_PROGRAM],
      d8: D8_VALUES,
      isCommitted: true,
      transaction: true,
    },
  })

export async function main() {
  await solanaPortalStream({
    id: 'kamino-liquidity',
    portal: 'https://portal.sqd.dev/datasets/solana-mainnet',
    outputs: query,
  })
    .pipe((blocks: any[]) => {
      const actions: KaminoAction[] = []

      for (const block of blocks) {
        if (!block.instructions) continue

        for (const ins of block.instructions) {
          if (ins.programId !== KAMINO_PROGRAM) continue

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

          // Kamino accounts layout:
          // a0 = strategy (vault) account
          // a1 = global config or position owner
          // a2 = usually the user/authority for user-facing actions
          const strategy = ins.accounts?.[0] ?? ''
          // For user-facing instructions, the authority/signer is typically a2 or a1
          // In Kamino, a1 is usually globalConfig, a2 is the user for deposit/withdraw
          const authority = ins.accounts?.[2] ?? ins.accounts?.[1] ?? ''

          const tx = block.transactions?.find(
            (t: any) => t.transactionIndex === ins.transactionIndex
          )
          const txSignature = tx?.signatures?.[0] ?? ''

          actions.push({
            slot: block.header.number,
            timestamp: new Date(block.header.timestamp * 1000).toISOString(),
            tx_signature: txSignature,
            action,
            strategy,
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
          const rows = data.actions as KaminoAction[]
          if (rows.length === 0) return
          await store.insert({
            table: 'kamino_actions',
            values: rows,
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
