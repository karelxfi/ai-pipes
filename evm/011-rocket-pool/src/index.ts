import 'dotenv/config'
import path from 'node:path'
import { createClient } from '@clickhouse/client'
import { evmDecoder, evmPortalStream } from '@subsquid/pipes/evm'
import { clickhouseTarget } from '@subsquid/pipes/targets/clickhouse'
import { z } from 'zod'
import { events as rethEvents } from './contracts/0xae78736Cd615f374D3085123A210448E74Fc6393.js'
import { serializeJsonWithBigInt } from './utils/index.js'

const env = z
  .object({
    CLICKHOUSE_USER: z.string(),
    CLICKHOUSE_PASSWORD: z.string(),
    CLICKHOUSE_URL: z.string(),
    CLICKHOUSE_DATABASE: z.string(),
  })
  .parse(process.env)

// rETH token contract on Ethereum — NOT a proxy
const flows = evmDecoder({
  // rETH deployed Oct 2021, block ~13325233
  range: { from: '13325233' },
  contracts: ['0xae78736Cd615f374D3085123A210448E74Fc6393'],
  events: {
    minted: rethEvents.TokensMinted,
    burned: rethEvents.TokensBurned,
  },
}).pipe(({ minted, burned }) => {
  const rows = [
    ...minted.map((d) => ({
      event_type: 'mint',
      user: d.event.to,
      reth_amount: d.event.amount,
      eth_amount: d.event.ethAmount,
      block_number: d.block.number,
      tx_hash: d.rawEvent.transactionHash,
      log_index: d.rawEvent.logIndex,
      timestamp: Math.floor(new Date(d.timestamp).getTime() / 1000),
      sign: 1,
    })),
    ...burned.map((d) => ({
      event_type: 'burn',
      user: d.event.from,
      reth_amount: d.event.amount,
      eth_amount: d.event.ethAmount,
      block_number: d.block.number,
      tx_hash: d.rawEvent.transactionHash,
      log_index: d.rawEvent.logIndex,
      timestamp: Math.floor(new Date(d.timestamp).getTime() / 1000),
      sign: 1,
    })),
  ]
  return { flows: rows }
})

export async function main() {
  await evmPortalStream({
    id: 'rocket-pool-flows',
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
              table: 'reth_flows',
              values: data.flows.flows,
              format: 'JSONEachRow',
            })
          }
        },
        onRollback: async ({ safeCursor, store }) => {
          await store.removeAllRows({
            tables: ['reth_flows'],
            where: 'block_number > {latest:UInt32}',
            params: { latest: safeCursor.number },
          })
        },
      }),
    )
}

void main()
