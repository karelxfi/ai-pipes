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

// Sanctum program IDs
const ROUTER_PROGRAM = 'stkitrT1Uoy18Dk1fTrgPw8W6MVzoCfYoAFT4MLsmhq'
const S_CONTROLLER = '5ocnV1qiCgaQR8Jb8xWnVbApfaygJ8tNoZfgPwsgx9kx'
const UNSTAKE_PROGRAM = 'unpXTU2Ndrc7WWNyEhQWe4udTzSibLPi25SXv2xbCHQ'

const ALL_PROGRAMS = [ROUTER_PROGRAM, S_CONTROLLER, UNSTAKE_PROGRAM]

// Start from ~January 2025
const FROM_SLOT = 310000000

interface SanctumAction {
  slot: number
  timestamp: string
  tx_signature: string
  fee_payer: string
  program: string
  lst_mint: string
  sign: number
}

function serializeJsonWithBigInt(obj: unknown): string {
  return JSON.stringify(obj, (_key, value) =>
    typeof value === 'bigint' ? value.toString() : value
  )
}

// System addresses to exclude from LST mint detection
const SYSTEM_ADDRESSES = new Set([
  'So11111111111111111111111111111111111111112',
  'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
  '11111111111111111111111111111111',
  'SysvarC1ock11111111111111111111111111111111',
  'SysvarRent111111111111111111111111111111111',
  'Stake11111111111111111111111111111111111111',
  'StakeConfig11111111111111111111111111111111',
  // Sanctum infrastructure addresses (not LST mints)
  '7UWZDKjBT1dTvAzdjoSCYKnML3SPt9tfFkANGarEq5r3', // Router authority
  '75jTZDE78xpBJokeB2BcimRNY5BZ7U45bWhpgUrTzWZC', // Fee account
  'AYhux5gJzCoeoc1PoJ1VxwPDe22RwcvpHviLDD1oCGvW', // INF pool state
  'Gb7m4daakbVbrFLR33FKMDVMHAprRZ66CSYt4bpFwUgS', // INF pool authority
  // Stake pool programs
  'SPMBzsVUuoHA4Jm6KunbsotaahvVikZs1JyTW6iJvbn',
  'SP12tWFxD9oJsVWNavTTBZvMbA6gkAmxtVgxdqvyvhY',
  'SPoo1Ku8WFXoNDMHPsrGSTSG1Y47rzgn41SLUNakuHy',
  // SOL value calculators
  'sspUE1vrh7xRoXxGsg7vR1zde2WdGtJRbyK9uRumBDy',
  'ssmbu3KZxgonUtjEMCKspZzxvUQCxAFnyh1rcHUeEDo',
  'sp1V4h2gWorkGhVcazBc22Hfo2f5sd7jcjT4EDPrWFF',
  '84C2M1NcmqFiP37qHKzuz8ydyyjCrzNqY77GhvHtCpyf',
  // Pricing
  's1b6NRXj6ygNu1QMKXh2H9LUR2aPApAAm1UQ2DjdhNV',
  'Cn5fegqLh8Fmvffisr4Wk3LmuaUgMMzTFfEuidpZFsvV',
  'Ehcuy2BzuY9BscqcH2K43tDKqoi6xQHxChtVjzrMfvU8',
  'HxBTMuB7cFBPVWVJjTi9iBF8MPd7mfY1QnrrWfLAySFd',
])

// Extract the LST mint from an instruction
// For S Controller: account[0] is the LST mint
// For Router: account[5] is dst LST, account[6] is src LST — we use account[6] (source)
function extractLstMint(programId: string, accounts: string[]): string | null {
  if (programId === S_CONTROLLER && accounts.length >= 1) {
    const mint = accounts[0]
    if (!SYSTEM_ADDRESSES.has(mint)) return mint
  }
  if (programId === ROUTER_PROGRAM && accounts.length >= 7) {
    const srcMint = accounts[6]
    if (!SYSTEM_ADDRESSES.has(srcMint)) return srcMint
  }
  if (programId === UNSTAKE_PROGRAM && accounts.length >= 1) {
    // First non-system account
    for (const acc of accounts) {
      if (!SYSTEM_ADDRESSES.has(acc)) return acc
    }
  }
  return null
}

// Build the query that fetches Sanctum instructions filtered by program IDs
const query = new SolanaQueryBuilder()
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
    range: { from: FROM_SLOT },
    request: {
      programId: ALL_PROGRAMS,
      isCommitted: true,
      transaction: true,
    },
  })

export async function main() {
  await solanaPortalSource({
    id: 'sanctum-router',
    portal: 'https://portal.sqd.dev/datasets/solana-mainnet',
    outputs: query,
  })
    .pipe((blocks: any[]) => {
      const actions: SanctumAction[] = []

      for (const block of blocks) {
        if (!block.instructions) continue

        for (const instruction of block.instructions) {
          if (!ALL_PROGRAMS.includes(instruction.programId)) continue

          const lstMint = extractLstMint(instruction.programId, instruction.accounts)
          if (!lstMint) continue

          const tx = block.transactions?.find(
            (t: any) => t.transactionIndex === instruction.transactionIndex
          )
          if (!tx) continue

          let program = 'unknown'
          if (instruction.programId === S_CONTROLLER) program = 'infinity'
          else if (instruction.programId === ROUTER_PROGRAM) program = 'router'
          else if (instruction.programId === UNSTAKE_PROGRAM) program = 'unstake'

          actions.push({
            slot: block.header.number,
            timestamp: new Date(block.header.timestamp * 1000).toISOString(),
            tx_signature: tx.signatures?.[0] ?? '',
            fee_payer: tx.accountKeys?.[0] ?? '',
            program,
            lst_mint: lstMint,
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
          const actions = data.actions as SanctumAction[]
          if (actions.length === 0) return
          await store.insert({
            table: 'sanctum_actions',
            values: actions,
            format: 'JSONEachRow',
          })
        },
        onRollback: async ({ safeCursor, store }) => {
          await store.removeAllRows({
            tables: ['sanctum_actions'],
            where: 'slot > {latest:UInt64}',
            params: { latest: safeCursor.number },
          })
        },
      }),
    )
}

void main()
