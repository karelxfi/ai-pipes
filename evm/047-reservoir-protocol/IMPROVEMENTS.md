# Improvements — Reservoir Protocol (047)

## CLAUDE.md improvements needed

1. **Per-contract decimal handling** — When indexing multiple contracts of the same type (e.g., multiple PSMs), their underlying token decimals may differ. CLAUDE.md should warn about this and suggest building a decimals lookup map per contract address.

2. **Portal 503 near chain tip** — Document that Portal frequently returns 503 for blocks near the chain tip. The SDK handles this with retries, but it can cause the indexer to stall for minutes at ~95% progress. For the sync to complete, either wait or accept partial data.

## generate-indexer skill improvements

1. **Multi-contract same-ABI pattern** — When multiple contracts share the same ABI (like PSM:USDC, PSM:USDT, PSM:USD1), the skill should suggest passing all addresses to a single evmDecoder rather than creating multiple decoders.

## Dashboard template improvements

1. **Net flow stat with color** — The pattern of showing mint-redeem net flow with green/red coloring is useful for CDP/stablecoin protocols. Consider adding this as a template pattern.
