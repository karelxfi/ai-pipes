# Output — Stader ETHx

## Angle
Track ETHx staking flow — deposits (direct vs referral), pool funding, and withdrawal manager transfers.

## Key Decisions
1. **StakePoolManager only** — Started with 3 contracts (StakePoolManager, StaderOracle, UserWithdrawManager) but the Oracle and WithdrawManager are proxies with mismatched event signatures. Focused on StakePoolManager which has verified implementation ABI.
2. **Referral tracking** — The DepositReferral event is separate from Deposited, showing ~48% of deposits come through referral programs. This is a key insight.
3. **Oracle event signature mismatch** — The ExchangeRateSubmitted event's parameter count doesn't match what's in the source code. The contract was likely upgraded and the event signature changed.

## Issues Encountered
- Oracle proxy returns only Upgraded events from typegen
- Manually written Oracle event definitions crash with "Offset outside DataView bounds" — the event data has fewer bytes than expected (3 uint256 instead of 4)
- Solution: removed Oracle events and focused on StakePoolManager deposit flow

## Results
- 94,811 events: 48.2K direct deposits, 45.4K referral deposits, 697 withdraw transfers, 494 pool transfers
- 36,669 unique depositors
- 26 months of data (Jun 2023 → Aug 2025)
