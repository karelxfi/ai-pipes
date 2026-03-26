import 'dotenv/config'
import path from 'node:path'
import { createClient } from '@clickhouse/client'
import { evmPortalStream, evmDecoder } from '@subsquid/pipes/evm'
import { clickhouseTarget } from '@subsquid/pipes/targets/clickhouse'
import { z } from 'zod'

import { events as emitterEvents } from './contracts/0xC8ee91A54287DB53897056e12D9819156D3822Fb.js'

const env = z
  .object({
    CLICKHOUSE_USER: z.string(),
    CLICKHOUSE_PASSWORD: z.string(),
    CLICKHOUSE_URL: z.string(),
    CLICKHOUSE_DATABASE: z.string(),
  })
  .parse(process.env)

// GMX V2 EventEmitter on Arbitrum
const EVENT_EMITTER = '0xC8ee91A54287DB53897056e12D9819156D3822Fb'

// GMX V2 launched Aug 2023 on Arbitrum (~block 120,000,000)
const FROM_BLOCK = 120_000_000

function serializeJsonWithBigInt(obj: unknown): string {
  return JSON.stringify(obj, (_key, value) =>
    typeof value === 'bigint' ? value.toString() : value
  )
}

const eventLog1Decoder = evmDecoder({
  range: { from: FROM_BLOCK },
  contracts: [EVENT_EMITTER],
  events: {
    eventLog1: emitterEvents.EventLog1,
  },
})

const eventLog2Decoder = evmDecoder({
  range: { from: FROM_BLOCK },
  contracts: [EVENT_EMITTER],
  events: {
    eventLog2: emitterEvents.EventLog2,
  },
})

function toIso(d: any): string {
  return d.timestamp instanceof Date ? d.timestamp.toISOString() : new Date(Number(d.timestamp) * 1000).toISOString()
}

interface GmxEvent {
  block_number: number
  timestamp: string
  tx_hash: string
  tx_index: number
  log_index: number
  event_name: string
  msg_sender: string
  event_variant: string
  sign: number
}

export async function main() {
  await evmPortalStream({
    id: 'gmx-v2-perps',
    portal: 'https://portal.sqd.dev/datasets/arbitrum-one',
    outputs: {
      log1: eventLog1Decoder,
      log2: eventLog2Decoder,
    },
  })
    .pipe(({ log1, log2 }) => {
      const events: GmxEvent[] = []

      for (const d of log1.eventLog1) {
        events.push({
          block_number: d.block.number,
          timestamp: toIso(d),
          tx_hash: d.rawEvent.transactionHash,
          tx_index: d.rawEvent.transactionIndex,
          log_index: d.rawEvent.logIndex,
          event_name: d.event.eventName,
          msg_sender: d.event.msgSender,
          event_variant: 'EventLog1',
          sign: 1,
        })
      }

      for (const d of log2.eventLog2) {
        events.push({
          block_number: d.block.number,
          timestamp: toIso(d),
          tx_hash: d.rawEvent.transactionHash,
          tx_index: d.rawEvent.transactionIndex,
          log_index: d.rawEvent.logIndex,
          event_name: d.event.eventName,
          msg_sender: d.event.msgSender,
          event_variant: 'EventLog2',
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
          const events = (data as any).events as GmxEvent[]
          if (events.length === 0) return
          await store.insert({
            table: 'gmx_events',
            values: events,
            format: 'JSONEachRow',
          })
        },
        onRollback: async ({ safeCursor, store }) => {
          await store.removeAllRows({
            tables: ['gmx_events'],
            where: 'block_number > {latest:UInt64}',
            params: { latest: safeCursor.number },
          })
        },
      }),
    )
}

void main()
