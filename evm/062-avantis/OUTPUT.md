# Avantis Perps Pulse — Output

## What happened

Built a perpetuals trading pulse indexer for Avantis V1.5 on Base mainnet. Avantis is a gTrade-fork perpetuals DEX offering up to 1000x leverage on 80+ pairs (crypto, forex, commodities).

## Key decisions

- **Contract discovery**: Trading contract `0x44914408...` is a transparent proxy. Used `evm-typegen` with implementation address `0x3AE99070...` to get the full ABI with 15 events.
- **Events indexed**: MarketOrderInitiated (market opens/closes), LimitOrderInitiated, OpenLimitPlaced, MarginUpdated (with full trade struct), TpUpdated, SlUpdated — 6 event types covering the full trading lifecycle.
- **Leverage precision**: Avantis stores leverage with 1e10 precision (e.g., 500x = 5000000000000). Dashboard divides accordingly.
- **Pair mapping**: Used gTrade standard pair indices (0=BTC, 1=ETH, 21=EUR/USD etc.) since Avantis is a fork.
- **High activity**: ~40K+ market orders in 7 days, 1034 unique traders. The protocol is very active.

## Issues resolved

- Portal `contract_activity` tool reported only 1740 events due to default limit — actual count is 40K+. Verified via direct Portal stream queries.
- Leverage range extends to 1000x (not 500x as documented) — adjusted validation threshold.
- Buy/sell stat in dashboard initially counted all orders instead of opens-only — fixed to filter by `is_open=1`.
