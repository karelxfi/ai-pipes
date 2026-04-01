# Improvements from Avantis indexer (062)

## CLAUDE.md

- Add Base mainnet to supported chains documentation (portal dataset: `base-mainnet`)
- Add note about gTrade fork pair index mapping — many perps DEXs share the same pair indices
- Portal `contract_activity` tool can significantly undercount events — recommend always verifying with direct stream queries for high-activity contracts

## generate-indexer command

- When dealing with proxy contracts on Base, the flow is the same as Ethereum — check for implementation address and re-run typegen
- Consider auto-detecting proxy contracts during scaffold

## Dashboard template

- Buy/sell ratio stats should always filter by the relevant event type (e.g., only opens, not closes)
- Leverage bucketing for perps protocols should use meaningful ranges (1-25x, 25-50x, etc.) not fixed-width buckets
