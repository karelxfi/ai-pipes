# Improvements — Drift Staked SOL

## CLAUDE.md Improvements

- **Document the SPL Token mint/burn pattern as a reusable template:** After proving this pattern works for both jupSOL (008) and dSOL (011), it should be documented as the standard approach for any SPL Stake Pool-based LST. The only variable is the token mint address.

## Agent Skills Improvements

- **No new issues found.** The pattern is well-established at this point.

## Dashboard Patterns That Worked

- **Same layout as jupSOL with protocol-specific branding:** Reusing the deposit/withdrawal bar chart and cumulative flow line works for any staking protocol. Just swap the color accent and title.
- **Low-volume dashboards:** With only 87 rows, individual event dots on a scatter plot are more readable than aggregated bars.

## Key Learnings

1. **Pattern reuse across LSTs:** The SPL Token mint/burn pattern is now proven across two protocols. Any future SPL Stake Pool-based LST (e.g., bSOL, hSOL) can use the exact same indexer template — just change the mint address.
2. **Sanctum as infrastructure layer:** Both jupSOL and dSOL route through Sanctum's SPL Stake Pool program, confirming Sanctum's role as the dominant LST infrastructure on Solana.
3. **Volume disparity between LSTs:** jupSOL had 694 events vs dSOL's 87 in the same period — roughly 8x difference, reflecting the significant market share gap between Jupiter and Drift's staking products.
