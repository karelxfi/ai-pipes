# Hyperliquid Perps Majors — Generation Output

## Angle Chosen
**BTC/ETH/SOL perpetual futures fills** — trade activity, volume, and long/short ratios for the top 3 major perp markets.

## Why This Angle
Hyperliquid is the #1 perps DEX by volume. Tracking fills for BTC/ETH/SOL shows the core trading activity — who's trading, which direction (long vs short), and volume patterns.

## Key Decisions
- **Manual project setup**: No CLI template for Hyperliquid. Scaffolded manually with `HyperliquidFillsQueryBuilder` from `@subsquid/pipes/hyperliquid`.
- **3 major coins**: BTC, ETH, SOL — covers the most liquid markets.
- **6-hour chart granularity**: With only ~5 days of data, daily bars looked sparse. 6-hour windows give ~20 bars — much better visual density.
- **Timestamps in milliseconds**: Hyperliquid timestamps are in ms, used `new Date(block.header.timestamp).toISOString()` for ClickHouse (with `date_time_input_format: 'best_effort'`).
- **Notional volume**: Computed as `px * sz` in the pipe transform — not a native fill field.

## Issues Encountered
- Indexer seemed to die after syncing ~55 days of blocks. May be a memory issue with large fill volumes (~900K fills/day for 3 coins).
- Only captured 5 days of data with 4.3M fills — still massive and makes a great dashboard.
- Switched from daily to 6-hour granularity for better visual density.

## Data Quality
- 4.38M fills across 5 days
- $15.7B notional volume
- 50K+ unique traders
- BTC dominates at 58.6% of fills
- Buy/Sell nearly equal (49.6%/50.4%)
