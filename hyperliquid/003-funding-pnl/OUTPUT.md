# Output — Hyperliquid Funding & PnL

## Angle
Track realized PnL from closing trades on BTC/ETH/SOL/HYPE — who's winning, who's losing, and how much the protocol earns in fees.

## Key Decisions
1. **Filter to closedPnl != 0** — only closing trades contribute to realized PnL. Opening trades have closedPnl = 0 and are noise for this analysis.
2. **4 major coins** — BTC, ETH, SOL, HYPE cover the vast majority of Hyperliquid volume. Keeps data manageable while capturing the story.
3. **Green/red PnL visualization** — daily net PnL chart uses green for positive days, red for negative. Instantly shows market sentiment.

## Issues Encountered
- None significant — the Hyperliquid fills pattern is well-established from previous indexers.

## Results
- 4.53M closing trades in 8 days
- $7.0M net realized PnL across all traders
- $1.2M in fees paid
- 66,124 unique traders
- BTC traders net positive ($6.4M), HYPE traders net negative (-$2.0M)
- Top winner: 0xc147..3aef with $2.4M profit
- Top loser: 0x7fda..17d1 with -$1.5M loss
