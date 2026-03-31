# Venus Flux — Unified Liquidity Pulse

## What happened

Venus Flux is not a standalone protocol — it's Instadapp Fluid's deployment on BNB Chain, created through a partnership with Venus Protocol. The core contract is the FluidLiquidityProxy at `0x52Aa899454998Be5b000Ad077a46Bbe360F4e497`, which serves as the unified liquidity hub for all Fluid operations on BSC.

## Key decisions

1. **Angle: LogOperate event tracking** — The `LogOperate` event captures every supply, borrow, withdraw, and repay operation flowing through the Fluid liquidity hub. This gives a complete picture of all lending activity without needing to index individual fToken or Vault contracts separately.

2. **Operation classification** — Built a classifier that maps `supplyAmount`/`borrowAmount` combinations to 8 distinct operation types (supply, withdraw, borrow, repay, and 4 compound operations like supply+repay).

3. **User/protocol labeling** — Added lookup maps for both token addresses (USDT, USDC, WBNB, etc.) and protocol contract addresses (DEX pairs, fTokens, Vaults) to make dashboard data human-readable.

4. **SDK version** — Used `@subsquid/pipes@1.0.0-alpha.1` which is the latest available version on npm. The previous run may have encountered confusion because the Pipes CLI scaffolding and the actual installed version are the same — there was no "wrong version" issue per se, just that alpha.1 is the only 1.x release available.

## Issues resolved

- The contract `0x52Aa...` is a proxy (FluidLiquidityProxy using Instadapp's infinite-proxy pattern). The ABI was manually created for the `LogOperate` event rather than fetched from the proxy contract (which would only yield `Upgraded` events).
- Token labels cover the top BSC tokens but some smaller tokens appear as truncated hex addresses in the dashboard.

## Results

- 71,010 rows indexed over 7 days
- 29 unique users (mostly protocol contracts like DEX pairs and fTokens)
- USDT and USDC dominate (94% of operations)
- Borrow/repay operations are 88% of all activity (automated DEX rebalancing)
- Validation: 17/17 checks passed, Portal cross-reference exact match (0.0% diff)
