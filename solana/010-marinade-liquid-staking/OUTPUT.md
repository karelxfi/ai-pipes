# Output — Marinade Liquid Staking

## Angle
Track Marinade Finance staking flow — deposits, liquid unstakes, delayed unstakes, and claims — to visualize the full lifecycle of mSOL liquid staking on Solana.

## Key Decisions
- **Anchor program with dedicated program ID:** Unlike jupSOL/dSOL which use the generic SPL Stake Pool program, Marinade has its own Anchor program. This means we can filter directly by Marinade's program ID and decode instruction discriminators.
- **Five distinct operations tracked:** deposit, liquid_unstake, order_unstake (delayed), withdraw_stake_account, and claim — covering the complete staking lifecycle including Marinade's unique delayed unstake mechanism.
- **Marinade-specific program ID:** Used Marinade's dedicated program `MarBmsSgKXdrN1egZf5sqe1TMai9K1rChYNDJgjq7aD` rather than the generic SPL Stake Pool.

## Issues Encountered
- Marinade's delayed unstake flow involves two separate transactions (order_unstake then claim after cooldown), requiring both to be tracked to show the complete picture.
- Lower volume than expected — Marinade has been losing market share to Jupiter and other LST protocols.

## Result
1,535 rows indexed covering Mar 8-13 2026. Deposits (826) dominate, with liquid unstakes (670) being the preferred exit method over delayed unstakes (9). All 11 validation checks passed.
