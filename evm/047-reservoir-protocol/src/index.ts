import 'dotenv/config'
import path from 'node:path'
import { createClient } from '@clickhouse/client'
import { evmDecoder, evmPortalStream } from '@subsquid/pipes/evm'
import { clickhouseTarget } from '@subsquid/pipes/targets/clickhouse'
import { events as psmEvents } from './contracts/0x4809010926aec940b550D34a46A52739f996D75D.js'
import { enrichEvents, serializeJsonWithBigInt } from './utils/index.js'

// PSM contracts
const PSM_USDC = '0x4809010926aec940b550d34a46a52739f996d75d'
const PSM_USDT = '0xeae91b4c84e1edfa5d78dcae40962c7655a549b9'
const PSM_USD1 = '0x813b0857e016b7ae5fb57f464dfad8ee7b74232e'

const PSM_LABELS: Record<string, string> = {
  [PSM_USDC]: 'PSM:USDC',
  [PSM_USDT]: 'PSM:USDT',
  [PSM_USD1]: 'PSM:USD1',
}

// USD1 uses 18 decimals, USDC/USDT use 6 decimals
const PSM_DECIMALS: Record<string, number> = {
  [PSM_USDC]: 6,
  [PSM_USDT]: 6,
  [PSM_USD1]: 18,
}

function toUsd(amount: bigint, contract: string): number {
  const decimals = PSM_DECIMALS[contract.toLowerCase()] ?? 6
  return Number(amount) / (10 ** decimals)
}

// 90-day lookback for rare events
const LOOKBACK_DAYS = 90
const startDate = new Date(Date.now() - LOOKBACK_DAYS * 86_400_000)

const env = {
  CLICKHOUSE_USER: process.env.CLICKHOUSE_USER!,
  CLICKHOUSE_PASSWORD: process.env.CLICKHOUSE_PASSWORD!,
  CLICKHOUSE_URL: process.env.CLICKHOUSE_URL!,
  CLICKHOUSE_DATABASE: process.env.CLICKHOUSE_DATABASE!,
}

const decoder = evmDecoder({
  range: { from: startDate },
  contracts: [PSM_USDC, PSM_USDT, PSM_USD1],
  events: {
    Mint: psmEvents.Mint,
    Redeem: psmEvents.Redeem,
    Allocate: psmEvents.Allocate,
    Withdraw: psmEvents.Withdraw,
  },
}).pipe(enrichEvents)

export async function main() {
  await evmPortalStream({
    id: 'reservoir-psm-pulse',
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
        const rows: any[] = []

        for (const e of data.decoder.Mint) {
          rows.push({
            event_type: 'mint',
            psm_label: PSM_LABELS[e.contract.toLowerCase()] ?? 'UNKNOWN',
            from_addr: e.from.toLowerCase(),
            to_addr: e.to.toLowerCase(),
            signer: '',
            amount: String(e.amount),
            amount_usd: toUsd(e.amount, e.contract),
            event_timestamp: Number(e.timestamp),
            block_number: e.blockNumber,
            tx_hash: e.txHash,
            log_index: e.logIndex,
            timestamp: new Date(e.timestamp * 1000).toISOString(),
          })
        }

        for (const e of data.decoder.Redeem) {
          rows.push({
            event_type: 'redeem',
            psm_label: PSM_LABELS[e.contract.toLowerCase()] ?? 'UNKNOWN',
            from_addr: e.from.toLowerCase(),
            to_addr: e.to.toLowerCase(),
            signer: '',
            amount: String(e.amount),
            amount_usd: toUsd(e.amount, e.contract),
            event_timestamp: Number(e.timestamp),
            block_number: e.blockNumber,
            tx_hash: e.txHash,
            log_index: e.logIndex,
            timestamp: new Date(e.timestamp * 1000).toISOString(),
          })
        }

        for (const e of data.decoder.Allocate) {
          rows.push({
            event_type: 'allocate',
            psm_label: PSM_LABELS[e.contract.toLowerCase()] ?? 'UNKNOWN',
            from_addr: '',
            to_addr: '',
            signer: e.signer.toLowerCase(),
            amount: String(e.amount),
            amount_usd: toUsd(e.amount, e.contract),
            event_timestamp: Number(e.timestamp),
            block_number: e.blockNumber,
            tx_hash: e.txHash,
            log_index: e.logIndex,
            timestamp: new Date(e.timestamp * 1000).toISOString(),
          })
        }

        for (const e of data.decoder.Withdraw) {
          rows.push({
            event_type: 'withdraw',
            psm_label: PSM_LABELS[e.contract.toLowerCase()] ?? 'UNKNOWN',
            from_addr: '',
            to_addr: '',
            signer: e.signer.toLowerCase(),
            amount: String(e.amount),
            amount_usd: toUsd(e.amount, e.contract),
            event_timestamp: Number(e.timestamp),
            block_number: e.blockNumber,
            tx_hash: e.txHash,
            log_index: e.logIndex,
            timestamp: new Date(e.timestamp * 1000).toISOString(),
          })
        }

        if (rows.length > 0) {
          await store.insert({ table: 'psm_ops', values: rows, format: 'JSONEachRow' })
        }
      },
      onRollback: async ({ safeCursor, store }) => {
        await store.removeAllRows({
          tables: ['psm_ops'],
          where: 'block_number > {latest:UInt32}',
          params: { latest: safeCursor.number },
        })
      },
    }),
  )
}

void main()
