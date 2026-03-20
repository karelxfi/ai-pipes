# Output — Yearn Finance V2 Strategy Harvests

## Angle
Track `StrategyReported` events across ALL Yearn V2 vaults on Ethereum mainnet using topic0-only filtering. This event fires every time a strategy reports gains/losses back to its vault — it's the heartbeat of Yearn's yield generation system.

## Key Decisions

- **Topic0-only filtering**: Omitted the `contracts` array from `evmDecoder` to capture events globally. This lets us track all 360+ Yearn V2 vaults without maintaining an address list.
- **Started from block 11M**: Yearn V2 launched around block 11.5M (early 2021). Starting at 11M ensures we don't miss early vaults.
- **V2 over V3**: Initially investigated V3 VaultFactory `NewVault` events but they were too sparse (near-zero in millions of blocks). V2 StrategyReported has much better density (~25K events across 4+ years).
- **String storage for uint256**: Stored gain/loss/debt fields as String in ClickHouse since these are raw token amounts (uint256) that can overflow standard numeric types.

## Issues Encountered

1. **V3 factory dead end**: Spent time querying Portal for V3 factory events across 4 known factory addresses — all returned zero results. The V3 factories deploy very infrequently.
2. **New SDK pattern worked cleanly**: The `outputs` pattern with `evmPortalSource` worked on first try. No migration issues.

## Results
- 24,858 rows indexed
- 360 unique vaults, 976 unique strategies
- Time range: 2021-02-01 to 2025-07-16
- Validation: 26/26 checks passed (structural + Portal cross-ref + spot-checks)
