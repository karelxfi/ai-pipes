# Output — BENQI sAVAX Staking Lifecycle

## Angle
sAVAX staking lifecycle & reward accrual — tracking the full deposit/unlock/redeem flow with yield accumulation on Avalanche C-Chain.

## Key Decisions
- **Proxy contract**: sAVAX at `0x2b2C81e08f1Af8835a78Bb2A90AE924ACE0eA4bE` is an EIP-1967 transparent proxy. Generated typegen from implementation `0x0ce7f620eb645a4fbf688a1c1937bc6cb0cbdd29` (chain-id 43114).
- **All 8 event types indexed**: Submitted, UnlockRequested, UnlockCancelled, Redeem, RedeemOverdueShares, AccrueRewards, Deposit, Withdraw — captures the complete staking lifecycle.
- **AccrueRewards is the yield heartbeat**: Each event adds AVAX to the pool, increasing the sAVAX/AVAX exchange rate. The cumulative chart shows ~700K AVAX in rewards over 3 years.
- **Started from block 3M**: sAVAX was deployed mid-2021 on Avalanche. First events appear at block ~10M (Jan 2022).

## Results
- **402,962 rows** spanning 2022-01-26 to 2025-04-01
- **236K submissions**, 47K withdrawals, 38K unlock requests, 37K reward accruals
- **91,297 unique users**
- Massive staking spike visible in Nov-Dec 2022, likely driven by FTX collapse and flight to liquid staking
- All 12 validation checks passed (structural + Portal cross-ref + spot-checks)

## Issues Encountered
- `@subsquid/evm-abi` version `^2.0.0` doesn't exist — needed `^0.3.1`. Same for `evm-codec` — needed `^0.3.0`. These are the versions pulled by the typegen tool.
- Docker/OrbStack needed manual startup — `orb start` CLI command works.
- First Avalanche indexer in this repo — `avalanche-mainnet` Portal dataset confirmed working.
