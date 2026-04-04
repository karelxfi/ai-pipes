import 'dotenv/config'
import path from 'node:path'
import { createClient } from '@clickhouse/client'
import { evmDecoder, evmPortalStream } from '@subsquid/pipes/evm'
import { clickhouseTarget } from '@subsquid/pipes/targets/clickhouse'
import { z } from 'zod'
// Import from sUSDS implementation ABI (has Deposit/Withdraw events)
// sDAI shares the same ERC-4626 event signatures
import { events as vaultEvents } from './contracts/0x4e7991e5C547ce825BdEb665EE14a3274f9F61e0.js'
import { serializeJsonWithBigInt } from './utils/index.js'

const env = z
  .object({
    CLICKHOUSE_USER: z.string(),
    CLICKHOUSE_PASSWORD: z.string(),
    CLICKHOUSE_URL: z.string(),
    CLICKHOUSE_DATABASE: z.string(),
  })
  .parse(process.env)

// Both savings vaults (ERC-4626)
const VAULTS: Record<string, string> = {
  '0x83f20f44975d03b1b09e64809b757c47f942beea': 'sDAI',
  '0xa3931d71877c0e7a3148cb7eb4463524fec27fbd': 'sUSDS',
}

const vaultAddresses = Object.keys(VAULTS)

const flows = evmDecoder({
  // sDAI deployed mid-2023, sUSDS late 2024
  range: { from: '17200000' },
  contracts: vaultAddresses,
  events: {
    deposits: vaultEvents.Deposit,
    withdrawals: vaultEvents.Withdraw,
  },
}).pipe(({ deposits, withdrawals }) => {
  const rows = [
    ...deposits.map((d) => ({
      vault: d.contract.toLowerCase(),
      vault_name: VAULTS[d.contract.toLowerCase()] ?? 'Unknown',
      event_type: 'deposit',
      user: d.event.owner,
      assets: d.event.assets,
      shares: d.event.shares,
      block_number: d.block.number,
      tx_hash: d.rawEvent.transactionHash,
      tx_index: d.rawEvent.transactionIndex,
      log_index: d.rawEvent.logIndex,
      timestamp: Math.floor(new Date(d.timestamp).getTime() / 1000),
      sign: 1,
    })),
    ...withdrawals.map((w) => ({
      vault: w.contract.toLowerCase(),
      vault_name: VAULTS[w.contract.toLowerCase()] ?? 'Unknown',
      event_type: 'withdrawal',
      user: w.event.owner,
      assets: w.event.assets,
      shares: w.event.shares,
      block_number: w.block.number,
      tx_hash: w.rawEvent.transactionHash,
      tx_index: w.rawEvent.transactionIndex,
      log_index: w.rawEvent.logIndex,
      timestamp: Math.floor(new Date(w.timestamp).getTime() / 1000),
      sign: 1,
    })),
  ]
  return { flows: rows }
})

export async function main() {
  await evmPortalStream({
    id: 'spark-savings-flows',
    portal: 'https://portal.sqd.dev/datasets/ethereum-mainnet',
    outputs: { flows },
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
          if (data.flows.flows.length > 0) {
            await store.insert({
              table: 'savings_flows',
              values: data.flows.flows,
              format: 'JSONEachRow',
            })
          }
        },
        onRollback: async ({ safeCursor, store }) => {
          await store.removeAllRows({
            tables: ['savings_flows'],
            where: 'block_number > {latest:UInt32}',
            params: { latest: safeCursor.number },
          })
        },
      }),
    )
}

void main()
