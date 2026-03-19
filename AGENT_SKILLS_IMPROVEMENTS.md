# Agent Skills Improvements

Tracked improvements for `subsquid-labs/agent-skills`, gathered from real indexer generation experience.

## pipes-new-indexer Skill

### Non-standard proxy patterns (Aragon, Diamond, UUPS)
- **Source:** evm/002-lido, evm/007-pendle
- **Issue:** Skill only documents standard ERC-1967 proxies. Lido uses Aragon's `AppProxyUpgradeable`, Pendle Router uses Diamond proxy (EIP-2535). Both cause typegen to return empty/proxy-only ABI.
- **Fix:** Updated with real working example using `event()` + `indexed()` from `@subsquid/evm-abi` (not the outdated `LogEvent` pattern). Added detection guidance and event signature version change warnings.
- **Status:** Patched locally. Updated with Pendle experience (2026-03-19).

### Event signature version changes across upgrades
- **Source:** evm/007-pendle
- **Issue:** Pendle's `SwapYtAndToken` event changed its data layout between Router versions. Older events have fewer non-indexed parameters than the current ABI. Causes `EventDecodingError: Offset is outside the bounds of the DataView`.
- **Fix:** Added warning about version changes to the Diamond proxy section. Workaround: remove the problematic event or filter to blocks after the upgrade.

### Proxy detection should be a mandatory pre-step
- **Source:** evm/001-aave-v3, evm/008-sparklend
- **Issue:** Proxy detection is mentioned in Step 3.5 but buried. 6 out of 9 indexers required manual proxy resolution (Aave V3, Lido, wBETH, Pendle, SparkLend, Sky Lending). This is the #1 failure mode.
- **Fix:** Move proxy detection to a mandatory pre-step before running CLI. Check Etherscan for proxy status, fetch implementation address.

### Aave V3 fork pattern recognition
- **Source:** evm/001-aave-v3, evm/008-sparklend
- **Issue:** SparkLend is an Aave V3 fork with identical Pool ABI and event signatures. The skill doesn't mention fork recognition — if you know a protocol is an Aave V3 fork, you can reuse the same event definitions (Supply, Withdraw, Borrow, Repay, LiquidationCall) with just a different proxy address.
- **Fix:** Add a "common fork patterns" section: Aave V3 forks (SparkLend, Radiant, Seamless), Uniswap V2/V3 forks, Compound V2 forks.

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
