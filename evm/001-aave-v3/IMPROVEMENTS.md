# Improvements from Aave V3 Generation

## Issues Encountered

### 1. Proxy Contract ABI (Critical)
The Aave V3 Pool is a proxy contract. The Pipes CLI fetched the proxy ABI (only `Upgraded` event) instead of the implementation ABI with `LiquidationCall`.

**Fix applied:** Ran `@subsquid/evm-typegen` against the implementation address and updated the import.

**Suggested improvement to CLAUDE.md:** Add a section about proxy contract detection. Before using the `custom` template, always check if the target contract is a proxy on Etherscan. If so, find the implementation address and plan to regenerate the ABI after CLI scaffolding.

### 2. CLI `ora` Crash
The Pipes CLI crashes with `(0, import_ora.default) is not a function` on `init`. Required patching the cached CLI bundle.

**Suggested improvement:** Document the patch command directly in CLAUDE.md as a mandatory pre-step before running any `pipes-cli init` command.

### 3. Database Naming
The CLI defaults to database name `pipes`. Each indexer needs its own database to avoid sync table conflicts.

**Suggested improvement to generate-indexer command:** Always create a dedicated database named after the protocol slug (e.g., `aave_v3_pool`) and update `.env` accordingly.

### 4. Dashboard Template
The dashboard template worked well but needed more guidance on:
- How to query ClickHouse from the browser (CORS headers needed on ClickHouse)
- How to format BigInt values for display (token amounts need decimal adjustment)

**Suggested improvement to dashboard template:** Add a `formatTokenAmount(raw, decimals)` helper and a note about ClickHouse CORS config in docker-compose.

### 5. Start Block Selection
Block 18000000 (~Sep 2023) is a reasonable start for getting liquidation data, but the instructions should provide guidance on picking start blocks for different protocols.

**Suggested improvement:** Add to CLAUDE.md: "For testing, start from a recent block (last 1-2 months). For production, start from the contract deployment block. Check deployment block on Etherscan."
