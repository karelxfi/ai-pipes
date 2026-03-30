# Improvements — Aave v4 Launch Monitor

## CLAUDE.md / Templates

1. **Near-head Portal lag should be documented**: When indexing protocols that just launched (last few hours), the Portal stream API works but the query endpoint lags. The validate.ts pattern for cross-reference should note that narrow block ranges from the start of data work better than full-range comparisons for very recent data.

2. **enrichEvents should include contract by default**: Every multi-contract indexer needs to know which contract emitted the event. The `enrichEvents` helper should include `contract: v.contract` in its output by default, not require manual patching.

3. **Start block guidance for just-launched protocols**: When a protocol deploys contracts days before activation, the deployment block may have tens of thousands of empty blocks before any events. CLAUDE.md should suggest checking when first events appear (via Portal) and adjusting the start block accordingly.

## Pipes CLI

No new issues discovered. The `evm-typegen` worked cleanly with both implementation addresses.

## Agent Skills

1. **portal-query-evm-logs**: Should document that the Portal query/stream endpoint can return 503s for blocks near the chain head, and the stream API (used by Pipes SDK) handles this with automatic retries. Validation scripts should use narrow ranges from older blocks.

## Dashboard

The treemap chart works well for event type breakdown with 4 categories. The horizontal bar for spoke ranking is effective when you have 11 named categories to compare.
