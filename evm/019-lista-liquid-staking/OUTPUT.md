# Output — Lista Liquid Staking

## Angle
Track the full slisBNB staking lifecycle on BSC — deposits, unstake requests, and withdrawal claims.

## Key Decisions
1. **Manual event definitions** — ListaStakeManager is a proxy and typegen only returns Upgraded events. Wrote manual event definitions using `@subsquid/evm-abi` + `@subsquid/evm-codec`.
2. **Three core events** — Deposit (BNB staked), RequestWithdraw (unstake initiated), ClaimWithdrawal (BNB claimed after 7-day unbonding).
3. **BSC dataset** — Used `binance-mainnet` Portal dataset, same as Lista Lending (#016).

## Issues Encountered
- Proxy ABI only from typegen — needed manual event definitions
- `p` is exported from `@subsquid/evm-codec`, not `@subsquid/evm-abi` — common mistake when writing manual events
- ClaimWithdrawal topic0 hash was slightly different from what I initially computed — verified against Portal data

## Results
- 1,095,964 events indexed
- 722K deposits, 211K unstake requests, 163K claims
- 643K unique users
- 13 months of data (Jul 2023 → Aug 2024)
