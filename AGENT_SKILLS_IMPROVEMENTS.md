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

## Portal Query Skills

### portal-query-evm-traces: chunk size critical for CREATE trace queries
- **Source:** tools/deployment-tracker
- **Issue:** Querying CREATE traces with `createFrom` filter in 500K block chunks causes Portal to silently drop trace results from the ndjson stream. 50K chunks work correctly. The skill doesn't mention this limit.
- **Fix:** Add a warning about chunk size limits for trace queries. Recommend ≤50K blocks per request for CREATE traces.
- **Status:** PR #10 submitted with contract registry use case, but chunk size warning not yet added.

### portal-query-evm-traces: no createResultAddress filter support
- **Source:** tools/deployment-tracker
- **Issue:** The Portal stream API supports `createFrom` (deployer address) as a filter but NOT `createResultAddress` (deployed contract address). This means reverse lookup (finding who deployed a known contract) isn't possible directly. The skill doesn't explicitly state this limitation.
- **Fix:** Add a note that reverse lookup by deployed address is not supported. Workaround: use `createFrom` with known deployer addresses.

### portal-query-evm-logs: topic0 verification workflow
- **Source:** evm/007-pendle, evm/003-binance-staked-eth
- **Issue:** When indexing custom events (especially from Diamond proxies), the topic0 hash must be verified against actual on-chain data. The Portal query skills could recommend a standard verification workflow: (1) query contract activity to get topic0 list, (2) decode a few samples, (3) match against expected event signatures.
- **Fix:** Add a "verify event signatures" section to portal-query-evm-logs.

### Portal MCP tools: batch vs individual deployer queries
- **Source:** tools/deployment-tracker
- **Issue:** When querying `createFrom` with multiple addresses (e.g., 10+ deployers), high-volume deployers (Rocket Pool: 5,577 minipools) dominate the response and traces from other deployers get lost. The `portal_query_traces` MCP tool doesn't warn about this.
- **Fix:** Document that multi-address trace filters should be used cautiously. For comprehensive results, query each address individually.

## pipes-new-indexer Skill (continued)

### pipeComposite decoded event field access pattern
- **Source:** evm/014-stakewise-v2
- **Issue:** The skill extensively documents `enrichEvents` helper from CLI-generated code, but doesn't document the raw event structure when using `pipeComposite` + manual `.pipe()`. Fields are: `d.block.number`, `d.rawEvent.transactionHash`, `d.timestamp` (Date), `d.event.*`, `d.contract`. Using wrong field names (e.g., `d.blockNumber`, `d.txHash`) silently returns undefined → stored as 0/"".
- **Fix:** Add a "Manual .pipe() field reference" section to the skill.

### evmDecoder contracts field format confusion
- **Source:** evm/014-stakewise-v2
- **Issue:** `contracts` expects `['0xABC...']` (string array) but the factory pattern uses `factory({ address: ['0xABC...'] })`. Easy to confuse the two, causing `contract.toLowerCase is not a function`.
- **Fix:** Add a clear note: "For static contracts, pass an array of address strings. For dynamic factory-deployed contracts, use the `factory()` helper."

### portal-query-solana-instructions: `signatures` not `signature`
- **Source:** solana/003-sanctum-router
- **Issue:** Portal Solana transaction fields use `signatures` (plural, array) not `signature`. Using `signature` causes "unknown field" error.
- **Fix:** Document valid Solana transaction fields in the skill. Key ones: `signatures`, `accountKeys`, `feePayer`, `err`, `fee`, `computeUnitsConsumed`.

### portal-query-solana-instructions: volume estimation before building indexer
- **Source:** solana/003-sanctum-router
- **Issue:** Built a Router-only indexer before discovering it has ~2 instructions per 1K slots. Most Sanctum activity flows through S Controller (Infinity pool). Should verify volume first.
- **Fix:** Add workflow step: "Before building, query Portal for instruction count in a 10K slot sample. If < 50 instructions, investigate related programs."

## Pipes SDK Suggestions

### `solanaInstructionDecoder` classify-only mode
- **Source:** solana/001-kamino-lend
- **Issue:** Currently requires a full `decode` method on each instruction. A lighter API that classifies by d8 and returns raw data (without borsh decoding) would cover "count by action type" use cases.

### Add `feePayer` field to Transaction
- **Source:** solana/001-kamino-lend
- **Issue:** `accountKeys[0]` works but an explicit `feePayer` field would be cleaner and avoid needing the full `accountKeys` array.

### portal-query-evm-logs: Stream API requires `type` field
- **Source:** evm/053-cooler-loans
- **Issue:** Portal Stream API (`/datasets/{dataset}/stream`) POST body requires a `"type": "evm"` field. Without it, queries fail with `missing field 'type'`. The MCP tools handle this automatically, but the validate.ts cross-reference pattern using direct `fetch()` calls needs to include it.
- **Fix:** Document in portal-query-evm-logs skill that direct Stream API calls need `{"type": "evm", "fromBlock": ..., "toBlock": ..., "logs": [...]}`.

### pipes-new-indexer: EventEmitter proxy pattern
- **Source:** evm/041-etherfi-borrowing-market
- **Issue:** Some protocols (e.g., ether.fi Cash) use a centralized EventEmitter proxy that aggregates events from multiple user contracts. The scaffold skill should detect this pattern: when the ABI shows only `Upgraded`, check for the implementation address in recent Upgraded events. Additionally, after ABI generation, verify which events actually fire on-chain by querying Portal with topic0 hashes before writing indexer code — some ABI events never fire on the emitter contract.

### portal-query-evm-logs: Stream API silently truncates large block ranges
- **Source:** evm/056-infinifi
- **Issue:** When querying the Portal Stream API with block ranges >5k blocks containing many events, the response silently truncates (returns fewer logs than exist). A 10k block range returned 184 logs when ClickHouse had 381. Chunking at 2k blocks gave exact match (174 = 174). The validate.ts cross-reference pattern must chunk large ranges into 2k-block segments.
- **Fix:** Document in portal-query-evm-logs that direct `fetch()` calls to the Stream API should chunk at <=2000 blocks per request for accurate counts.

### portal-query-evm-logs: Portal count API path not documented
- **Source:** evm/041-etherfi-borrowing-market
- **Issue:** The validate.ts cross-reference pattern tries to use `/datasets/{dataset}/logs/count?address=...&topic0=...` but this endpoint returns 404. The correct way to count events via Portal is either through the MCP summary format or the Stream API. Document the available count/summary endpoints for direct fetch-based verification.
