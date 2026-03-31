import 'dotenv/config'
import path from 'node:path'
import { createClient } from '@clickhouse/client'
import { evmDecoder, evmPortalStream } from '@subsquid/pipes/evm'
import { clickhouseTarget } from '@subsquid/pipes/targets/clickhouse'
import { z } from 'zod'
import { events as iusdEvents } from './contracts/iusd.js'
import { events as siusdEvents } from './contracts/siusd.js'
import { enrichEvents, serializeJsonWithBigInt } from './utils/index.js'

const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000'

const IUSD = '0x48f9e38f3070ad8945dfeae3fa70987722e3d89c'
const SIUSD = '0xDBDC1Ef57537E34680B898E1FEBD3D68c7389bCB'
const DEPLOYMENT_BLOCK = 23000000

const env = z.object({
  CLICKHOUSE_USER: z.string(),
  CLICKHOUSE_PASSWORD: z.string(),
  CLICKHOUSE_URL: z.string(),
  CLICKHOUSE_DATABASE: z.string(),
}).parse(process.env)

const iusdDecoder = evmDecoder({
  range: { from: String(DEPLOYMENT_BLOCK) },
  contracts: [IUSD],
  events: {
    Transfer: iusdEvents.Transfer,
  },
}).pipe(enrichEvents)

const siusdDecoder = evmDecoder({
  range: { from: String(DEPLOYMENT_BLOCK) },
  contracts: [SIUSD],
  events: {
    Deposit: siusdEvents.Deposit,
    Withdraw: siusdEvents.Withdraw,
  },
}).pipe(enrichEvents)

function classifyTransfer(from: string, to: string): string {
  if (from === ZERO_ADDRESS) return 'mint'
  if (to === ZERO_ADDRESS) return 'burn'
  return 'transfer'
}

export async function main() {
  await evmPortalStream({
    id: 'infinifi-reserve-pulse',
    portal: 'https://portal.sqd.dev/datasets/ethereum-mainnet',
    outputs: { iusdDecoder, siusdDecoder },
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
        const transfers = data.iusdDecoder.Transfer
        if (transfers.length > 0) {
          await store.insert({
            table: 'iusd_transfers',
            values: transfers.map(e => ({
              transfer_type: classifyTransfer(e.from, e.to),
              from_addr: e.from,
              to_addr: e.to,
              value: String(e.value),
              block_number: e.blockNumber,
              tx_hash: e.txHash,
              log_index: e.logIndex,
              timestamp: new Date(e.timestamp * 1000).toISOString(),
            })),
            format: 'JSONEachRow',
          })
        }

        const deposits = data.siusdDecoder.Deposit
        if (deposits.length > 0) {
          await store.insert({
            table: 'siusd_vault',
            values: deposits.map(e => ({
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
            format: 'JSONEachRow',
          })
        }

        const withdrawals = data.siusdDecoder.Withdraw
        if (withdrawals.length > 0) {
          await store.insert({
            table: 'siusd_vault',
            values: withdrawals.map(e => ({
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
            format: 'JSONEachRow',
          })
        }
      },
      onRollback: async ({ safeCursor, store }) => {
        for (const table of ['iusd_transfers', 'siusd_vault']) {
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
