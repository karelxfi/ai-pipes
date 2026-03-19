# Output — Liquid Collective

## Angle
Track validator growth, deposit flow, and reward accumulation on Liquid Collective's enterprise-grade ETH staking protocol (LsETH).

## Key Decisions
1. **Implementation ABI from proxy** — River contract is a TUP proxy. Implementation at `0x34e4617764cc94620170aa0e6652ad328d196d58` has all events.
2. **No ConsensusLayerDataUpdate events** — Despite being in the ABI, this event is not emitted on the current contract version. Used `SetDepositedValidatorCount` for validator growth and `RewardsEarned` for TVL tracking instead.
3. **Low volume, high value** — Only 1,068 events in 16 months, but each deposit is massive (institutional — one deposit was 10,756 ETH). Enterprise protocol with few but large transactions.

## Issues Encountered
- ConsensusLayerDataUpdate event has 0 emissions — had to pivot dashboard from oracle reports to rewards-based TVL tracking
- Adjusted validation and dashboard to use validator_funded instead of oracle_report events

## Results
- 1,068 events: 493 rewards, 357 validator_funded, 218 deposits
- 13.2K validators tracked
- ~400K ETH total underlying balance
- 16 months of data (Apr 2024 → Aug 2025)
