# Improvements — 007 TradFi Invasion

## CLAUDE.md

1. **Document Portal API `/stream` endpoint for Hyperliquid**: The raw Portal endpoint needs `/stream` suffix and fills filter format is `[{}]` not `[{ request: {} }]`. Add this to the HL section of Known Issues.

2. **Document SDK vs Portal block count mismatch**: Pipes SDK batches Hyperliquid blocks differently from raw Portal stream. Spot-checks should be the primary truth verification for HL indexers, not block-range count comparison.

3. **Add Node.js v25 crash recovery pattern**: Document that the indexer checkpoints correctly and restarts work fine — just need to restart the process.

## generate-indexer Command

1. **Asset classification helper for Hyperliquid**: The `xyz:` / `cash:` prefix pattern for TradFi markets should be a documented pattern in the HL skills. New indexers shouldn't need to discover this from live data.

2. **Validate.ts template should handle HL fills differently**: The Portal cross-reference approach for Hyperliquid needs the correct endpoint URL and fill filter format. Current template assumed EVM-style counting.

## Templates

1. **HL validate.ts needs `/stream` in Portal URL**: Every HL validate.ts I've written needed this fix. Should be in the template.
2. **HL indexer template should include asset classification boilerplate**: The `xyz:`/`cash:` prefix detection and ticker sets are reusable across HL indexers.
