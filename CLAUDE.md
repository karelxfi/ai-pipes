# ai-pipes

AI-generated DeFi indexers using SQD Pipes SDK.

## Setup

Install agent skills on first use:

```bash
npx skills add subsquid-labs/agent-skills --all
```

## Generating an Indexer

Use the `/generate-indexer` command or follow this workflow manually:

1. Pick a protocol from `protocols.json` (status: "pending")
2. Research the protocol to find a compelling, protocol-specific angle
   - NOT generic "index Transfer events"
   - Find what makes this protocol unique and build around that
   - The angle should produce a visually interesting dashboard
3. Use the `pipes-new-indexer` skill to scaffold the indexer
4. Place the example in the correct VM directory:
   - `evm/NNN-slug/` for EVM chains
   - `solana/NNN-slug/` for Solana
   - `hyperliquid/NNN-slug/` for Hyperliquid
5. For multi-chain EVM protocols, default to Ethereum mainnet unless primarily deployed elsewhere

## Per-Example Checklist

Every generated example MUST include:

- [ ] `PROMPT.md` — exact verbatim prompt used (nothing more)
- [ ] `OUTPUT.md` — brief narrative: what happened, key decisions, issues resolved
- [ ] `IMPROVEMENTS.md` — feedback on how CLAUDE.md, generate-indexer command, and templates should improve based on this experience. Agent-skills specific issues go here too.
- [ ] `META.json` — date, pipes_sdk_version, agent_skills_version, claude_model, angle, runtime_status, validation_status
- [ ] `README.md` — with dashboard screenshot at top, **verification report** (full validate.ts output), run instructions, sample ClickHouse query
- [ ] `package.json` — with pinned Pipes SDK version
- [ ] `src/` — indexer source code
- [ ] `docker-compose.yml` — ClickHouse with persistent volume and CORS config
- [ ] `clickhouse-cors.xml` — CORS headers for browser dashboard access
- [ ] `validate.ts` — structural validation (schema, counts, ranges) + truth verification (Portal cross-reference + tx spot-checks)
- [ ] `dashboard/index.html` — standalone dark-themed dashboard with Apache ECharts
- [ ] `dashboard/screenshot.png` — captured screenshot of populated dashboard with REAL data

## Validation (MANDATORY — never skip)

**You MUST run the indexer, validate the output, verify data truth, and capture a real screenshot before committing.** An example without verified data and a real screenshot is not done. Period.

Before marking an example as done:

1. `docker compose up -d` — start ClickHouse
2. `npm install && npm start` — run the indexer, wait until 500+ rows appear
3. `npx tsx validate.ts` — all assertions must pass (structural + truth checks)
4. Open `dashboard/index.html` in browser — verify charts render with REAL data (not empty)
5. Capture `dashboard/screenshot.png` — must show populated charts, not empty panels
6. Visually confirm the screenshot looks good enough to share on X
7. Update META.json: `runtime_status: "working"`, `validation_status: "passed"`
8. Update `protocols.json` status to "done"

**How to check for data during sync:**
```bash
curl -s 'http://localhost:8123/?user=default&password=password' --data-binary "SELECT count() FROM <database>.<table>"
```

### Data Truth Verification (part of validate.ts)

Structural checks (schema, row count, ranges) are not enough. The data could be structurally valid but completely wrong. Every `validate.ts` must include TWO levels of truth verification:

#### Level 1: Cross-reference with SQD Portal MCP

Query the Portal MCP tools to independently count events for the same contract + block range, and compare against ClickHouse:

```typescript
// Example: verify event count against Portal
// Use portal_count_events or portal_query_logs to get independent count
// Compare: ClickHouse count should be within 5% of Portal count
// (small differences are OK due to sync timing)
```

What to verify:
- Total event count for the contract in the indexed block range
- Event count matches between ClickHouse and Portal (within 5% tolerance for sync timing)
- If counts diverge significantly, the indexer has a bug

#### Level 2: Transaction Spot-Checks

Pick 2-3 specific transactions and verify field-level correctness:

```typescript
// Example: spot-check a known transaction
// 1. Find a tx hash from ClickHouse
// 2. Look up that tx on block explorer (Etherscan/Solscan) or via Portal
// 3. Verify: contract address, event parameters, block number, timestamp all match
```

What to verify:
- Pick a tx hash from ClickHouse data
- Query Portal for that specific block's events
- Verify at least 2-3 fields match exactly (addresses, indexed params)
- Verify the block number and timestamp are correct

#### validate.ts Structure

```typescript
// Phase 1: Structural checks
// - Table exists, row count > 0
// - Schema has expected columns
// - Timestamps in range, amounts non-negative

// Phase 2: Portal cross-reference
// - Query Portal MCP for event count in same block range
// - Compare with ClickHouse count (5% tolerance)

// Phase 3: Transaction spot-checks
// - Pick 2-3 tx hashes from ClickHouse
// - Verify against Portal data or known transactions
// - Check field-level correctness
```

Log all verification results clearly:
```
PASS: Structural - 509 rows, schema OK, timestamps 2023-08-29 to 2024-03-12
PASS: Portal cross-ref - ClickHouse: 509, Portal: 512 (0.6% diff, within 5% tolerance)
PASS: Spot-check tx 0xabc... - block 18392741, collateral WETH, debt USDC matches Portal
PASS: Spot-check tx 0xdef... - block 19012553, collateral WBTC, debt USDT matches Portal
```

## Known Issues & Workarounds

### Pipes CLI `ora` crash
The CLI crashes with `(0, import_ora.default) is not a function`. Patch before running `init`:
```bash
CLI_PATH=$(find ~/.npm/_npx -name "index.cjs" -path "*pipes-cli*" 2>/dev/null | head -1)
sed -i.bak 's/var import_ora = __toESM(require("ora"), 1);/var import_ora = { default: function(opts) { var t = typeof opts === "string" ? opts : (opts \&\& opts.text) || ""; return { start: function(m) { console.log(m || t); return this; }, succeed: function(m) { console.log(m || t); return this; }, fail: function(m) { console.log(m || t); return this; }, stop: function() { return this; }, text: t }; } };/' "$CLI_PATH"
```

### Proxy contracts
Many DeFi protocol contracts are proxies. The CLI will fetch the proxy ABI (only `Upgraded` event). Always check:
```bash
grep "export const events" <project>/src/contracts/*.ts
```
If you only see `Upgraded`, find the implementation address on Etherscan ("Read as Proxy" tab) and regenerate:
```bash
npx @subsquid/evm-typegen@latest <project>/src/contracts <IMPL_ADDRESS> --chain-id 1
```
Then update the import in `src/index.ts`. Keep the proxy address in the `contracts` array.

### ClickHouse data persistence
Always add a named volume in docker-compose.yml so data survives container restarts:
```yaml
volumes:
  - clickhouse-data:/var/lib/clickhouse
  - ./clickhouse-cors.xml:/etc/clickhouse-server/config.d/cors.xml:ro
```

### ClickHouse CORS for dashboards
Every example needs `clickhouse-cors.xml` mounted for the browser dashboard to query ClickHouse:
```xml
<clickhouse>
    <http_options_response>
        <header><name>Access-Control-Allow-Origin</name><value>*</value></header>
        <header><name>Access-Control-Allow-Methods</name><value>GET, POST, OPTIONS</value></header>
        <header><name>Access-Control-Allow-Headers</name><value>*</value></header>
    </http_options_response>
</clickhouse>
```

### validate.ts must use dotenv
Always import `dotenv/config` and read credentials from `.env`:
```typescript
import 'dotenv/config'
const client = createClient({
  url: process.env.CLICKHOUSE_URL ?? 'http://localhost:8123',
  database: process.env.CLICKHOUSE_DATABASE,
  username: process.env.CLICKHOUSE_USER ?? 'default',
  password: process.env.CLICKHOUSE_PASSWORD ?? 'password',
});
```

### ClickHouse: can't mix aggregates with non-aggregated columns
`SELECT count(), non_agg_col FROM table ORDER BY col LIMIT 1` fails. Use separate queries for aggregates vs latest-row lookups.

### Node.js version
Use Node.js LTS (v20 or v22). Node v25+ has zstd bugs that crash on large syncs. For small syncs it usually works.

## Dashboard Design — IMPORTANT RULES

### Use Apache ECharts, NOT TradingView Lightweight Charts
- TradingView Lightweight Charts v5 broke the API, has watermarks, and is designed for candlestick data not BI dashboards
- Use `https://cdn.jsdelivr.net/npm/echarts@5.5.1/dist/echarts.min.js`

### Pick the right chart for the data
- **Time-series counts** (liquidations per day, swaps per hour) → vertical bar chart with gradient fill
- **Rankings** (top assets, top users) → horizontal bar chart with colored bars and value labels
- **Proportional composition** (debt breakdown, asset share) → treemap
- **Continuous values over time** (TVL, price) → area chart or line chart
- **NEVER use pie or donut charts**

### Be smart about data
- Use **counts** not raw token amounts — different tokens have different decimals, summing raw amounts across tokens is meaningless without price feeds
- If you need volume, normalize to a single denomination (e.g., ETH or USD) — don't just divide by 1e18
- Always include **legends** on categorical charts
- Summary stats in the header: total row count, key metrics, **and the time period** (e.g., "2023-05-16 → 2024-03-14")

### Visual standards
- Dark theme: background `#0d1117`, panels `#161b22`, borders `#30363d`
- Gradient fills on bar charts (e.g., `#58a6ff` → `#1f6feb` for blue, `#f78166` → `#da3633` for red)
- Color palette: `['#58a6ff','#f78166','#3fb950','#d2a8ff','#f0883e','#79c0ff','#7ee787','#d29922','#ff7b72','#a5d6ff']`
- Footer: `Built with ai-pipes + SQD Pipes SDK | github.com/karelxfi | x.com/karelxfi`
- 1200x675 viewport (X card ratio)
- Set `window.__DASHBOARD_READY__ = true` when data is loaded (for screenshot script)

### Token address resolution
Include a lookup map for common token addresses → symbols. For unknown addresses, show `0xABCD..EF12` format.

## Conventions

- Follow agent-skills CLAUDE.md (Rule 0: always read project docs before implementation)
- Record installed agent-skills commit SHA in META.json
- Pipes SDK version pinning is the primary reproducibility mechanism
- Each example is a self-contained commit
- Use `npm` as package manager (not bun — for wider compatibility)
- Use dedicated ClickHouse database per indexer (avoid sync table conflicts)
