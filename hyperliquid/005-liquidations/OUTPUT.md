# Output — Hyperliquid Liquidations

## Angle
Liquidation tracker — forced closes with $100+ losses across all coins. Since Hyperliquid fills don't have an explicit liquidation flag, we use a proxy: closing trades (Close Long, Close Short, Long > Short, Short > Long) with closedPnl < -$100.

## Key Decisions
- **Loss threshold of $100**: Filters out noise from small stop-losses while capturing meaningful forced liquidations
- **All coins, no filter**: Unlike the meme-coins or funding-pnl indexers, this one captures liquidations across ALL coins for maximum coverage
- **Direction-based filtering**: Only closing trades (Close Long/Short, Long>Short, Short>Long) qualify — opens are excluded
- **90-day lookback**: START_BLOCK calculated as current block minus 90 days of seconds

## Results
- **181,036 liquidation-like events** in ~8 days (Mar 12–20, 2026)
- **$70.3M total losses** across 13,493 unique addresses
- **258 coins** with liquidation activity
- Top liquidated: HYPE (26,888), BTC (26,684), ETH (22,969), xyz:CL (18,588)
- Biggest single loss: $181,338
- More short liquidations (108,687) than long (72,349) — bearish period
- Hourly pattern shows peak liquidations around 14:00-16:00 UTC

## Issues
- None — straightforward adaptation of the Hyperliquid fills pattern established in prior indexers
