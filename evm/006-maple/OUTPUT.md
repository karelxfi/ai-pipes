# Maple Finance — Generation Output

## Angle Chosen
**Institutional lending pool flows** — tracking deposits and withdrawals across all active Maple Syrup pools to visualize where institutional capital is flowing.

## Why This Angle
Maple is unique in DeFi as an institutional/undercollateralized lending protocol. Unlike Aave or Compound where users deposit and borrow against overcollateralized positions, Maple facilitates fixed-term and open-term loans to vetted institutional borrowers. The pool flow data tells the story of institutional capital allocation.

## Key Decisions
- **Unified table**: Combined all 3 active pools (syrupUSDC, syrupUSDT, Secured Lending USDC) into one `maple_pool_flows` table with `pool_name` column. This is better for cross-pool analysis than separate tables per pool.
- **ERC-4626 events**: Used `Deposit` and `Withdraw` events from the ERC-4626 vault interface. These are the canonical flow events and include both `assets` (USDC amount) and `shares` (LP token amount).
- **Start block 19500000**: This captures the full history from the Syrup launch in May 2024.
- **Custom .pipe()**: Wrote a manual pipe transform instead of using `enrichEvents` to add `pool` and `pool_name` columns and map the contract address to human-readable names.

## Issues Encountered
- All 3 pools share the same ABI (ERC-4626 vault) so we only needed one contract typegen file, referenced for all pools.
- The CLI generated a project for a single pool — had to modify `src/index.ts` to track all 3 pool addresses.
- Volume chart uses `assets / 1000000` because all pools accept USDC/USDT (6 decimals). This is correct for stablecoin amounts.

## Data Quality
- 5,600+ events across ~1 year (March 2024 → March 2025)
- All 3 pools represented: syrupUSDC (3,900+), syrupUSDT (1,200+), Secured Lending USDC (480+)
- 162 unique depositors
- Portal cross-reference: exact match (24/24 in sample range)
- 3/3 transaction spot-checks confirmed
