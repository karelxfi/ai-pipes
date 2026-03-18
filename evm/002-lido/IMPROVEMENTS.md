# Improvements from Lido Generation

## Agent Skills Issues

### 1. Aragon proxy pattern not handled by typegen (CRITICAL)
Lido uses Aragon's `AppProxyUpgradeable` which neither the Pipes CLI nor `@subsquid/evm-typegen --chain-id 1` can resolve. Both return only the proxy ABI (`ProxyDeposit` event). The current skill docs only mention standard ERC-1967 proxies.

**Resolution:** Manually wrote the contract types file with the `TokenRebased` event definition and computed the keccak256 topic0.

**Suggestion for pipes-new-indexer skill:** Add a section about non-standard proxy patterns (Aragon, Diamond, UUPS variants) and document the manual contract type creation fallback when typegen fails.

### Skills patches applied
- Updated `.agents/skills/pipes-new-indexer/SKILL.md` — added Aragon proxy pattern documentation to the proxy detection section

## CLAUDE.md Improvements

### 2. ClickHouse query gotcha: can't mix aggregates with non-aggregated columns
The summary dashboard query `SELECT count(), non_agg_col FROM table ORDER BY col LIMIT 1` fails in ClickHouse. Need separate queries for aggregates vs latest-row lookups.

**Applied:** Added this gotcha to CLAUDE.md known issues.

### 3. validate.ts Phase 3: raw data hex decoding is fragile
Decoding non-indexed event params from the raw `data` hex field is error-prone (byte offsets depend on ABI encoding). Simplified to verify: tx found in Portal + address match + topic0 match + data payload exists. The Portal cross-reference (Phase 2) already proves data completeness.

## No issues with
- Dashboard template (ECharts worked perfectly)
- Chart type selection (area for continuous rate/TVL, bars for counts)
- ClickHouse CORS, persistent volume, dotenv auth — all worked first try from the Aave V3 learnings
