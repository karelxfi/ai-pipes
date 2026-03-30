import 'dotenv/config'
import path from 'node:path'
import { createClient } from '@clickhouse/client'
import { evmDecoder, evmPortalStream } from '@subsquid/pipes/evm'
import { clickhouseTarget } from '@subsquid/pipes/targets/clickhouse'
import { z } from 'zod'
import { events as hubEvents } from './contracts/hub.js'
import { events as spokeEvents } from './contracts/spoke.js'
import { enrichEvents, serializeJsonWithBigInt } from './utils/index.js'
import { ALL_HUB_ADDRESSES, ALL_SPOKE_ADDRESSES, DEPLOYMENT_BLOCK } from './utils/addresses.js'

const env = z.object({
  CLICKHOUSE_USER: z.string(),
  CLICKHOUSE_PASSWORD: z.string(),
  CLICKHOUSE_URL: z.string(),
  CLICKHOUSE_DATABASE: z.string(),
}).parse(process.env)

const hubDecoder = evmDecoder({
  range: { from: String(DEPLOYMENT_BLOCK) },
  contracts: ALL_HUB_ADDRESSES,
  events: {
    Add: hubEvents.Add,
    Remove: hubEvents.Remove,
    Draw: hubEvents.Draw,
    Restore: hubEvents.Restore,
  },
}).pipe(enrichEvents)

const spokeDecoder = evmDecoder({
  range: { from: String(DEPLOYMENT_BLOCK) },
  contracts: ALL_SPOKE_ADDRESSES,
  events: {
    Supply: spokeEvents.Supply,
    Withdraw: spokeEvents.Withdraw,
    Borrow: spokeEvents.Borrow,
    Repay: spokeEvents.Repay,
    LiquidationCall: spokeEvents.LiquidationCall,
  },
}).pipe(enrichEvents)

export async function main() {
  await evmPortalStream({
    id: 'aave-v4-launch-monitor',
    portal: 'https://portal.sqd.dev/datasets/ethereum-mainnet',
    outputs: { hubDecoder, spokeDecoder },
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
        // Hub flows — Add, Remove use shares/amount; Draw uses drawnShares/drawnAmount;
        // Restore uses drawnShares/drawnAmount (plus premiumDelta struct we skip)
        for (const eventType of ['Add', 'Remove', 'Draw', 'Restore'] as const) {
          const events = data.hubDecoder[eventType]
          if (events.length > 0) {
            await store.insert({
              table: 'hub_flows',
              values: events.map(e => ({
                event_type: eventType,
                hub: e.contract,
                asset_id: String(e.assetId),
                spoke: e.spoke,
                shares: String(e.shares ?? e.drawnShares ?? 0n),
                amount: String(e.amount ?? e.drawnAmount ?? 0n),
                block_number: e.blockNumber,
                tx_hash: e.txHash,
                log_index: e.logIndex,
                timestamp: new Date(e.timestamp * 1000).toISOString(),
              })),
              format: 'JSONEachRow',
            })
          }
        }

        // Spoke events — Supply/Withdraw/Borrow/Repay each have different field names
        // for shares and amounts, so we coalesce with ??
        for (const eventType of ['Supply', 'Withdraw', 'Borrow', 'Repay'] as const) {
          const events = data.spokeDecoder[eventType]
          if (events.length > 0) {
            await store.insert({
              table: 'spoke_events',
              values: events.map(e => ({
                event_type: eventType,
                spoke: e.contract,
                reserve_id: String(e.reserveId),
                caller: e.caller,
                user: e.user,
                shares: String(e.suppliedShares ?? e.withdrawnShares ?? e.drawnShares ?? 0n),
                amount: String(e.suppliedAmount ?? e.withdrawnAmount ?? e.drawnAmount ?? e.totalAmountRepaid ?? 0n),
                block_number: e.blockNumber,
                tx_hash: e.txHash,
                log_index: e.logIndex,
                timestamp: new Date(e.timestamp * 1000).toISOString(),
              })),
              format: 'JSONEachRow',
            })
          }
        }

        // Liquidations
        const liqs = data.spokeDecoder.LiquidationCall
        if (liqs.length > 0) {
          await store.insert({
            table: 'liquidations',
            values: liqs.map(e => ({
              spoke: e.contract,
              collateral_reserve_id: String(e.collateralReserveId),
              debt_reserve_id: String(e.debtReserveId),
              user: e.user,
              liquidator: e.liquidator,
              receive_shares: e.receiveShares,
              debt_amount_restored: String(e.debtAmountRestored),
              drawn_shares_liquidated: String(e.drawnSharesLiquidated),
              collateral_amount_removed: String(e.collateralAmountRemoved),
              collateral_shares_liquidated: String(e.collateralSharesLiquidated),
              collateral_shares_to_liquidator: String(e.collateralSharesToLiquidator),
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
        for (const table of ['hub_flows', 'spoke_events', 'liquidations']) {
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
