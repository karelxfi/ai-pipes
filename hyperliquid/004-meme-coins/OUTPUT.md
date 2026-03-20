# Output — Hyperliquid Meme Coins

## Angle
Track the meme coin frenzy on Hyperliquid — which degen coins get the most volume, which attract the most traders, and how activity trends over time.

## Key Decisions
1. **20 curated meme coins** — handpicked popular meme coins (DOGE, PEPE, WIF, TRUMP, FARTCOIN, etc.). 12 of 20 had active fills in the indexed period.
2. **No notional filter** — include all fills regardless of size to capture the full degen activity spectrum.
3. **Stacked area for trends** — shows how meme coin dominance shifts day-to-day.

## Issues Encountered
- **All fills are Sell side** — the fills API returns one counterparty per fill. For meme coins during this period, all fills came back as side="A" (Sell). The direction field (Open Short, Close Long, Long > Short) still provides the real position information.
- **8 of 20 meme coins had zero fills** — SHIB, PEPE, BONK, FLOKI, NEIRO, MOG, GIGA, AI16Z are not listed on Hyperliquid perps or had no activity during this window.

## Results
- 586K fills across 12 meme coins in 9 days
- $248.9M total volume
- 10,095 unique traders
- TRUMP leads by volume ($96.4M), FARTCOIN leads by fill count (189K)
- TRUMP also has the most unique traders (4,617)
