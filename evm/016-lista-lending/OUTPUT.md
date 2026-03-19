# Output — Lista Lending (Moolah) on BSC

## Angle
Isolated market activity on BSC's first Morpho Blue fork. Track all 6 lending event types plus interest accruals and flash loans across 33 isolated markets.

## Key Decisions
- **Morpho Blue fork recognition**: Lista Lending's "Moolah" contract has identical event signatures to Morpho Blue. Used the same indexing pattern as #005 but targeting BSC (`binance-mainnet` dataset).
- **Proxy contract**: Moolah at `0x8F73...` is an EIP-1967 proxy. Generated ABI from implementation `0x0af5...` with `--chain-id 56`.
- **Three tables**: Separated lending events (unified), interest accruals, and flash loans for clean querying.
- **33 active markets**: The bytes32 market IDs identify unique collateral/loan/oracle/IRM/LLTV combinations.

## Issues Resolved
- None — the Morpho fork pattern worked cleanly. BSC dataset `binance-mainnet` was correct.

## Data Summary
- 8,992 lending events (Borrow: 2,672, SupplyCollateral: 2,588, Repay: 1,548, WithdrawCollateral: 1,324, Supply: 448, Withdraw: 412)
- 6,879 interest accrual events
- 83 flash loans
- 33 unique markets
- Period: 2025-05-03 → 2025-06-02 (31 days)
