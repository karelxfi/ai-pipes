# Output — Drift Trade

## Angle
Index Drift v2 perpetual order flow — fills, placements, cancels, and liquidations — to build a comprehensive view of perp trading activity on Solana's largest derivatives exchange.

## Key Decisions
- **Anchor d8 discriminators:** Drift is an Anchor program, so all instructions use 8-byte discriminators computed as `SHA256("global:instruction_name")[0:8]`. Computed discriminators for all major order operations: FillPerpOrder, PlacePerpOrder, CancelOrderByUserId, PlaceAndTakePerpOrder, LiquidatePerp, Withdraw, and others.
- **Comprehensive coverage:** Tracked 6+ instruction types to capture the full perp lifecycle — not just fills, but placements, cancels, and liquidations too. This reveals the ratio of placed-to-filled orders and liquidation frequency.
- **High volume handling:** 1.9M rows in 5 days required careful ClickHouse schema design with appropriate partition keys and order by clauses.

## Issues Encountered
- CancelOrderByUserId dominates the dataset (1.1M of 1.9M rows) — this is expected behavior as market makers constantly cancel and replace orders.
- The sheer volume required running the indexer for an extended period to capture a full week of data.

## Result
1.9M rows indexed covering Mar 8-13 2026. The cancel-to-fill ratio (~19:1) reveals the high-frequency nature of Drift's order book. 5,900 liquidations in 5 days shows active risk management. All 10 validation checks passed.
