import 'dotenv/config'
import path from 'node:path'
import { createClient } from '@clickhouse/client'
import { evmDecoder, evmPortalStream } from '@subsquid/pipes/evm'
import { clickhouseTarget } from '@subsquid/pipes/targets/clickhouse'
import { z } from 'zod'
import { events as ybLtEvents } from './contracts/YieldBasisLT.js'
import { enrichEvents, serializeJsonWithBigInt } from './utils/index.js'

// yb-WBTC LT vault (leveraged liquidity token)
const YB_WBTC_LT = '0x6095a220c5567360d459462a25b1ad5aead45204'

// Deployed at block 23434006 (Sep 2025)
const START_BLOCK = 23434006

const env = z.object({
  CLICKHOUSE_USER: z.string(),
  CLICKHOUSE_PASSWORD: z.string(),
  CLICKHOUSE_URL: z.string(),
  CLICKHOUSE_DATABASE: z.string(),
}).parse(process.env)

const decoder = evmDecoder({
  range: { from: String(START_BLOCK) },
  contracts: [YB_WBTC_LT],
  events: {
    Deposit: ybLtEvents.Deposit,
    Withdraw: ybLtEvents.Withdraw,
    AllocateStablecoins: ybLtEvents.AllocateStablecoins,
    DistributeBorrowerFees: ybLtEvents.DistributeBorrowerFees,
  },
}).pipe(enrichEvents)

export async function main() {
  await evmPortalStream({
    id: 'yield-basis-leverage-pulse',
    portal: 'https://portal.sqd.dev/datasets/ethereum-mainnet',
    outputs: { decoder },
  }).pipeTo(
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
        await store.executeFiles(path.join(process.cwd(), 'migrations'))
      },
      onData: async ({ data, store }) => {
        // Vault deposits & withdrawals
        const vaultEvents = [
          ...data.decoder.Deposit.map(e => ({
            vault: 'yb-WBTC',
            event_type: 'deposit',
            sender: e.sender,
            owner: e.owner,
            receiver: '',
            assets: String(e.assets),
            shares: String(e.shares),
            block_number: e.blockNumber,
            tx_hash: e.txHash,
            log_index: e.logIndex,
            timestamp: new Date(e.timestamp * 1000).toISOString(),
          })),
          ...data.decoder.Withdraw.map(e => ({
            vault: 'yb-WBTC',
            event_type: 'withdraw',
            sender: e.sender,
            owner: e.owner,
            receiver: e.receiver,
            assets: String(e.assets),
            shares: String(e.shares),
            block_number: e.blockNumber,
            tx_hash: e.txHash,
            log_index: e.logIndex,
            timestamp: new Date(e.timestamp * 1000).toISOString(),
          })),
        ]
        if (vaultEvents.length > 0) {
          await store.insert({ table: 'vault_events', values: vaultEvents, format: 'JSONEachRow' })
        }

        // Leverage operations: stablecoin allocations & borrower fee distributions
        const leverageOps = [
          ...data.decoder.AllocateStablecoins.map(e => ({
            vault: 'yb-WBTC',
            op_type: 'allocate_stablecoins',
            sender: e.allocator,
            amount: String(e.stablecoin_allocation),
            secondary_amount: String(e.stablecoin_allocated),
            discount: '0',
            block_number: e.blockNumber,
            tx_hash: e.txHash,
            log_index: e.logIndex,
            timestamp: new Date(e.timestamp * 1000).toISOString(),
          })),
          ...data.decoder.DistributeBorrowerFees.map(e => ({
            vault: 'yb-WBTC',
            op_type: 'distribute_borrower_fees',
            sender: e.sender,
            amount: String(e.amount),
            secondary_amount: String(e.min_amount),
            discount: String(e.discount),
            block_number: e.blockNumber,
            tx_hash: e.txHash,
            log_index: e.logIndex,
            timestamp: new Date(e.timestamp * 1000).toISOString(),
          })),
        ]
        if (leverageOps.length > 0) {
          await store.insert({ table: 'leverage_ops', values: leverageOps, format: 'JSONEachRow' })
        }
      },
      onRollback: async ({ safeCursor, store }) => {
        for (const table of ['vault_events', 'leverage_ops']) {
          await store.removeAllRows({
            tables: [table],
            where: 'block_number > {latest:UInt32}',
            params: { latest: safeCursor.number },
          })
        }
      },
    }),
  )
}

void main()
