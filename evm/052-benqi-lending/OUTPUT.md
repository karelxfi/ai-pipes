# Benqi Lending — Avalanche Lending Pulse

## What happened

Built a multi-market indexer for Benqi on Avalanche C-Chain, tracking all 5 Compound-style events (Mint, Redeem, Borrow, RepayBorrow, LiquidateBorrow) across 13 qiToken markets.

## Key decisions

1. **All markets in one decoder** — Passed all 13 qiToken addresses to a single evmDecoder. Same ABI across all markets (Compound fork pattern).

2. **7-day lookback** — Avalanche has 2s blocks but high event volume. 7 days gave 8K+ rows which is plenty for the dashboard. qiUSDCn alone generated 5,791 events.

3. **Market labeling** — Built a lookup map from contract address → market name (qiAVAX, qiUSDCn, etc.) for readable dashboard labels.

## Results

- 8,123 rows over 7 days (Mar 25 – Apr 1, 2026)
- 12 active markets, qiUSDCn dominates (71%)
- 3,699 mints, 3,642 redeems, 421 borrows, 333 repays, 28 liquidations
- 331 unique users
- Validation: 15/15 passed, Portal exact match
