# Spark Savings — Generation Output

## Angle Chosen
**Savings vault flows** — tracking the DAI→USDS savings migration by indexing both sDAI and sUSDS vaults side by side.

## Why This Angle
Spark Savings operates two vaults: sDAI (legacy, earning DSR) and sUSDS (new, earning SSR). The migration from DAI to USDS is a major Sky ecosystem shift — visible in the data as sDAI activity declining and sUSDS ramping up.

## Key Decisions
- **Two vaults, one table**: Both sDAI and sUSDS are ERC-4626 vaults sharing the same Deposit/Withdraw event signatures. Unified `savings_flows` table with `vault_name` column.
- **Proxy ABI resolution**: sUSDS is a UUPS proxy (`0xa3931d...`), implementation at `0x4e7991e5C547ce825BdEb665EE14a3274f9F61e0`. sDAI is also a proxy. Both resolved via typegen on implementation.
- **Volume chart uses 1e18**: Both DAI and USDS have 18 decimals, so dividing assets by 1e18 gives correct stablecoin amounts.
- **Start block 17200000**: sDAI deployed May 2023, sUSDS Sep 2024 — captures both.

## Issues Encountered
- sUSDS proxy returned only `Upgraded` event via typegen. Needed implementation address from Etherscan ("Read as Proxy" tab).
- The implementation ABI has a bonus `Drip` event (rate accrual) — we don't index it but it's interesting for future use.

## Data Quality
- 103K+ events across ~2 years (May 2023 → Apr 2025)
- sDAI: 73K events, sUSDS: 30K events
- Portal cross-reference: exact match (169/169)
- 3/3 spot-checks confirmed
