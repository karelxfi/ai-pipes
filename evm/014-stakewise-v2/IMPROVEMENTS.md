# Improvements — StakeWise V3

## CLAUDE.md Updates Needed

### DateTime64(3) timestamp gotcha
- **Issue:** ClickHouse `DateTime64(3, 'UTC')` interprets numeric epoch seconds as fractional seconds from epoch. Passing `1700392127` (epoch seconds) results in `1970-01-20` instead of `2023-11-19`.
- **Fix:** Always pass ISO strings when using DateTime64(3) with `date_time_input_format: 'best_effort'`. OR use `DateTime` (no sub-second precision) instead.
- **Applied:** Yes, updated to use `.toISOString()` in the pipe transform.

### evmDecoder contracts field format
- **Issue:** `contracts` expects `[address_string]`, not `[{ address: [addr] }]`. The object format is for the factory pattern only.
- **Fix:** Add to CLAUDE.md known issues.

## Agent Skills

### pipes-new-indexer: pipeComposite event field access
- **Issue:** The skill doesn't document how to access fields from decoded events in `pipeComposite` output. The correct pattern is `d.block.number`, `d.rawEvent.transactionHash`, `d.timestamp` (Date), `d.event.*`. This differs from the `enrichEvents` helper which flattens everything.
- **Fix:** Add a section on `pipeComposite` field access patterns.

### Skills patches applied
- Pending: `pipeComposite` field access documentation for pipes-new-indexer

## CLI Improvements
- No new CLI issues discovered.
