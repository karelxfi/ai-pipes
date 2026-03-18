# Improvements — Morpho Blue

## CLI / Templates

1. **docker-compose still missing volumes and CORS** — Same issue as every previous example. The CLI-generated docker-compose.yml lacks persistent ClickHouse volumes and the CORS XML mount. The template should include `clickhouse-data:/var/lib/clickhouse` and the CORS mount by default.

2. **Default database name still `pipes`** — CLI defaults to `pipes` as database name in both docker-compose and .env. Should use a slugified version of the project name (e.g., `morpho_blue` for `005-morpho-v1`).

3. **Custom template with pre-specified events still fetches full ABI** — When using `--config` with specific `contractEvents`, the CLI still fetches the full contract ABI from chain and generates typegen for all events (17 events in Morpho Blue's case). While this is fine (we select which events to index in src/index.ts), it would be cleaner to only generate types for the specified events.

## CLAUDE.md

1. **bytes32 market IDs** — Unlike MakerDAO's bytes32 ilk fields that decode to ASCII, Morpho Blue's market IDs are keccak256 hashes with no ASCII meaning. CLAUDE.md's bytes32 decoding guidance is MakerDAO-specific. Should note that not all bytes32 fields decode to ASCII — some are hash identifiers.

2. **Multi-table indexers** — The existing examples are all single-table. Having guidance on when to split events into separate tables vs. a unified table would help. The decision depends on schema compatibility and query patterns.

## Agent Skills

No issues encountered with agent skills on this example.
