# Improvements from EtherFi Cash Indexer (041)

## CLAUDE.md Improvements

1. **Add Scroll chain guidance** — Scroll is a supported Portal dataset (`scroll-mainnet`) but the dataset doesn't support real-time head streaming. Add a note about which chains have this limitation so the agent doesn't treat the warning as an error.

2. **Event emitter pattern** — Some protocols (like ether.fi Cash) use a centralized EventEmitter proxy that aggregates events from multiple user contracts. This is different from the factory pattern. CLAUDE.md should document this pattern: "Check if the protocol uses an EventEmitter contract that aggregates events from user-specific contracts."

3. **ABI events that don't fire** — The ABI may define events that the contract never actually emits (e.g., AddCollateralToDebtManager on the emitter vs DebtManager). Document the pattern: "After generating ABI typings, verify which events actually fire by querying Portal with the topic0 hashes before building the full indexer."

## generate-indexer Skill Improvements

1. **Portal event verification step** — After identifying the contract and generating ABI, the skill should verify which events actually have on-chain activity before writing the indexer code. This would have saved time discovering that Borrow/Collateral events don't exist on the emitter.

2. **Proxy implementation detection** — When the ABI only has `Upgraded`, automatically look for the implementation address in recent Upgraded events on Portal, rather than requiring manual lookup.

## Template Improvements

1. The template should handle the case where a contract emits events on behalf of other contracts (emitter pattern) — common in newer DeFi protocols that want gas-efficient event aggregation.
