# 007 — TradFi Invasion

## What Happened

Researched Hyperliquid news from the past 24 hours. The dominant story: commodities (oil, silver) and equities (TSLA, HOOD) are outpacing major crypto tokens in trading volume on Hyperliquid. Oil + silver alone did $900M in 24h volume, dwarfing SOL ($176M) and XRP ($31M). JPMorgan highlighted the Iran conflict driving oil trading. Grayscale filed for a HYPE ETF.

Since 006-oil-crisis already covers oil specifically, the natural angle was broader: **classify ALL Hyperliquid fills by asset class** (Crypto / Commodity / Equity / Forex / HIP-3) and show how TradFi is invading the DEX.

## Key Decisions

1. **Asset classification by coin prefix**: `xyz:` and `cash:` prefixed coins are TradFi markets. Plain names are crypto. `@NNN` are HIP-3 permissionless markets.
2. **Comprehensive ticker mapping**: Built lookup sets for ~60 commodity, equity, and forex tickers discovered from live data. Had to iterate — first run showed `TRADFI_OTHER` catching tickers like HOOD, GOOGL, PLATINUM that needed reclassification.
3. **All fills, no filter**: Unlike 006 which filtered to commodity coins only, this indexer captures every single fill and classifies post-hoc. 41M rows from March 2-23, 2026.
4. **Dashboard angle**: "TradFi Invasion" narrative — stacked volume bars showing crypto vs non-crypto, treemap of asset class breakdown, top non-crypto markets, TradFi share % trending over time.

## Issues Resolved

- **Node.js v25 zstd crash**: Indexer crashed mid-sync. Restarted and it resumed from checkpoint seamlessly.
- **Portal API format**: Hyperliquid Portal stream endpoint needs `/stream` suffix and `fills: [{}]` (not `fills: [{ request: {} }]`).
- **SDK vs Portal block mismatch**: Pipes SDK batches Hyperliquid blocks differently from raw Portal. Spot-checks confirm data correctness; cross-ref counts diverge due to batching, not data loss.
- **Misclassified tickers**: EWY (Korea ETF), EWJ (Japan ETF), GOOGL, HOOD, NATGAS etc. were initially landing in TRADFI_OTHER. Added them to proper equity/commodity sets.

## Results

- 41M fills indexed across 5 asset classes
- Commodities: $9B notional, Equities: $6.3B, Forex: $293M
- TradFi share: 44.2% of all fills (commodities + equities + forex)
- Validation: 9/9 checks passed (structural + Portal cross-ref + spot-checks)
