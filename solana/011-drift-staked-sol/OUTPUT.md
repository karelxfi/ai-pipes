# Output — Drift Staked SOL

## Angle
Track dSOL staking flow via SPL Token mint/burn events on the dSOL token mint — the same pattern proven with jupSOL (008).

## Key Decisions
- **Reused jupSOL pattern:** dSOL uses Sanctum's SPL Stake Pool program, making it architecturally identical to jupSOL. The SPL Token mint/burn approach works perfectly here too.
- **MintTo = deposit, Burn = withdrawal:** Same classification logic as jupSOL — when dSOL tokens are minted, SOL was deposited; when burned, SOL is being withdrawn.
- **Low volume expected:** dSOL is a smaller LST compared to jupSOL or mSOL. 87 rows in 5 days is representative of actual protocol usage.

## Issues Encountered
- No significant issues — the pattern was already proven with jupSOL (008). This was a straightforward application of the same approach.
- The main challenge was finding the correct dSOL mint address, which required checking Drift's documentation and Sanctum's pool registry.

## Result
87 rows indexed covering Mar 8-13 2026. Nearly balanced flow with 47 deposits and 40 withdrawals. All 10 validation checks passed. The low volume compared to jupSOL (694 rows) reflects dSOL's smaller market position.
