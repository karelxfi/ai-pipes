# Output — Fluid Lite Vault Pulse

## What happened

Built a dual-vault indexer tracking both Fluid Lite vaults (fLiteUSD + iETHv2) across their full histories on Ethereum mainnet.

## Key decisions

1. **Both vaults indexed together** — iETHv2 has 3 years of history (block 17M+), fLiteUSD was just deployed days ago (block 24.7M+). Combined gives 12K+ events vs ~100 individually.
2. **Four tables for different concerns** — `vault_events` (deposits/withdraws), `exchange_prices` (rate growth tracking), `strategy_ops` (refinances, revenue collection, fund movements), `withdraw_fees` (fLiteUSD fee tracking).
3. **Exchange rate as primary visual** — The iETHv2 exchange rate growing from 1.01 to 1.20 over 3 years is the most compelling data point, showing yield accrual in real-time.
4. **Proxy contracts handled** — Both vaults use proxy patterns. Used implementation ABIs (0xE16Ccc91 for fLiteUSD, 0x6Feb5478 for iETHv2) with proxy addresses for event filtering.

## Issues resolved

- fLiteUSD vault returned 0 events with broad block range queries on Portal — turned out it was deployed just ~7 days ago. Used `get_contract_activity` with `7d` timeframe to find the events.
- iETHv2 has a different event name for exchange price updates (`LogUpdateExchangePrice` vs `LogCheckpointExchangePrice`) — unified both into the same table with before/after columns.
- Exchange rate chart showed raw 18-decimal values (10000.0B) — fixed by dividing by 1e18 in the SQL query.

## Data summary

- 12,000 vault events (iETHv2: 11,900 + fLiteUSD: 99)
- 2,364 exchange price updates
- 1,358 strategy operations (mostly refinances)
- 31 withdraw fees
- Time range: 2023-04-08 → 2026-03-26
