# Output — StakeWise V3 Vault Rewards & MEV Distribution

## Angle
Track per-vault reward distribution (Keeper.Harvested), osETH minting/burning dynamics (OsTokenVaultController.Mint/Burn), and MEV income flow (SharedMevEscrow.MevReceived). These 3 contracts together capture the full reward lifecycle across all StakeWise vaults.

## Key Decisions
- **Multi-contract composite indexer**: Used `pipeComposite` with 3 separate `evmDecoder` instances for Keeper, OsTokenVaultController, and SharedMevEscrow. Each has its own event set.
- **Not proxies**: All 3 contracts are direct implementations (verified on Etherscan), so `evm-typegen` worked directly.
- **51 unique vaults**: The Harvested event reveals 51 distinct staking vaults over the indexed period, with clear growth patterns.
- **448 ETH total MEV**: SharedMevEscrow collected 448 ETH in MEV tips over ~1 year.

## Issues Resolved
1. **`contracts` field format**: `evmDecoder` expects `contracts: [address]` (array of strings), not `contracts: [{ address: [addr] }]`.
2. **Timestamp handling with DateTime64(3)**: ClickHouse `DateTime64(3, 'UTC')` interprets numeric values differently than `DateTime`. Passing epoch seconds (e.g., 1700392127) to DateTime64(3) treats it as 1700392.127 seconds from epoch (1970!). Fix: pass ISO strings with `date_time_input_format: 'best_effort'`.
3. **Event field access in pipeComposite**: Decoded events from `pipeComposite` have `d.block.number`, `d.rawEvent.transactionHash`, `d.timestamp` (Date object), and `d.event.*` for decoded params. NOT `d.blockNumber` or `d.txHash`.

## Data Summary
- 4,466 Keeper Harvests across 51 vaults
- 1,084 osETH Mints
- 376 osETH Burns
- 4,797 MEV Received events
- Period: 2023-11-19 → 2024-11-14 (360 days)
