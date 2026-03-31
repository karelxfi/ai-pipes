# Improvements — Fluid Lite

## CLAUDE.md improvements

1. **Add guidance for newly deployed contracts** — When a contract has been deployed very recently (<30 days), the standard Portal block-range queries may return 0 results even though events exist. Recommend using `get_contract_activity` with `7d` timeframe first to confirm activity, then narrow the block range.

2. **Multiple decoders with different start blocks** — Document the pattern of using separate decoders with different `range.from` values when indexing contracts deployed at very different times. The SDK handles this correctly (each decoder only matches after its start block).

3. **Exchange rate formatting** — Add note about ERC-4626 vaults storing exchange rates as 18-decimal integers. Always divide by 1e18 in dashboard SQL queries.

## generate-indexer command improvements

1. **Proxy detection should check both contracts** — When indexing multiple contracts, each may need separate proxy resolution. The current workflow only resolves one.

2. **Event name differences across contracts** — Same logical event (exchange price update) may have different names/signatures across contracts in the same protocol. The scaffold should note this.

## Template improvements

1. **Weekly aggregation for sparse data** — When daily data produces >150 x-axis labels, switch to weekly aggregation automatically in dashboard queries.
