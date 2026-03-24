# Output — Jupiter Staked SOL

## Angle
Track jupSOL staking flow by monitoring SPL Token MintTo and Burn events on the jupSOL mint address, rather than attempting to decode SPL Stake Pool program instructions directly.

## Key Decisions
- **SPL Token mint/burn over Stake Pool instructions:** Scanning the SPL Stake Pool program for deposit/withdraw instructions was far too slow — the program processes millions of instructions across all pools. Tracking MintTo/Burn on the specific jupSOL token mint is surgically precise and fast.
- **Operations routed through wrappers:** Most jupSOL operations go through Sanctum or Jupiter wrapper programs, not directly through the Stake Pool program. Tracking the token mint/burn captures all paths regardless of the routing program.
- **Deposit vs withdrawal classification:** MintTo = deposit (SOL staked, jupSOL minted), Burn = withdrawal (jupSOL burned, SOL returned).

## Issues Encountered
- Initial attempt to use SPL Stake Pool instruction-level filtering was abandoned due to scan speed — would have taken hours to cover even a week of data.
- The jupSOL mint address had to be verified against Jupiter's documentation and on-chain data.

## Result
694 rows indexed covering Mar 8-14 2026. 679 deposits vs 15 withdrawals shows strong net inflow into jupSOL during this period. All 10 validation checks passed including Portal cross-reference and transaction spot-checks.
