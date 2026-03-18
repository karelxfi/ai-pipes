# Output — wBETH Oracle Health Monitor

## What was done

1. **Scaffolded indexer** using `@iankressin/pipes-cli` with the `custom` template, targeting the wBETH proxy contract on Ethereum mainnet (`0xa2E3356610840701BDf5611a53974510Ae27E2e1`) from block 17,200,000 (~May 2023).

2. **Fixed proxy contract ABI** — The wBETH contract uses AdminUpgradeabilityProxy (implementation at `0x9e021c9607bd3adb7424d3b25a2d35763ff180bb`). The CLI fetched the proxy ABI with only `AdminChanged` and `Upgraded` events. Manually wrote the contract types file with the `ExchangeRateUpdated(address,uint256)` event definition, with topic0 verified via 4byte.directory.

3. **Verified event signature on-chain** — Used SQD Portal to query actual logs from the contract. Confirmed that `ExchangeRateUpdated` has topic0 `0x0b4e9390054347e2a16d95fd8376311b0d2deedecba526e9742bcaa40b059f0b`, takes an indexed address (the Binance oracle at `0x81720695e43a39c52557ce6386feb3faac215f06`) and a uint256 newExchangeRate in the data field (18 decimals, starting ~1.001 ETH).

4. **Configured dedicated ClickHouse database** — Changed from default `pipes` to `wbeth` to avoid sync table conflicts.

5. **Created dashboard** — Four-chart ECharts layout:
   - Exchange rate over time (area chart — should show steady upward curve)
   - Daily rate change in basis points (bar chart — expect ~1-2 bps/day)
   - Oracle update frequency per week (bar chart — expect 7/week, red for gaps)
   - Implied APR with 7-day moving average (line + scatter)
   - Summary stats: total updates, current rate, implied APR, time period

6. **Created validation script** — Three-phase validation:
   - Phase 1: Structural checks (row count, schema, timestamps, rate sanity, monotonicity)
   - Phase 2: Portal cross-reference (50K block sample count comparison)
   - Phase 3: Transaction spot-checks (3 txs verified against Portal log data)

## Key decisions

- **Event signature discovery** — The user-provided signature `ExchangeRateUpdated(uint256,uint256)` was incorrect. The actual signature is `ExchangeRateUpdated(address,uint256)` with the address being the oracle caller (indexed). Verified via 4byte.directory and Portal on-chain data.
- **Start block 17,200,000** — May 2023, shortly after wBETH deployment on Ethereum mainnet.
- **Table name**: `wbeth_exchange_rate_updated` (matching CLI convention of contract_name + event_name in snake_case).
- **CollapsingMergeTree** engine for reorg handling with `sign` column.
- **Exchange rate interpretation**: The `newExchangeRate` is a uint256 with 18 decimals representing how many ETH 1 wBETH is worth. Values start at ~1.001 and grow daily.
- **Implied APR**: Calculated from consecutive rate changes, annualized. ~5% APR expected.

## Issues encountered

- **Proxy ABI**: AdminUpgradeabilityProxy pattern — `evm-typegen` fetched only proxy events (AdminChanged, Upgraded). Implementation address `0x9e021c9607bd3adb7424d3b25a2d35763ff180bb` was known but the event wasn't in the proxy ABI. Resolved by looking up topic0 `0x0b4e9390...` on 4byte.directory which confirmed `ExchangeRateUpdated(address,uint256)`.
- **Wrong event signature in prompt**: The initial guess was `ExchangeRateUpdated(uint256,uint256)` (old and new rate). The real event only emits the new rate and the caller address. There's no "old rate" parameter — you derive rate changes by comparing consecutive events.
