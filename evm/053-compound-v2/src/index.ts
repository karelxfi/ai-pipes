import 'dotenv/config'
import path from 'node:path'
import { createClient } from '@clickhouse/client'
import { evmDecoder, evmPortalStream } from '@subsquid/pipes/evm'
import { clickhouseTarget } from '@subsquid/pipes/targets/clickhouse'
import { events as cTokenEvents } from './contracts/CToken.js'
import { enrichEvents, serializeJsonWithBigInt } from './utils/index.js'

// Compound V2 cToken markets on Ethereum mainnet
const MARKETS: Record<string, string> = {
  '0x4ddc2d193948926d02f9b1fe9e1daa0718270ed5': 'cETH',
  '0x5d3a536e4d6dbd6114cc1ead35777bab948e3643': 'cDAI',
  '0x39aa39c021dfbae8fac545936693ac917d5e7563': 'cUSDC',
  '0xf650c3d88d12db855b8bf7d11be6c55a4e07dcc9': 'cUSDT',
  '0xccf4429db6322d5c611ee964527d42e5d685dd6a': 'cWBTC',
  '0x6c8c6b02e7b2be14d4fa6022dfd6d75921d90e4e': 'cBAT',
  '0xb3319f5d18bc0d84dd1b4825dcde5d5f7266d407': 'cZRX',
  '0x35a18000230da775cac24873d00ff85bccded550': 'cUNI',
  '0x70e36f6bf80a52b3b46b3af8e106cc0ed743e8e4': 'cCOMP',
  '0xface851a4921ce59e912d19329929ce6da6eb0c7': 'cLINK',
  '0x95b4ef2869ebd94beb4eee400a99824bf5dc325b': 'cMKR',
  '0x80a2ae356fc9ef4305676f7a3e2ed04e12c33946': 'cYFI',
  '0x12392f67bdf24fae0af363c24ac620a2f67dad86': 'cTUSD',
  '0x041171993284df560249b57358f931d9eb7b925d': 'cUSDP',
  '0x7713dd9ca933848f6819f38b8352d9a15ea73f67': 'cFEI',
  '0xc11b1268c1a384e55c48c2391d8d480264a3a7f4': 'cWBTC(old)',
  '0x158079ee67fce2f58472a96584a73c7ab9ac95c1': 'cREP',
}

const marketAddresses = Object.keys(MARKETS)

// 90-day lookback — Compound V2 is in wind-down mode with low activity
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
  contracts: marketAddresses,
  events: {
    Mint: cTokenEvents.Mint,
    Redeem: cTokenEvents.Redeem,
    Borrow: cTokenEvents.Borrow,
    RepayBorrow: cTokenEvents.RepayBorrow,
    LiquidateBorrow: cTokenEvents.LiquidateBorrow,
  },
}).pipe(enrichEvents)

export async function main() {
  await evmPortalStream({
    id: 'compound-v2-lending-pulse',
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
            market: MARKETS[e.contract.toLowerCase()] ?? e.contract.substring(0, 10),
            user_addr: e.minter.toLowerCase(),
            payer_addr: '',
            amount: String(e.mintAmount),
            amount_dec: Number(e.mintAmount) / 1e18,
            tokens: String(e.mintTokens),
            block_number: e.blockNumber,
            tx_hash: e.txHash,
            log_index: e.logIndex,
            timestamp: new Date(e.timestamp * 1000).toISOString(),
          })
        }

        for (const e of data.decoder.Redeem) {
          rows.push({
            event_type: 'redeem',
            market: MARKETS[e.contract.toLowerCase()] ?? e.contract.substring(0, 10),
            user_addr: e.redeemer.toLowerCase(),
            payer_addr: '',
            amount: String(e.redeemAmount),
            amount_dec: Number(e.redeemAmount) / 1e18,
            tokens: String(e.redeemTokens),
            block_number: e.blockNumber,
            tx_hash: e.txHash,
            log_index: e.logIndex,
            timestamp: new Date(e.timestamp * 1000).toISOString(),
          })
        }

        for (const e of data.decoder.Borrow) {
          rows.push({
            event_type: 'borrow',
            market: MARKETS[e.contract.toLowerCase()] ?? e.contract.substring(0, 10),
            user_addr: e.borrower.toLowerCase(),
            payer_addr: '',
            amount: String(e.borrowAmount),
            amount_dec: Number(e.borrowAmount) / 1e18,
            account_borrows: String(e.accountBorrows),
            total_borrows: String(e.totalBorrows),
            block_number: e.blockNumber,
            tx_hash: e.txHash,
            log_index: e.logIndex,
            timestamp: new Date(e.timestamp * 1000).toISOString(),
          })
        }

        for (const e of data.decoder.RepayBorrow) {
          rows.push({
            event_type: 'repay',
            market: MARKETS[e.contract.toLowerCase()] ?? e.contract.substring(0, 10),
            user_addr: e.borrower.toLowerCase(),
            payer_addr: e.payer.toLowerCase(),
            amount: String(e.repayAmount),
            amount_dec: Number(e.repayAmount) / 1e18,
            account_borrows: String(e.accountBorrows),
            total_borrows: String(e.totalBorrows),
            block_number: e.blockNumber,
            tx_hash: e.txHash,
            log_index: e.logIndex,
            timestamp: new Date(e.timestamp * 1000).toISOString(),
          })
        }

        for (const e of data.decoder.LiquidateBorrow) {
          rows.push({
            event_type: 'liquidation',
            market: MARKETS[e.contract.toLowerCase()] ?? e.contract.substring(0, 10),
            user_addr: e.borrower.toLowerCase(),
            payer_addr: e.liquidator.toLowerCase(),
            amount: String(e.repayAmount),
            amount_dec: Number(e.repayAmount) / 1e18,
            tokens: String(e.seizeTokens),
            block_number: e.blockNumber,
            tx_hash: e.txHash,
            log_index: e.logIndex,
            timestamp: new Date(e.timestamp * 1000).toISOString(),
          })
        }

        if (rows.length > 0) {
          await store.insert({ table: 'lending_events', values: rows, format: 'JSONEachRow' })
        }
      },
      onRollback: async ({ safeCursor, store }) => {
        await store.removeAllRows({
          tables: ['lending_events'],
          where: 'block_number > {latest:UInt32}',
          params: { latest: safeCursor.number },
        })
      },
    }),
  )
}

void main()
