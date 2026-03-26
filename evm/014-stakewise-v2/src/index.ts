import 'dotenv/config'
import path from 'node:path'
import { createClient } from '@clickhouse/client'
import { evmPortalStream, evmDecoder } from '@subsquid/pipes/evm'
import { clickhouseTarget } from '@subsquid/pipes/targets/clickhouse'
import { z } from 'zod'

// Import generated ABIs
import { events as keeperEvents } from './contracts/0x6B5815467da09DaA7DC83Db21c9239d98Bb487b5.js'
import { events as osTokenControllerEvents } from './contracts/0x2A261e60FB14586B474C208b1B7AC6D0f5000306.js'
import { events as mevEscrowEvents } from './contracts/0x48319f97E5Da1233c21c48b80097c0FB7a20Ff86.js'

const env = z
  .object({
    CLICKHOUSE_USER: z.string(),
    CLICKHOUSE_PASSWORD: z.string(),
    CLICKHOUSE_URL: z.string(),
    CLICKHOUSE_DATABASE: z.string(),
  })
  .parse(process.env)

// StakeWise V3 contracts on Ethereum
const KEEPER = '0x6B5815467da09DaA7DC83Db21c9239d98Bb487b5'
const OSTOKEN_VAULT_CONTROLLER = '0x2A261e60FB14586B474C208b1B7AC6D0f5000306'
const SHARED_MEV_ESCROW = '0x48319f97E5Da1233c21c48b80097c0FB7a20Ff86'

// StakeWise V3 launched late 2023
const FROM_BLOCK = 18_500_000

function serializeJsonWithBigInt(obj: unknown): string {
  return JSON.stringify(obj, (_key, value) =>
    typeof value === 'bigint' ? value.toString() : value
  )
}

// Keeper: harvest reward events per vault
const keeperDecoder = evmDecoder({
  range: { from: FROM_BLOCK },
  contracts: [KEEPER],
  events: {
    harvested: keeperEvents.Harvested,
  },
})

// OsToken: mint/burn events
const osTokenDecoder = evmDecoder({
  range: { from: FROM_BLOCK },
  contracts: [OSTOKEN_VAULT_CONTROLLER],
  events: {
    mints: osTokenControllerEvents.Mint,
    burns: osTokenControllerEvents.Burn,
  },
})

// MEV escrow: received events
const mevDecoder = evmDecoder({
  range: { from: FROM_BLOCK },
  contracts: [SHARED_MEV_ESCROW],
  events: {
    mevReceived: mevEscrowEvents.MevReceived,
  },
})

export async function main() {
  await evmPortalStream({
    id: 'stakewise-v3-rewards',
    portal: 'https://portal.sqd.dev/datasets/ethereum-mainnet',
    outputs: {
      keeper: keeperDecoder,
      osToken: osTokenDecoder,
      mev: mevDecoder,
    },
  })
    .pipe(({ keeper, osToken, mev }) => ({
      harvests: keeper.harvested.map((d: any, i: number) => {
        return {
        block_number: d.block.number,
        timestamp: d.timestamp instanceof Date ? d.timestamp.toISOString() : new Date(Number(d.timestamp) * 1000).toISOString(),
        tx_hash: d.rawEvent.transactionHash,
        tx_index: d.rawEvent.transactionIndex,
        log_index: d.rawEvent.logIndex,
        vault: d.event.vault,
        rewards_root: d.event.rewardsRoot,
        total_assets_delta: d.event.totalAssetsDelta.toString(),
        unlocked_mev_delta: d.event.unlockedMevDelta.toString(),
        sign: 1,
      }}),
      mints: osToken.mints.map((d: any) => ({
        block_number: d.block.number,
        timestamp: d.timestamp instanceof Date ? d.timestamp.toISOString() : new Date(Number(d.timestamp) * 1000).toISOString(),
        tx_hash: d.rawEvent.transactionHash,
        tx_index: d.rawEvent.transactionIndex,
        log_index: d.rawEvent.logIndex,
        vault: d.event.vault,
        receiver: d.event.receiver,
        assets: d.event.assets.toString(),
        shares: d.event.shares.toString(),
        sign: 1,
      })),
      burns: osToken.burns.map((d: any) => ({
        block_number: d.block.number,
        timestamp: d.timestamp instanceof Date ? d.timestamp.toISOString() : new Date(Number(d.timestamp) * 1000).toISOString(),
        tx_hash: d.rawEvent.transactionHash,
        tx_index: d.rawEvent.transactionIndex,
        log_index: d.rawEvent.logIndex,
        vault: d.event.vault,
        owner: d.event.owner,
        assets: d.event.assets.toString(),
        shares: d.event.shares.toString(),
        sign: 1,
      })),
      mevReceived: mev.mevReceived.map((d: any) => ({
        block_number: d.block.number,
        timestamp: d.timestamp instanceof Date ? d.timestamp.toISOString() : new Date(Number(d.timestamp) * 1000).toISOString(),
        tx_hash: d.rawEvent.transactionHash,
        tx_index: d.rawEvent.transactionIndex,
        log_index: d.rawEvent.logIndex,
        assets: d.event.assets.toString(),
        sign: 1,
      })),
    }))
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
          if (data.harvests.length > 0) {
            await store.insert({ table: 'keeper_harvests', values: data.harvests, format: 'JSONEachRow' })
          }
          if (data.mints.length > 0) {
            await store.insert({ table: 'ostoken_mints', values: data.mints, format: 'JSONEachRow' })
          }
          if (data.burns.length > 0) {
            await store.insert({ table: 'ostoken_burns', values: data.burns, format: 'JSONEachRow' })
          }
          if (data.mevReceived.length > 0) {
            await store.insert({ table: 'mev_received', values: data.mevReceived, format: 'JSONEachRow' })
          }
        },
        onRollback: async ({ safeCursor, store }) => {
          await store.removeAllRows({
            tables: ['keeper_harvests', 'ostoken_mints', 'ostoken_burns', 'mev_received'],
            where: 'block_number > {latest:UInt64}',
            params: { latest: safeCursor.number },
          })
        },
      }),
    )
}

void main()
