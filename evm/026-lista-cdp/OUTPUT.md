# Output — Lista CDP

## Angle
Track the full lisUSD CDP lifecycle on BSC — collateral deposits, borrowing, repayments, withdrawals, and liquidations across 11+ collateral types.

## Key Decisions
1. **Implementation ABI from proxy** — Interaction contract is a proxy. Implementation at `0x7d482de96d35daa1ce48c7ab1f7264206adb439d` has all events.
2. **Five event types** — Deposit, Borrow, Payback, Withdraw, Liquidation. Complete CDP lifecycle.
3. **MakerDAO-fork architecture** — Lista CDP mirrors MakerDAO's Vat/Interaction pattern on BSC.

## Issues Encountered
- No issues — clean generation. The proxy was correctly identified and implementation ABI worked.

## Results
- 88,099 events: 25.4K deposits, 22.6K borrows, 19.2K paybacks, 20.4K withdrawals, 524 liquidations
- 11 unique collateral types (slisBNB dominant)
- 17.9K unique users
- 12 months of data (Jul 2023 → Jul 2024)
