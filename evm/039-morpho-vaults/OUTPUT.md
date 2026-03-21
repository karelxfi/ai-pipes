# MetaMorpho Vaults — Curator Reallocation Activity

## Angle

Track `ReallocateSupply` and `ReallocateWithdraw` events across ALL MetaMorpho vaults on Ethereum using topic0-only filtering. These events fire when vault curators or the Public Allocator shift capital between Morpho Blue markets — the core innovation of MetaMorpho.

## Key Decisions

1. **Topic0-only filtering** — MetaMorpho vaults are deployed from a factory, creating hundreds of vault addresses. Rather than maintaining a list, we filter by event signature only. The `ReallocateSupply` and `ReallocateWithdraw` event signatures are unique to MetaMorpho, so false positives are negligible.

2. **Start block 18,900,000** — Morpho Blue core contract deployed at block 18,883,124 (Jan 2024). MetaMorpho vaults started deploying shortly after.

3. **Focused on reallocation, not deposits** — The existing Morpho V1 indexer (005) covers core lending events. This indexer focuses on the vault curation layer — how curators actively manage yield by shifting capital across markets.

## Results

- **94,781 events** across 92 vaults, 308 markets, 69 allocators
- **Time range**: Jan 2024 → Apr 2025
- **Key insight**: Exponential growth in reallocation activity, especially from late 2024 onward, reflecting MetaMorpho's rapid adoption as the dominant vault layer on Morpho Blue

## Issues

- None. The typegen worked cleanly on a MetaMorpho vault contract, and the new SDK 1.0.0-alpha.1 pattern with topic0-only filtering worked perfectly.
