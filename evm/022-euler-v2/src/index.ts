import 'dotenv/config'
import path from 'node:path'
import { createClient } from '@clickhouse/client'
import { evmPortalStream, evmDecoder } from '@subsquid/pipes/evm'
import { clickhouseTarget } from '@subsquid/pipes/targets/clickhouse'
import { z } from 'zod'

import { events as evcEvents } from './contracts/0x0C9a3dd6b8F28529d72d7f9cE918D493519EE383.js'
import { events as factoryEvents } from './contracts/0x29a56a1b8214D9Cf7c5561811750D5cBDb45CC8e.js'

const env = z
  .object({
    CLICKHOUSE_USER: z.string(),
    CLICKHOUSE_PASSWORD: z.string(),
    CLICKHOUSE_URL: z.string(),
    CLICKHOUSE_DATABASE: z.string(),
  })
  .parse(process.env)

// Euler V2 core contracts on Ethereum
const EVC = '0x0C9a3dd6b8F28529d72d7f9cE918D493519EE383'
const FACTORY = '0x29a56a1b8214D9Cf7c5561811750D5cBDb45CC8e'

// Factory deployed at block 20529225 (Aug 2024)
const FROM_BLOCK = 20_529_000

function serializeJsonWithBigInt(obj: unknown): string {
  return JSON.stringify(obj, (_key, value) =>
    typeof value === 'bigint' ? value.toString() : value
  )
}

const evcDecoder = evmDecoder({
  range: { from: FROM_BLOCK },
  contracts: [EVC],
  events: {
    callWithContext: evcEvents.CallWithContext,
    vaultStatusCheck: evcEvents.VaultStatusCheck,
    accountStatusCheck: evcEvents.AccountStatusCheck,
  },
})

const factoryDecoder = evmDecoder({
  range: { from: FROM_BLOCK },
  contracts: [FACTORY],
  events: {
    proxyCreated: factoryEvents.ProxyCreated,
  },
})

function toIso(d: any): string {
  return d.timestamp instanceof Date ? d.timestamp.toISOString() : new Date(Number(d.timestamp) * 1000).toISOString()
}

interface EulerEvent {
  block_number: number
  timestamp: string
  tx_hash: string
  event_type: string
  caller: string
  account: string
  vault: string
  selector: string
  proxy: string
  implementation: string
  sign: number
}

export async function main() {
  await evmPortalStream({
    id: 'euler-v2-events',
    portal: 'https://portal.sqd.dev/datasets/ethereum-mainnet',
    outputs: {
      evc: evcDecoder,
      factory: factoryDecoder,
    },
  })
    .pipe(({ evc, factory }) => {
      const events: EulerEvent[] = []

      for (const d of evc.callWithContext) {
        events.push({
          block_number: d.block.number,
          timestamp: toIso(d),
          tx_hash: d.rawEvent.transactionHash,
          event_type: 'call',
          caller: d.event.caller,
          account: d.event.onBehalfOfAccount,
          vault: d.event.targetContract,
          selector: d.event.selector,
          proxy: '', implementation: '',
          sign: 1,
        })
      }

      for (const d of evc.vaultStatusCheck) {
        events.push({
          block_number: d.block.number,
          timestamp: toIso(d),
          tx_hash: d.rawEvent.transactionHash,
          event_type: 'vault_check',
          caller: '', account: '',
          vault: d.event.vault,
          selector: '', proxy: '', implementation: '',
          sign: 1,
        })
      }

      for (const d of evc.accountStatusCheck) {
        events.push({
          block_number: d.block.number,
          timestamp: toIso(d),
          tx_hash: d.rawEvent.transactionHash,
          event_type: 'account_check',
          caller: '',
          account: d.event.account,
          vault: d.event.controller,
          selector: '', proxy: '', implementation: '',
          sign: 1,
        })
      }

      for (const d of factory.proxyCreated) {
        events.push({
          block_number: d.block.number,
          timestamp: toIso(d),
          tx_hash: d.rawEvent.transactionHash,
          event_type: 'vault_created',
          caller: '', account: '',
          vault: '',
          selector: '',
          proxy: d.event.proxy,
          implementation: d.event.implementation,
          sign: 1,
        })
      }

      return { events }
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
          const events = (data as any).events as EulerEvent[]
          if (events.length === 0) return
          await store.insert({
            table: 'euler_events',
            values: events,
            format: 'JSONEachRow',
          })
        },
        onRollback: async ({ safeCursor, store }) => {
          await store.removeAllRows({
            tables: ['euler_events'],
            where: 'block_number > {latest:UInt64}',
            params: { latest: safeCursor.number },
          })
        },
      }),
    )
}

void main()
