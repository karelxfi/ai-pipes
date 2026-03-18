# Improvements — wBETH Oracle Health Monitor

## CLAUDE.md improvements

1. **Event signature verification workflow** — Add a recommended workflow for verifying event signatures when the prompt provides a "guess". Steps: (1) query Portal for actual topic0s from the contract, (2) look up unknown topic0s on 4byte.directory, (3) cross-reference with implementation source. This was critical for wBETH where the guessed signature was wrong.

2. **Proxy resolution guidance** — The current docs say to try `evm-typegen` with the implementation address. But for some proxies (like AdminUpgradeabilityProxy), even the implementation ABI fetched by typegen may not include all events if they're in parent contracts. Add fallback: "If typegen fails, query Portal for actual topic0s and look them up on 4byte.directory."

## Agent skills improvements

1. **CLI should attempt implementation ABI fetch** — When the CLI detects a proxy (AdminChanged/Upgraded events only), it should automatically try to resolve the implementation address and fetch that ABI. Currently it silently generates a proxy-only ABI.

2. **CLI event signature validation** — The CLI accepted the user-provided event signature without verification. It should warn if the provided event signature's keccak256 doesn't match any topic0 found in recent on-chain logs for that contract.

## Template improvements

1. **Dedicated database by default** — The CLI still defaults to `pipes` database. Each indexer should get its own database name derived from the project slug (e.g., `wbeth` for `003-binance-staked-eth`).

2. **CORS config and persistent volume** — The docker-compose template should include CORS config mount and persistent volume by default, since every indexer needs them.
