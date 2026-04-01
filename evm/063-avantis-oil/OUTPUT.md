# Output

Built a commodity-focused Avantis indexer filtering MarketOrderInitiated, LimitOrderInitiated, OpenLimitPlaced, TpUpdated, and SlUpdated events to pair indices 20 (XAG/USD Silver), 21 (XAU/USD Gold), and 65 (WTI/USD Crude Oil).

## Key Decisions

- **30-day lookback**: Commodity pairs are lower frequency than crypto pairs — 7 days would yield too few oil trades (WTI only ~35 orders per 30 days)
- **Unified commodity_orders table**: Combined market orders and limit order initiations into a single table with `order_type` discriminator, making cross-commodity analysis simpler
- **commodity_risk_updates**: Combined TP and SL updates into one table with `update_kind` field instead of separate tables
- **Reused 062-avantis contracts and utils**: Same ABI, same enrichEvents helper — only the filtering and table structure changed

## Results

- 3,690 commodity orders across 30 days
- XAU/USD (Gold): ~1,840 orders — most active commodity
- XAG/USD (Silver): ~1,790 orders — close second
- WTI/USD (Oil): ~60 orders — recently relaunched, low volume
- 328 unique commodity traders
- Leverage range 1x-250x
- All 22 validation checks passed including Portal cross-reference and tx spot-checks
