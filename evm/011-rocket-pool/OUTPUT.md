# Rocket Pool — Generation Output

## Angle Chosen
**rETH mint/burn tracker** — staking deposits and withdrawals with implied exchange rate from rETH/ETH ratios.

## Why This Angle
The rETH exchange rate is THE key metric for Rocket Pool — it represents accumulated staking yield. By capturing both rETH and ETH amounts from mint/burn events, we can derive the exchange rate history. The chart shows it climbing from 1.0 to 1.11+ over 3.5 years.

## Key Decisions
- **No proxy**: rETH token contract is NOT a proxy — first indexer where typegen worked directly without needing implementation address resolution!
- **Both amounts captured**: `reth_amount` and `eth_amount` from each event enable exchange rate calculation (`eth_amount / reth_amount`).
- **Start block 13325233**: rETH contract deployed Oct 2021 — captures the full history.
- **Exchange rate chart**: Used `avg(eth_amount / reth_amount)` per week for mints — gives the implied exchange rate over time.

## Issues Encountered
- None! Clean generation. rETH is a simple, well-verified contract with clear event signatures.

## Data Quality
- 68K+ events across 3.5 years (Oct 2021 → May 2025)
- 37.7K mints, 30.9K burns
- 24K unique users
- Portal cross-reference: exact match (66/66)
- 3/3 spot-checks confirmed
