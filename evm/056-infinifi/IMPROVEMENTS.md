# Improvements — infiniFi (056)

## CLAUDE.md

- The Portal Stream API format documentation could be more explicit. The `type: 'evm'` with `logs: [{address, topic0}]` pattern is correct but not prominently documented vs the incorrect `type: 'logs'` format
- Consider adding a validate.ts template snippet that shows the correct Portal chunking pattern, since large ranges silently truncate

## generate-indexer / pipes-new-indexer

- When scaffolding an ERC-4626 vault indexer, could auto-detect the vault pattern and suggest indexing Deposit/Withdraw events specifically
- The proxy contract check should also verify ERC-4626 vault contracts (they're not proxies but have a different ABI pattern)

## Dashboard template

- The Bloomberg terminal style guidelines work well for this type of protocol
- Stacked positive/negative bar charts (mints up, burns down) are effective for flow visualization — could add this as a recommended pattern for reserve/banking protocols

## Agent skills

- `portal-query-evm-logs` skill: the Portal Stream API stream endpoint chunking behavior should be documented — responses get truncated for ranges >5k blocks with many events, requiring client-side chunking
- `pipes-new-indexer` skill: no issues encountered during scaffold

## General observations

- infiniFi is a relatively new protocol (launched mid-2025) with moderate but consistent activity
- The fractional reserve angle is unique and makes for compelling visualization
- VaultProfit/VaultLoss events in the ABI had 0 occurrences — worth noting for future indexers that ABI events don't guarantee on-chain activity
