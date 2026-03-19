# SparkLend — Generation Output

## Angle Chosen
**Lending dynamics** — supply, borrow, repay, withdraw flows showing how capital moves through SparkLend, the Sky/MakerDAO ecosystem's primary lending market.

## Why This Angle
SparkLend is an Aave V3 fork but serves a unique role as the bridge between Sky's stablecoin ecosystem (DAI/USDS) and DeFi lending. Tracking all 4 action types shows the full capital lifecycle.

## Key Decisions
- **Proxy ABI resolution**: Pool contract is an ERC-1967 proxy. CLI fetched only `Upgraded` event. Used implementation address `0x5ae329203e00f76891094dcfedd5aca082a50e1b` to get the full Aave V3 Pool ABI with all lending events.
- **Unified table**: Combined all 4 action types (supply, borrow, repay, withdraw) into `sparklend_actions` with an `action` column. Better for cross-action analysis.
- **Token address mapping**: Added common token addresses → symbols mapping in dashboard (DAI, WETH, wstETH, WBTC, USDC, USDT, sDAI, USDS, sUSDS, cbETH, rETH).
- **Start block 17000000**: SparkLend deployed April 2023 — captures full history.

## Issues Encountered
- Standard Aave V3 proxy pattern — resolved cleanly with `evm-typegen` on implementation address.
- No surprises — the Aave V3 ABI is well-known and all events decoded correctly.

## Data Quality
- 67K+ events across ~2 years (April 2023 → Feb 2025)
- All 4 action types well-represented: supply 21K, borrow 18K, withdraw 15K, repay 12K
- 13 unique reserve assets, 7.2K unique users
- Portal cross-reference: exact match (342/342)
- 3/3 transaction spot-checks confirmed
