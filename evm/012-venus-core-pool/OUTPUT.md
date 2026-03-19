# Venus Core Pool — Generation Output

## Angle Chosen
**BSC lending activity** — tracking Mint, Redeem, Borrow, RepayBorrow across Venus Core Pool's top vToken markets on BNB Smart Chain.

## Why This Angle
Venus is the dominant lending protocol on BSC, and this is our first non-Ethereum EVM indexer. The BSC DeFi boom of early 2021 is clearly visible in the data — massive activity that dwarfs most Ethereum protocols.

## Key Decisions
- **First BSC indexer**: Uses `binance-mainnet` Portal dataset. CLI correctly set the portal URL.
- **5 vToken markets**: vBNB, vUSDT, vBUSD, vBTC, vETH — all share the same Compound V2 ABI.
- **No proxy issues**: Venus vTokens on BSC are NOT proxies. Typegen worked directly.
- **Simplified schema**: Dropped amount fields from the table — using counts-only approach since different markets have different decimals and mixing amounts is meaningless (per CLAUDE.md rules).
- **Start block 4000000**: Venus Core Pool deployed late 2020 on BSC.

## Issues Encountered
- BSC has ~3s block times vs Ethereum's ~12s, so there are 4x more blocks to sync. The sync takes longer but produces massive amounts of data.
- The 2021 BSC DeFi boom produced 3.4M+ events in just a few months — this is by far our largest dataset.

## Data Quality
- 3.48M events (Jan → Apr 2021 — partial sync but already massive)
- 37.2K unique users across 5 markets
- vBUSD dominates (1.2M events), followed by vBNB (865K)
- Portal cross-reference: exact match (10,966/10,966)
- 3/3 spot-checks confirmed
