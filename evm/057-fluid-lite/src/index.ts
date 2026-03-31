import 'dotenv/config'
import path from 'node:path'
import { createClient } from '@clickhouse/client'
import { evmDecoder, evmPortalStream } from '@subsquid/pipes/evm'
import { clickhouseTarget } from '@subsquid/pipes/targets/clickhouse'
import { z } from 'zod'
import { events as liteUsdEvents } from './contracts/FluidLiteUSD.js'
import { events as liteEthEvents } from './contracts/InstaLiteETHv2.js'
import { enrichEvents, serializeJsonWithBigInt } from './utils/index.js'

// Proxy addresses (events emitted from these)
const FLITEUSD = '0x273da948aca9261043fbdb2a857bc255ecc29012'
const IETHV2 = '0xa0d3707c569ff8c87fa923d3823ec5d81c98be78'

// iETHv2 deployed ~block 17000000, fLiteUSD deployed ~block 24726000
const IETHV2_START = 17000000
const FLITEUSD_START = 24726000

const env = z.object({
  CLICKHOUSE_USER: z.string(),
  CLICKHOUSE_PASSWORD: z.string(),
  CLICKHOUSE_URL: z.string(),
  CLICKHOUSE_DATABASE: z.string(),
}).parse(process.env)

function vaultName(addr: string): string {
  if (addr.toLowerCase() === FLITEUSD) return 'fLiteUSD'
  if (addr.toLowerCase() === IETHV2) return 'iETHv2'
  return addr.substring(0, 10)
}

// --- fLiteUSD decoder: Deposit, Withdraw, ExchangePrice, Fees, PullPush ---
const usdDecoder = evmDecoder({
  range: { from: String(FLITEUSD_START) },
  contracts: [FLITEUSD],
  events: {
    Deposit: liteUsdEvents.Deposit,
    Withdraw: liteUsdEvents.Withdraw,
    LogCheckpointExchangePrice: liteUsdEvents.LogCheckpointExchangePrice,
    LogWithdrawFee: liteUsdEvents.LogWithdrawFee,
    LogPullFunds: liteUsdEvents.LogPullFunds,
    LogPushFunds: liteUsdEvents.LogPushFunds,
  },
}).pipe(enrichEvents)

// --- iETHv2 decoder: Deposit, Withdraw, ExchangePrice, Refinance, Leverage ---
const ethDecoder = evmDecoder({
  range: { from: String(IETHV2_START) },
  contracts: [IETHV2],
  events: {
    Deposit: liteEthEvents.Deposit,
    Withdraw: liteEthEvents.Withdraw,
    LogUpdateExchangePrice: liteEthEvents.LogUpdateExchangePrice,
    LogRefinance: liteEthEvents.LogRefinance,
    LogCollectRevenue: liteEthEvents.LogCollectRevenue,
  },
}).pipe(enrichEvents)

export async function main() {
  await evmPortalStream({
    id: 'fluid-lite-vault-pulse',
    portal: 'https://portal.sqd.dev/datasets/ethereum-mainnet',
    outputs: { usdDecoder, ethDecoder },
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
        // --- Vault events (deposits + withdraws for both vaults) ---
        const vaultEvents = [
          ...data.usdDecoder.Deposit.map(e => ({
            vault: vaultName(e.contract),
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
          ...data.usdDecoder.Withdraw.map(e => ({
            vault: vaultName(e.contract),
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
          ...data.ethDecoder.Deposit.map(e => ({
            vault: vaultName(e.contract),
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
          ...data.ethDecoder.Withdraw.map(e => ({
            vault: vaultName(e.contract),
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

        // --- Exchange prices ---
        const prices = [
          ...data.usdDecoder.LogCheckpointExchangePrice.map(e => ({
            vault: 'fLiteUSD',
            price_before: '',
            price_after: String(e.newPrice),
            block_number: e.blockNumber,
            tx_hash: e.txHash,
            log_index: e.logIndex,
            timestamp: new Date(e.timestamp * 1000).toISOString(),
          })),
          ...data.ethDecoder.LogUpdateExchangePrice.map(e => ({
            vault: 'iETHv2',
            price_before: String(e.exchangePriceBefore),
            price_after: String(e.exchangePriceAfter),
            block_number: e.blockNumber,
            tx_hash: e.txHash,
            log_index: e.logIndex,
            timestamp: new Date(e.timestamp * 1000).toISOString(),
          })),
        ]
        if (prices.length > 0) {
          await store.insert({ table: 'exchange_prices', values: prices, format: 'JSONEachRow' })
        }

        // --- Strategy operations ---
        const stratOps = [
          ...data.usdDecoder.LogPullFunds.map(e => ({
            vault: 'fLiteUSD',
            op_type: 'pull_funds',
            amount: String(e.amount),
            protocol_from: 0,
            protocol_to: 0,
            block_number: e.blockNumber,
            tx_hash: e.txHash,
            log_index: e.logIndex,
            timestamp: new Date(e.timestamp * 1000).toISOString(),
          })),
          ...data.usdDecoder.LogPushFunds.map(e => ({
            vault: 'fLiteUSD',
            op_type: 'push_funds',
            amount: String(e.amount),
            protocol_from: 0,
            protocol_to: 0,
            block_number: e.blockNumber,
            tx_hash: e.txHash,
            log_index: e.logIndex,
            timestamp: new Date(e.timestamp * 1000).toISOString(),
          })),
          ...data.ethDecoder.LogRefinance.map(e => ({
            vault: 'iETHv2',
            op_type: 'refinance',
            amount: String(e.wstETHflashAmount),
            protocol_from: Number(e.protocolFrom),
            protocol_to: Number(e.protocolTo),
            block_number: e.blockNumber,
            tx_hash: e.txHash,
            log_index: e.logIndex,
            timestamp: new Date(e.timestamp * 1000).toISOString(),
          })),
          ...data.ethDecoder.LogCollectRevenue.map(e => ({
            vault: 'iETHv2',
            op_type: 'collect_revenue',
            amount: String(e.amount),
            protocol_from: 0,
            protocol_to: 0,
            block_number: e.blockNumber,
            tx_hash: e.txHash,
            log_index: e.logIndex,
            timestamp: new Date(e.timestamp * 1000).toISOString(),
          })),
        ]
        if (stratOps.length > 0) {
          await store.insert({ table: 'strategy_ops', values: stratOps, format: 'JSONEachRow' })
        }

        // --- Withdraw fees ---
        const fees = data.usdDecoder.LogWithdrawFee.map(e => ({
          vault: 'fLiteUSD',
          owner: e.owner,
          fee: String(e.fee),
          block_number: e.blockNumber,
          tx_hash: e.txHash,
          log_index: e.logIndex,
          timestamp: new Date(e.timestamp * 1000).toISOString(),
        }))
        if (fees.length > 0) {
          await store.insert({ table: 'withdraw_fees', values: fees, format: 'JSONEachRow' })
        }
      },
      onRollback: async ({ safeCursor, store }) => {
        for (const table of ['vault_events', 'exchange_prices', 'strategy_ops', 'withdraw_fees']) {
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
