export function serializeJsonWithBigInt(obj: unknown): string {
  return JSON.stringify(obj, (_key, value) => (typeof value === 'bigint' ? value.toString() : value))
}

import type { EventResponse, Events } from '@subsquid/pipes/evm'

export type ExtendEventResponse<ER extends EventResponse<Events, string[]>, Extra extends object> = {
  [K in keyof ER]: ER[K] extends Array<infer E> ? Array<E & Extra> : never
}

export interface EnrichedEventMeta {
  blockNumber: number
  txHash: string
  logIndex: number
  timestamp: number
  contract: string
}

export function enrichEvents<T extends EventResponse<Events, string[]>>(
  obj: T,
): ExtendEventResponse<T, EnrichedEventMeta> {
  const result = {} as ExtendEventResponse<T, EnrichedEventMeta>
  for (const key in obj) {
    const value = obj[key]
    result[key] = (value as any[]).map((v) => ({
      ...v.event,
      blockNumber: v.block.number,
      txHash: v.rawEvent.transactionHash,
      logIndex: v.rawEvent.logIndex,
      timestamp: new Date(v.timestamp).getTime() / 1000,
      contract: v.contract,
    })) as ExtendEventResponse<T, EnrichedEventMeta>[typeof key]
  }
  return result
}
