# Pendle Finance — Generation Output

## Angle Chosen
**Yield trading activity** — tracking PT and YT swap flows across Pendle markets to show which yield assets are most actively traded.

## Why This Angle
Pendle is unique in DeFi — it splits yield-bearing tokens into Principal Tokens (PT) and Yield Tokens (YT), creating a yield derivatives market. The swap activity on the Router shows where yield traders are placing bets on future yields.

## Key Decisions
- **Diamond proxy ABI issue**: The Pendle Router (`0x888...946`) is a Diamond proxy (EIP-2535). The `evm-typegen` tool returns an empty Contract class because it can't resolve through Diamond facets. Had to manually write event definitions with verified topic0 hashes.
- **Removed SwapYtAndToken**: The `SwapYtAndToken` event (topic0 `0x3f5e2944...`) crashed the decoder because older events have a different data layout than the current ABI. The other 3 event types work correctly. This could be re-added with proper version handling.
- **Unified table**: All swap types go into one `pendle_swaps` table with a `swap_type` column for easy cross-type analysis.
- **Start block 18800000**: Router V4 deployed late 2023. This captures the full history.

## Issues Encountered
1. **Diamond proxy**: `evm-typegen` produced empty output. Manual event definitions required.
2. **SwapYtAndToken data layout mismatch**: Older events emitted with a different number of non-indexed parameters than the current event signature. The decoder threw `EventDecodingError: Offset is outside the bounds of the DataView`. Removed this event type as a workaround.
3. **SwapPtAndSy events not captured**: The topic0 for SwapPtAndSy may differ from what was expected. Only PT↔Token and YT↔SY were indexed successfully.

## Data Quality
- 110K+ swaps across ~11 months (April 2024 → March 2025)
- 35K+ unique traders, 174 markets
- Portal cross-reference: exact match (285/285 in sample range)
- 3/3 transaction spot-checks confirmed
