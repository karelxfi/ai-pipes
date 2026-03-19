# Agent Skills Improvements

Tracked improvements for `subsquid-labs/agent-skills`, gathered from real indexer generation experience.

## pipes-new-indexer Skill

### Non-standard proxy patterns (Aragon, Diamond, UUPS)
- **Source:** evm/002-lido
- **Issue:** Skill only documents standard ERC-1967 proxies. Lido uses Aragon's `AppProxyUpgradeable` which neither CLI nor typegen can resolve. Required manually writing contract types and computing keccak256 topic0.
- **Fix:** Add section about non-standard proxy patterns and the manual contract type creation fallback.
- **Status:** Patched locally, PR submitted.

### Proxy detection should be a mandatory pre-step
- **Source:** evm/001-aave-v3
- **Issue:** Proxy detection is mentioned in Step 3.5 but buried. For Aave V3, the Pool contract is a proxy — CLI fetched only `Upgraded` event ABI. This is the #1 failure mode.
- **Fix:** Move proxy detection to a mandatory pre-step before running CLI. Check Etherscan for proxy status, fetch implementation address.

### Portal-based event signature discovery
- **Source:** evm/003-binance-staked-eth, solana/001-kamino-lend
- **Issue:** When the prompt provides a "guess" at event signatures, there's no verification workflow. For wBETH the guessed signature was wrong. For Kamino, computed Anchor discriminators returned zero results.
- **Fix:** Add recommended workflow: (1) query Portal for actual topic0s/d8s from the contract, (2) look up unknowns on 4byte.directory, (3) cross-reference with source code.

### Solana path needed
- **Source:** solana/001-kamino-lend
- **Issue:** Skill is EVM-focused. Should detect SVM projects and adjust scaffolding (no ABI, use d8 discriminators, slot instead of block_number, different field patterns).

## pipes-deploy Skill

### ClickHouse CORS for browser dashboards
- **Source:** evm/001-aave-v3
- **Issue:** Skills don't mention that browser-based dashboards querying ClickHouse need CORS headers. Every dashboard builder hits this.
- **Fix:** Add `clickhouse-cors.xml` snippet to the local Docker section.
- **Status:** PR submitted (may overlap with upstream changes).

### Database isolation guidance
- **Source:** evm/001-aave-v3
- **Issue:** Skill documents "use separate database per indexer" but CLI defaults to `pipes`. Should make post-generation database setup more prominent.

## Pipes SDK Suggestions

### `solanaInstructionDecoder` classify-only mode
- **Source:** solana/001-kamino-lend
- **Issue:** Currently requires a full `decode` method on each instruction. A lighter API that classifies by d8 and returns raw data (without borsh decoding) would cover "count by action type" use cases.

### Add `feePayer` field to Transaction
- **Source:** solana/001-kamino-lend
- **Issue:** `accountKeys[0]` works but an explicit `feePayer` field would be cleaner and avoid needing the full `accountKeys` array.
