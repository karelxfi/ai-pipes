# Output — GMX V2 Perps

## Angle
Track perpetual trading activity on GMX V2 via the centralized EventEmitter pattern — 37 unique event types showing orders, executions, positions, and fees.

## Key Decisions
1. **EventEmitter as single indexing target** — GMX V2 routes ALL protocol events through one contract. This means we get complete protocol activity from a single address.
2. **Extract eventName only, skip nested struct decoding** — The EventLogData struct is deeply nested (7 typed key-value arrays). We extract `eventName` and `msgSender` without decoding the full payload. This gives us event type distribution and activity patterns without the complexity.
3. **Arbitrum dataset name** — Portal uses `arbitrum-one` not `arbitrum`. Added to learnings.

## Issues Encountered
- Wrong Portal dataset name (`arbitrum` → `arbitrum-one`): 404 error
- Node.js v25 zstd crash on large Arbitrum sync: known issue, indexer resumes from cursor automatically
- Very high data rate (~40MB/s from Portal): GMX generates massive event volume (~22K events/day)

## Results
- 776,298 events in 34 days (Aug-Sep 2023)
- 37 unique event types
- Top events: KeeperExecutionFee (45.6K), OrderCreated (43.6K), OraclePriceUpdate (41.8K), OrderExecuted (38K), PositionFeesCollected (35.1K)
- 9 unique senders (keeper bots + ExchangeRouter)
