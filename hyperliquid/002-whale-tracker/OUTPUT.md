# Output — Hyperliquid Whale Tracker

## Angle
Track high-value trades ($50K+ notional) across ALL Hyperliquid coins — not just majors. Reveals whale favorite markets, top traders by volume, and position direction patterns.

## Key Decisions
1. **$50K notional threshold** — filters ~99% of fills, keeping only whale-sized trades. Low enough to capture active traders, high enough to exclude noise.
2. **No coin filter** — unlike 001-perps-majors which filters to BTC/ETH/SOL, this ingests all coins and filters by size. Reveals interesting whale activity in commodities (crude oil, gold, silver), index products (USA500, XYZ100), and altcoins.
3. **Extended direction types** — Hyperliquid has 9 direction types, not just the 4 documented (Open/Close Long/Short). Also includes "Long > Short" (position flip), "Short > Long", "Buy"/"Sell" (spot), and "Net Child Vaults" (vault settlements).

## Issues Encountered
- **Undocumented direction types**: The agent-skills portal-query-hyperliquid-fills skill only documents 4 dir values. Real data has 9. Validation initially failed on this.
- **High data volume**: Ingesting all coins without filter produces ~20K whale fills per day. Manageable but the pipe filter is essential.

## Results
- 112,626 whale fills in ~5 days
- 4,167 unique whale addresses
- $12.49B total notional volume
- Top coins: BTC ($7.4B), ETH ($2.45B), Crude Oil ($820M), SOL ($318M)
- Top whale: 0xecb6..2b00 with $514M volume
