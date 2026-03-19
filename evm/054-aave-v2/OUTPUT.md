# Aave V2 — Generation Output

## Angle Chosen
**Legacy lending & liquidation activity** — 5 action types including liquidations, showing Aave V2's full lifecycle from the 2021 DeFi summer boom through migration to V3.

## Key Decisions
- **5 action types**: Added LiquidationCall alongside the standard 4 (deposit, withdraw, borrow, repay). Liquidation spikes during market crashes are the most visually interesting feature.
- **Proxy ABI**: LendingPool is a proxy at `0x7d2768dE...`. Implementation at `0xc6845a5c768bf8d7681249f8927877efda425baf`.
- **Aave V2 vs V3 difference**: V2 uses `Deposit` event, V3 renamed it to `Supply`. Different topic0 hashes.
- **Start block 11362579**: Aave V2 deployed Nov 2020.

## Issues Encountered
- Standard proxy resolution. Nothing unexpected.

## Data Quality
- 1.43M events across 4+ years (Nov 2020 → Mar 2025)
- 504K deposits, 404K withdrawals, 272K borrows, 209K repays, 36K liquidations
- 37 unique assets, 110K unique users
- Portal cross-reference: exact match (872/872)
