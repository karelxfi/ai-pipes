# Output: Liquity V1 — Trove Lifecycle

## Angle

Full trove lifecycle on Liquity V1's immutable CDP protocol — TroveUpdated (opens/adjustments/closures), liquidations, and LUSD redemptions.

## Key Decisions

1. **TroveManager only** — All 4 key events (TroveUpdated, TroveLiquidated, Redemption, Liquidation) are emitted by the TroveManager contract. No need for BorrowerOperations (which duplicates TroveUpdated).

2. **Operation enum decoding** — TroveUpdated carries a uint8 operation enum: 0=applyPendingRewards, 1=liquidateInNormalMode, 2=liquidateInRecoveryMode, 3=redeemCollateral. This tells the full story of what happened to each trove.

3. **SDK 1.0 `outputs` pattern** — Used `evmDecoder(...).pipe(transform)` passed as `outputs` to `evmPortalSource`. The `.pipe()` receives destructured event arrays `{ TroveUpdated, TroveLiquidated, Redemption, Liquidation }` — clean and typed.

4. **Start from deployment block** — Liquity V1 deployed at block 12,178,557 (Apr 2021). Indexed full history to capture the complete lifecycle including the 2022 liquidation spikes.

## Data Summary

- 7.4K events across Apr 2021 - Nov 2023
- TroveUpdated: 4.4K (60%) — dominated by redeemCollateral operations
- Redemption: 1.8K (24%) — LUSD being redeemed for ETH
- TroveLiquidated: 870 (12%) — individual trove liquidations
- Liquidation: 288 (4%) — aggregate liquidation batches
- Major liquidation spike in May 2022 (ETH crash)
