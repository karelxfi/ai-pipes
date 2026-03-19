# Maple Finance — Improvements

## CLAUDE.md Improvements
- Volume chart for stablecoin pools should always divide by the correct decimal (6 for USDC/USDT, 18 for ETH). Add a note about common stablecoin decimals to the dashboard rules.
- For multi-contract indexing (same ABI, different addresses), document the pattern of using a single typegen file + address-to-name mapping in the pipe transform.

## Agent Skills Improvements
- The `pipes-new-indexer` skill's custom template only supports a single contract. For protocols with multiple contracts sharing the same ABI (like Maple's 3 pools), the user has to manually modify `src/index.ts` to add extra addresses. Consider supporting a `contracts` array with multiple addresses per ABI.

## Dashboard Patterns That Worked
- Unified table with `pool_name` column enables clean cross-pool comparisons
- Stacked bar for deposits vs withdrawals makes the flow direction immediately visible
- Horizontal bar chart for pool comparison works well with 3 pools

## Skills Patches Applied
No skill patches needed — the generation was smooth. The main customization was adding multiple pool addresses to the generated code.
