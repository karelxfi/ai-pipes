# Liquity V2 — BOLD Stablecoin Pulse

## Results
- 45,765 rows over 82 days (Jan 1 – Mar 23, 2026)
- $20.6M BOLD borrowed, $31.6M repaid, -$11M net (deleveraging)
- 33,815 transfers, 11,461 borrows, 489 repays
- 14/14 validation passed, Portal exact match (253 vs 253)

## Key decisions
- Tracked new BOLD token (`0x6440f144...`) — Liquity V2 was redeployed, legacy addresses have zero activity
- Classified Transfer events: mint from zero = borrow, burn to zero = repay
- 90-day lookback on Ethereum — synced ~5 min
