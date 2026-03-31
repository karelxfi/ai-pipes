# EtherFi Cash — Credit Card on Chain

## What Happened

Built an indexer for ether.fi's Cash system on Scroll — a crypto credit card that lets users spend against their staked ETH without selling it.

## Key Decisions

1. **Chose UserSafeEventEmitter** (`0x5423...162e`) over DebtManager — the event emitter aggregates all user activity (spending, cashback, debt management) in one contract, giving us a complete view of the credit card lifecycle.

2. **Proxy contract handling** — the emitter is a UUPS proxy. Used the implementation address (`0x5a85...5d5`) to generate correct ABI typings, then indexed events from the proxy address.

3. **Three tables**: `cash_events` (Spend + Cashback), `debt_events` (Repay), `swaps` — separating financial activity types for clean dashboard queries.

4. **Mode tracking** — Spend events include a `mode` field (0 = Direct Pay, 1 = Borrow). 72% of spends use Borrow mode, showing this is primarily used as a credit card, not a debit card.

## Issues Resolved

- AddCollateralToDebtManager, BorrowFromDebtManager, WithdrawCollateralFromDebtManager events don't exist on the UserSafeEventEmitter despite being in the ABI — these flows go through the DebtManager contract directly.
- Scroll dataset doesn't support real-time head streaming (warning logged, expected behavior).
- Port 8123 conflict — reused existing ClickHouse instance from previous indexer, just created a new database.

## Results

- 15,312 cash events (7,656 Spend + 7,656 Cashback — perfect 1:1 ratio)
- 289 debt repayment events
- 481 swap events
- 108 unique users
- ~$1.09M total spend volume
- Date range: 2024-11-27 to 2025-04-17 (4.7 months)
