# Improvements: Yield Basis Indexer

## CLAUDE.md improvements

1. **Portal cross-reference validation approach**: The current instructions say to cross-reference event counts for the full indexed block range. For contracts with 6+ months of history and thousands of events, the Portal stream response can be very large and truncated. The sample-window approach (5000 blocks) works better for cross-referencing — should document this pattern.

2. **Scaffold generates too many tables**: The `pipes-new-indexer` scaffold generated 4 migration files (amm_trades, liquidity_events, vault_deposits, borrower_fees) but the actual indexer only needed 2 tables. Consider having the scaffold generate fewer, more generic tables or asking the user to confirm which events to index before generating migrations.

## Agent skills improvements

1. **portal-query-evm-logs**: The Portal cross-reference instructions should recommend sampling a fixed block window (e.g., 5000 blocks) rather than querying the full range, as large ranges may truncate or timeout.

## CLI improvements

- No new Pipes CLI issues encountered during this build. The scaffold and ABI generation worked correctly.

## What I learned

- Yield Basis is built on Curve by the same team (Michael Egorov). The contracts use Vyper 0.4.3 and the factory pattern to deploy markets (AMM + LT + VirtualPool + PriceOracle per market).
- The `DistributeBorrowerFees` event fires on every deposit, making it the most common leverage-related event — not just occasional fee claims.
- The protocol had a massive deposit spike in its first few weeks (Oct 2025) with 1500+ deposits/day, then settled into steady ~30-50/day activity.
