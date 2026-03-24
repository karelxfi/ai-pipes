# Output — Kamino Liquidity

## Angle
Track Kamino Finance CLMM (concentrated liquidity) activity — invests, deposits, withdrawals, rebalances, and fee collection — to visualize automated liquidity management on Solana.

## Key Decisions
- **23 Anchor d8 discriminators:** Kamino's program has a rich instruction set. Computed and tracked 23 discriminators to achieve comprehensive coverage of all liquidity operations, from basic deposits to automated rebalances and reward swaps.
- **Invest as the dominant operation:** The Invest instruction (4,453 of 6,124 rows) represents Kamino's core automated strategy execution — users deposit into vaults which auto-compound and rebalance.
- **Broad instruction coverage:** Rather than tracking only deposit/withdraw, included OpenLiquidityPosition, SwapRewards, and rebalance instructions to show the full automated liquidity management lifecycle.

## Issues Encountered
- Computing 23 discriminators required careful enumeration of Kamino's instruction set from the IDL.
- Some instruction types had very low frequency (SwapRewards = 7) but were included for completeness.

## Result
6,124 rows indexed covering Mar 8-13 2026. Invest operations dominate (73%), showing that Kamino's automated strategies are the primary usage pattern. All 10 validation checks passed including Portal cross-reference and spot-checks.
