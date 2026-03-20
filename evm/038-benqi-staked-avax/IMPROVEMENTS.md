# Improvements — BENQI sAVAX

## CLAUDE.md
- Should document the correct `@subsquid/evm-abi` and `@subsquid/evm-codec` version ranges (`^0.3.1` and `^0.3.0` respectively) in the package.json template section. The typegen tool generates imports for these packages.
- Could add Avalanche C-Chain to known working Portal datasets: `avalanche-mainnet` (chain-id 43114).

## Agent Skills
- `pipes-new-indexer` should mention that `--chain-id 43114` works for Avalanche with `evm-typegen`.
- The skill could note that proxy detection on non-Ethereum chains works the same way (Snowtrace for Avalanche, etc.).

## Dashboard
- The monthly stacking bar chart pattern works well for inflow/outflow comparison.
- Cumulative line chart for reward accrual is a good pattern for yield-generating protocols.

## Skills patches applied
No skill patches needed — existing skills worked correctly for this Avalanche indexer.
