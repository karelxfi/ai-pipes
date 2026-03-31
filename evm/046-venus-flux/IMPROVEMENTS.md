# Improvements — Venus Flux (046)

## CLAUDE.md improvements needed

1. **Protocol naming confusion** — When a protocol in `protocols.json` has a different name than its underlying technology (e.g., "Venus Flux" is actually Instadapp Fluid on BSC), CLAUDE.md should suggest checking DeFiLlama API (`https://api.llama.fi/protocol/<slug>`) early in research to understand the actual protocol identity.

2. **Proxy contract ABI workflow** — The existing CLAUDE.md guidance on proxy contracts is good but could add: "For infinite-proxy patterns (like Instadapp's), even the implementation won't have the full ABI. You may need to manually create event definitions from the source code or verified contract on the block explorer."

## generate-indexer skill improvements

1. **No issues** — The manual workflow was straightforward for this indexer. The enrichEvents helper pattern works well.

## Dashboard template improvements

1. **Treemap label truncation** — When treemap cells are small, labels get truncated with "...". Consider adding `overflow: 'truncate'` and `ellipsis: '...'` options to the ECharts treemap config in the template guidance.

2. **Unknown token addresses** — The dashboard shows raw hex for unlabeled tokens. Could suggest a pattern for fetching token symbols from ClickHouse or a fallback resolver.
