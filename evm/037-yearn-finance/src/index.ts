import 'dotenv/config'
import path from 'node:path'
import { createClient } from '@clickhouse/client'
import { evmDecoder, evmPortalSource } from '@subsquid/pipes/evm'
import { clickhouseTarget } from '@subsquid/pipes/targets/clickhouse'
import { z } from 'zod'
import { events as yearnV2Events } from './contracts/0xa258C4606Ca8206D8aA700cE2143D7db854D168c.js'
import { serializeJsonWithBigInt } from './utils/index.js'

const env = z
  .object({
    CLICKHOUSE_USER: z.string(),
    CLICKHOUSE_PASSWORD: z.string(),
    CLICKHOUSE_URL: z.string(),
    CLICKHOUSE_DATABASE: z.string(),
  })
  .parse(process.env)

// Capture StrategyReported events across ALL Yearn V2 vaults
// No contracts filter — topic0-only global filtering
const harvests = evmDecoder({
  range: { from: '11000000' },
  events: {
    StrategyReported: yearnV2Events.StrategyReported,
  },
})

export async function main() {
  await evmPortalSource({
    id: 'yearn-v2-harvests',
    portal: 'https://portal.sqd.dev/datasets/ethereum-mainnet',
    outputs: { harvests },
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
          const rows = data.harvests.StrategyReported.map((d) => ({
            vault: d.contract,
            strategy: d.event.strategy,
            gain: d.event.gain.toString(),
            loss: d.event.loss.toString(),
            debt_paid: d.event.debtPaid.toString(),
            total_gain: d.event.totalGain.toString(),
            total_loss: d.event.totalLoss.toString(),
            total_debt: d.event.totalDebt.toString(),
            debt_added: d.event.debtAdded.toString(),
            debt_ratio: d.event.debtRatio.toString(),
            block_number: d.block.number,
            tx_hash: d.rawEvent.transactionHash,
            log_index: d.rawEvent.logIndex,
            timestamp: d.timestamp.toISOString(),
          }))
          if (rows.length > 0) {
            await store.insert({
              table: 'yearn_v2_strategy_reported',
              values: rows,
              format: 'JSONEachRow',
            })
          }
        },
        onRollback: async ({ safeCursor, store }) => {
          await store.removeAllRows({
            tables: ['yearn_v2_strategy_reported'],
            where: 'block_number > {latest:UInt32}',
            params: { latest: safeCursor.number },
          })
        },
      }),
    )
}

void main()
