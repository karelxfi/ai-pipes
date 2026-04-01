import 'dotenv/config'
import path from 'node:path'
import { createClient } from '@clickhouse/client'
import { evmDecoder, evmPortalStream } from '@subsquid/pipes/evm'
import { clickhouseTarget } from '@subsquid/pipes/targets/clickhouse'
import { events as qiEvents } from './contracts/QiToken.js'
import { enrichEvents, serializeJsonWithBigInt } from './utils/index.js'

// All active Benqi qiToken markets on Avalanche C-Chain
const MARKETS: Record<string, string> = {
  '0x5c0401e81bc07ca70fad469b451682c0d747ef1c': 'qiAVAX',
  '0xf362fea9659cf036792c9cb02f8ff8198e21b4cb': 'qisAVAX',
  '0x89a415b3d20098e6a6c8f7a59001c67bd3129821': 'qiBTC.b',
  '0xe194c4c5ac32a3c9ffdb358d9bfd523a0b6d1568': 'qiBTC',
  '0x334ad834cd4481bb02d09615e7c11a00579a7909': 'qiETH',
  '0x4e9f683a27a6bdad3fc2764003759277e93696e6': 'qiLINK',
  '0xc9e5999b8e75c3feb117f6f73e664b9f3c8ca65c': 'qiUSDT',
  '0xbeb5d47a3f720ec0a390d04b4d41ed7d9688bc7f': 'qiUSDC',
  '0xd8fcda6ec4bdc547c0827b8804e89acd817d56ef': 'qiUSDTn',
  '0xb715808a78f6041e46d61cb123c9b4a27056ae9c': 'qiUSDCn',
  '0x835866d37afb8cb8f8334dccdaf66cf01832ff5d': 'qiDAI',
  '0x872670ccae8c19557cc9443eff587d7086b8043a': 'qiBUSD',
  '0x35bd6aeda81a7e5fc7a7832490e71f757b0cd9ce': 'qiQI',
}

const marketAddresses = Object.keys(MARKETS)

// 7-day lookback — Avalanche has ~2s blocks but high event volume
const LOOKBACK_DAYS = 7
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
    Mint: qiEvents.Mint,
    Redeem: qiEvents.Redeem,
    Borrow: qiEvents.Borrow,
    RepayBorrow: qiEvents.RepayBorrow,
    LiquidateBorrow: qiEvents.LiquidateBorrow,
  },
}).pipe(enrichEvents)

export async function main() {
  await evmPortalStream({
    id: 'benqi-lending-pulse',
    portal: 'https://portal.sqd.dev/datasets/avalanche-mainnet',
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
