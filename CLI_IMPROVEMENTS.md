# Pipes CLI Improvements

Tracked improvements for the Pipes CLI (`@iankressin/pipes-cli`), gathered from real indexer generation experience.

## Critical

### `ora` ESM/CJS crash on every `init` call
- **Source:** evm/001-aave-v3
- **Issue:** CLI crashes with `(0, import_ora.default) is not a function` on every invocation. Requires patching cached npm files that `npx` can overwrite at any time.
- **Fix:** Replace `ora` with a CJS-compatible spinner, or use dynamic import.

### SVM custom template broken
- **Source:** solana/001-kamino-lend
- **Issue:** `init` with `networkType: "svm"` and `templateId: "custom"` fails with `Invalid input: expected array, received undefined`. The custom SVM path is completely non-functional.
- **Fix:** Add a working `custom` template for SVM, or at minimum generate boilerplate files (package.json, tsconfig, docker-compose, .env).

## High Priority

### Proxy contract ABI resolution
- **Source:** evm/001-aave-v3, evm/002-lido, evm/003-binance-staked-eth, evm/008-sparklend, evm/013-fluid-lending
- **Issue:** CLI fetches the proxy ABI (only `Upgraded`/`AdminChanged` events) for proxy contracts. This is the #1 failure mode for major DeFi protocols — almost all use proxies. Hit again on SparkLend (ERC-1967 proxy → needed separate typegen on implementation `0x5ae329...`).
- **Fix:** Auto-detect proxy pattern, resolve implementation address, fetch implementation ABI. Warn if the fetched ABI contains only proxy events.
- **Frequency:** 9 out of 14 indexers required manual proxy resolution (64%). Not needed for: Morpho V1, Kamino, Pendle (Diamond—manual events), Rocket Pool, Venus.

### Default database name should be project-specific
- **Source:** evm/003-binance-staked-eth, evm/004-sky-lending, evm/005-morpho-v1
- **Issue:** CLI defaults to `pipes` database for every project. Running multiple indexers causes sync table conflicts.
- **Fix:** Default to a slugified project name (e.g., `morpho_blue` for a Morpho project).

### docker-compose missing persistent volume and CORS
- **Source:** evm/001-aave-v3, evm/003-binance-staked-eth, evm/004-sky-lending, evm/005-morpho-v1
- **Issue:** Every single generated project requires manually adding `clickhouse-data:/var/lib/clickhouse` volume and CORS XML mount to docker-compose.yml. Without the volume, data is lost on container restart. Without CORS, browser dashboards can't query ClickHouse.
- **Fix:** Include both in the docker-compose template by default.

### Custom template only supports single contract
- **Source:** evm/006-maple
- **Issue:** The `custom` template accepts one contract in the config. For protocols with multiple contracts sharing the same ABI (e.g., Maple's 3 pool contracts), the user must manually modify `src/index.ts` to add extra addresses to the `contracts` array.
- **Fix:** Allow `contracts` array in config to accept multiple addresses per ABI, e.g. `"contractAddresses": ["0xaaa", "0xbbb", "0xccc"]` alongside the single `contractAddress`.

### Diamond proxy produces empty contract file
- **Source:** evm/007-pendle
- **Issue:** When the CLI fetches ABI for a Diamond proxy (EIP-2535) like Pendle's Router, typegen produces an empty `Contract` class with no events. The user gets no error — just silently broken code that compiles but indexes zero events.
- **Fix:** Detect when typegen produces zero events and warn the user. Suggest checking if the contract is a Diamond proxy and provide the manual event definition fallback.

## Nice to Have

### Event signature validation
- **Source:** evm/003-binance-staked-eth
- **Issue:** CLI accepts user-provided event signatures without verification. Should warn if the keccak256 of the provided signature doesn't match any topic0 in recent on-chain logs for the contract.

### Selective typegen for specified events
- **Source:** evm/005-morpho-v1
- **Issue:** When using `--config` with specific `contractEvents`, the CLI still generates types for all contract events (17 in Morpho Blue's case). Would be cleaner to only generate types for specified events.

### No Solana ABI/IDL tooling
- **Source:** solana/001-kamino-lend
- **Issue:** EVM has `@subsquid/evm-typegen`. Solana needs an equivalent that takes an Anchor IDL and generates Pipes-compatible instruction definitions (d8 discriminators, account maps, borsh codecs). Without this, every Solana indexer requires manual instruction definition.

### No Hyperliquid CLI template
- **Source:** hyperliquid/001-perps-majors, 002-whale-tracker, 003-funding-pnl, 004-meme-coins, 005-liquidations
- **Issue:** Hyperliquid fills require fully manual project setup. All 5 Hyperliquid indexers share 90%+ identical boilerplate (HyperliquidFillsQueryBuilder, clickhouseTarget, CollapsingMergeTree migration, .env, docker-compose). Should add a `hyperliquidFills` template that generates: package.json with `@subsquid/pipes` dep, src/index.ts with query builder + clickhouse target, migrations dir, docker-compose.yml with CORS, .env with dedicated database name. The only per-indexer differences are: coin filter, fill field selection, pipe transform logic, and ClickHouse schema columns.

### Solana Stake Pool programs not indexable via events
- **Source:** protocols.json (DoubleZero, Sanctum, Jito, Jupiter Staked SOL, etc.)
- **Issue:** Solana liquid staking protocols use the native Stake Pool program which doesn't emit traditional events. 8+ protocols from the top 100 DeFi list use this pattern and are currently not indexable. Need instruction-level indexing support.

### Scroll dataset head streaming warning
- **Source:** evm/041-etherfi-borrowing-market
- **Issue:** Scroll dataset (`scroll-mainnet`) does not support real-time head streaming. The CLI logs a large warning block that could be mistaken for an error. Consider making this a single-line info message, or documenting which datasets support head streaming vs lagged-only.
