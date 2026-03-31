# Output

## What happened

Built a Cooler Loans V2 indexer targeting the MonoCooler contract (`0xdb591Ea2e5Db886dA872654D58f6cc584b68e7cC`) on Ethereum. The contract is part of Olympus DAO's treasury-backed lending system where users deposit gOHM collateral to borrow USDS at a fixed 0.5% APR with no price-based liquidations.

## Key decisions

1. **Focused on MonoCooler V2 only** — V1 Clearinghouse contracts exist but V2 is the active system with all current activity. The V1 contracts would add complexity without much additional insight.

2. **Two tables: `loan_events` + `liquidations`** — Unified Borrow/Repay/CollateralAdded/CollateralWithdrawn into a single `loan_events` table with `event_type` column since they share similar fields (caller, account, amount). Liquidations kept separate due to unique fields (collateral_seized, debt_wiped, incentives).

3. **Deployment block 22425730** — Contract deployed around May 2025. First real activity (Borrow/CollateralAdded) starts around block 22570000.

4. **Zero liquidations confirmed** — The protocol claims "no price-based liquidations" and indeed no Liquidated events were emitted in ~10 months of operation. The liquidations table exists but is empty, which is expected behavior.

## Issues resolved

- Portal Stream API requires `"type": "evm"` field in the request body — not documented obviously, discovered by trial and error.
- Portal cross-reference needed small sample ranges (10k blocks) rather than full-range queries which either paginate or timeout.
- Reused existing ClickHouse instance from prior indexer (055-aave-v4) rather than starting a conflicting container on port 8123.

## Results

- **12,883 loan events** indexed across ~10 months (May 2025 — March 2026)
- 4,976 Borrows, 4,867 CollateralAdded, 1,522 CollateralWithdrawn, 1,518 Repay
- Cumulative borrow volume ~140M USDS
- One dominant borrower (0xe6c5...f3ff) with 4,359 events — likely the Olympus Treasury itself
- All 25 validation checks passed
