export function serializeJsonWithBigInt(obj: unknown): string {
  return JSON.stringify(obj, (_key, value) => (typeof value === 'bigint' ? value.toString() : value))
}
