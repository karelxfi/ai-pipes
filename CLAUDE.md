# ai-pipes

AI-generated DeFi indexers using SQD Pipes SDK.

## Setup

Install agent skills on first use:

```bash
npx skills add subsquid-labs/agent-skills --all
```

## Generating an Indexer

Use the `/generate-indexer` command or follow this workflow manually:

1. Pick the NEXT protocol from `protocols.json` (status: "pending") **IN ORDER. DO NOT SKIP.**
   - **NEVER skip a protocol because it's "too complex"** — that's the entire point of this project
   - If a protocol requires factory patterns, custom event decoding, instruction-level analysis, or novel architecture → figure it out
   - Document what you learned in IMPROVEMENTS.md — complex protocols teach the most
   - The only valid reason to skip is if the chain is truly not supported by Portal (already filtered out)
2. **Check contracts-registry first** — look up the protocol in `/Users/kb/dev/personal/contracts-registry-llm/data/sources/protocols/<slug>/`
   - If it has verified addresses, use them directly (skip research)
   - If empty/placeholder, proceed to research
3. Research the protocol to find a compelling, protocol-specific angle
   - NOT generic "index Transfer events"
   - Find what makes this protocol unique and build around that
   - The angle should produce a visually interesting dashboard
4. Use the `pipes-new-indexer` skill to scaffold the indexer
5. Place the example in the correct VM directory:
   - `evm/NNN-slug/` for EVM chains
   - `solana/NNN-slug/` for Solana
   - `hyperliquid/NNN-slug/` for Hyperliquid
6. For multi-chain EVM protocols, default to Ethereum mainnet unless primarily deployed elsewhere
7. **After validation passes**, update contracts-registry with verified addresses (see below)

## Per-Example Checklist

Every generated example MUST include:

- [ ] `PROMPT.md` — exact verbatim prompt used (nothing more)
- [ ] `OUTPUT.md` — brief narrative: what happened, key decisions, issues resolved
- [ ] `IMPROVEMENTS.md` — feedback on how CLAUDE.md, generate-indexer command, and templates should improve based on this experience
- [ ] Update `CLI_IMPROVEMENTS.md` (root) — append any new Pipes CLI issues discovered
- [ ] Update `AGENT_SKILLS_IMPROVEMENTS.md` (root) — append any new agent-skills issues discovered
- [ ] `META.json` — date, pipes_sdk_version, agent_skills_version, claude_model, angle, runtime_status, validation_status
- [ ] `README.md` — with dashboard screenshot at top, **verification report** (full validate.ts output), run instructions, sample ClickHouse query
- [ ] `package.json` — with pinned Pipes SDK version
- [ ] `src/` — indexer source code
- [ ] `docker-compose.yml` — ClickHouse with persistent volume and CORS config
- [ ] `clickhouse-cors.xml` — CORS headers for browser dashboard access
- [ ] `validate.ts` — structural validation (schema, counts, ranges) + truth verification (Portal cross-reference + tx spot-checks)
- [ ] `dashboard/index.html` — standalone dark-themed dashboard with Apache ECharts
- [ ] `dashboard/screenshot.png` — captured screenshot of populated dashboard with REAL data
- [ ] `contracts.json` — ALL verified contract addresses across ALL chains (for contracts-registry)

## Validation (MANDATORY — never skip)

**You MUST run the indexer, validate the output, verify data truth, and capture a real screenshot before committing.** An example without verified data and a real screenshot is not done. Period.

Before marking an example as done:

1. `docker compose up -d` — start ClickHouse
2. `npm install && npm start` — run the indexer, **let it sync for years of data, not months**. The dashboard should show long-term trends. For daily events aim for 500+ rows; for rare events (liquidations) let it cover the full history.
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

### ClickHouse DateTime64(3) timestamp gotcha
When using `DateTime64(3, 'UTC')` columns, **always pass ISO strings** (not epoch seconds). ClickHouse interprets numeric values as fractional seconds from epoch — passing `1700392127` results in `1970-01-20` instead of `2023-11-19`. Use `d.timestamp.toISOString()` with `date_time_input_format: 'best_effort'`.

### evmDecoder contracts field
`evmDecoder({ contracts: [...] })` expects **an array of address strings**: `['0xABC...']`. The object format `[{ address: ['0xABC...'] }]` is ONLY for factory patterns. Using the wrong format crashes with `contract.toLowerCase is not a function`.

### Pipes SDK 1.0 API (CURRENT)
**`pipeComposite` is REMOVED.** Decoders/query builders are now passed as `outputs` to the stream function. A new `id` field is required.

**Function renames (old names are deprecated aliases):**
- `evmPortalSource` → `evmPortalStream`
- `hyperliquidFillsPortalSource` → `hyperliquidFillsPortalStream`
- `solanaPortalSource` → `solanaPortalStream`
- `new HyperliquidFillsQueryBuilder()` → `hyperliquidFillsQuery()`
- `new SolanaQueryBuilder()` → `solanaQuery()`
- `new EvmQueryBuilder()` → `evmQuery()`

**EVM pattern:**
```ts
const decoder = evmDecoder({ range: {...}, contracts: [...], events: {...} }).pipe(enrichEvents)
evmPortalStream({ id: 'my-indexer', portal: '...', outputs: { decoder } })
  .pipeTo(clickhouseTarget({...}))
// data accessed as: data.decoder.EventName
```

**Hyperliquid pattern:**
```ts
const query = hyperliquidFillsQuery().addRange(...).addFields(...).addFill(...)
hyperliquidFillsPortalStream({ id: 'hl-fills', portal: '...', outputs: query })
  .pipe((blocks) => { /* blocks is Block[] directly, NOT { blocks } */ })
  .pipeTo(target)
```

**Solana pattern:**
```ts
const query = solanaQuery().addFields(...).addInstruction(...)
solanaPortalStream({ id: 'sol-indexer', portal: '...', outputs: query })
  .pipe((blocks) => { /* blocks is Block[] directly */ })
  .pipeTo(target)
```

### Decoded event field access (evmDecoder output)
Events from `evmDecoder` + `.pipe()` have these fields:
- `d.block.number` — block number
- `d.rawEvent.transactionHash` — tx hash
- `d.timestamp` — Date object (use `.toISOString()`)
- `d.event.*` — decoded event parameters
- `d.contract` — contract address
This differs from the CLI-generated `enrichEvents` helper which flattens everything.

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

## Dashboard Design — Bloomberg Terminal Style

**Design philosophy:** Bloomberg Terminal, not GitHub Dark Mode. Every pixel earns its place. Pure black, amber accents, monospace type, zero decoration. Our dashboards should look like they belong on a trading desk.

### Use Apache ECharts, NOT TradingView Lightweight Charts
- TradingView Lightweight Charts v5 broke the API, has watermarks, and is designed for candlestick data not BI dashboards
- Use `https://cdn.jsdelivr.net/npm/echarts@5.5.1/dist/echarts.min.js`

### Pick the right chart for the data
- **Time-series counts** (liquidations per day, swaps per hour) → vertical bar chart, flat color (no gradient)
- **Rankings** (top assets, top users) → horizontal bar chart with monospace value labels
- **Proportional composition** (debt breakdown, asset share) → treemap
- **Continuous values over time** (TVL, price) → line chart with very subtle area fill (`opacity: 0.08`)
- **NEVER use pie or donut charts**

### Be smart about data
- Use **counts** not raw token amounts — different tokens have different decimals, summing raw amounts across tokens is meaningless without price feeds
- If you need volume, normalize to a single denomination (e.g., ETH or USD) — don't just divide by 1e18
- Prefer NO legend — use colored inline labels or panel titles instead. If a legend is necessary: 9px, top-right, horizontal
- Summary stats in the header: total row count, key metrics, **and the time period** (e.g., "2023-05-16 → 2024-03-14")
- Right-align all numeric values. Use `font-feature-settings: 'tnum'` for tabular figures

### Color palette — Bloomberg-inspired
```
Background:     #000000  (pure black — NOT dark gray)
Panels:         #0a0a0a  (barely lifted from black)
Borders:        #1a1a1a  (subtle 1px dividers)
Grid lines:     #1a1a1a  dashed (barely visible)

Primary text:   #cccccc  (muted white — never pure #fff for body)
Bright text:    #ffffff  (only for key highlighted values)
Dim text:       #666666  (axis labels, metadata, timestamps)
Blue accent:    #4A7AB5  (headers, active labels, key values)
Royal blue:     #2B4F7E  (primary chart color, bars)

Positive/up:    #4AF6C3  (bright teal-green)
Negative/down:  #FF433D  (bright warm red)
Info blue:      #0068FF  (selections, links)
```

**Chart series palette — dark royal blue, institutional (NOT saturated/rainbow):**
```javascript
// Royal blue dominant — shades of one hue, not a rainbow
var PALETTE = ['#1E3A5F','#2B4F7E','#1A3050','#3D6494','#4A7AB5','#2E5480','#5A8ABF','#1F4470','#3B6A9E','#274D73'];
```
- Primary series: royal blue `#2B4F7E`
- Header/accent text: steel blue `#4A7AB5`
- Negative/danger series: muted burgundy `#8B3A3A` (not bright red)
- Positive series: muted teal `#3D7A6B` (not bright green)
- Use blue shades for multi-category charts (rankings, breakdowns) — NOT a rainbow of different hues
- Reserve red/teal ONLY for semantic meaning (up/down, good/bad)

### Typography — dense and monospace
```css
body {
  font-family: 'Consolas', 'SF Mono', 'Source Code Pro', 'JetBrains Mono', monospace;
  font-size: 11px;
  line-height: 1.3;
}
```
- **Panel headers:** 10px, uppercase, `letter-spacing: 0.8px`, dim gray `#666`
- **Chart titles:** 10-11px, dim gray `#666`, uppercase — NOT large bold text
- **Axis labels:** 9px, dim `#666`
- **KPI/stat values:** 16-18px max (the ONLY large text), monospace, white `#fff`
- **KPI labels:** 9px, uppercase, dim `#666`
- **Everything else:** 10-11px — if it looks "comfortable to read," it's too big

### Layout — zero wasted space
```css
.panel {
  border: 1px solid #1a1a1a;
  border-radius: 0;           /* sharp corners — NOT rounded */
  padding: 8px;
  background: #0a0a0a;
}
```
- **Panels separated by 1px borders, NOT whitespace gaps** — use `gap: 0` or `gap: 1px` on grid
- **No shadows, no glows, no decorative borders**
- **Panel headers:** tiny uppercase amber text, content starts immediately below
- Footer: `Built with ai-pipes + SQD Pipes SDK | github.com/karelxfi | x.com/karelxfi`
- 1200x675 viewport (X card ratio)
- **Screenshots must be cropped tight** — resize browser to exactly 1200x675 before capturing
- Set `window.__DASHBOARD_READY__ = true` when data is loaded (for screenshot script)

### ECharts defaults — maximum data-ink ratio
```javascript
function terminalOpts(title) {
  return {
    backgroundColor: 'transparent',
    title: {
      text: title.toUpperCase(),
      textStyle: { color: '#666', fontSize: 10, fontWeight: 'normal', fontFamily: 'Consolas, SF Mono, monospace' },
      left: 8, top: 4
    },
    textStyle: { color: '#666', fontFamily: 'Consolas, SF Mono, Source Code Pro, monospace' },
    tooltip: {
      backgroundColor: '#1a1a1a',
      borderColor: '#333',
      textStyle: { color: '#ccc', fontSize: 10, fontFamily: 'Consolas, monospace' },
      padding: [4, 8]
    },
    grid: { left: 48, right: 8, top: 24, bottom: 24 },
    animation: false  // Bloomberg is instant — no transitions
  };
}
```

**Axes — minimal chrome:**
```javascript
xAxis: {
  axisLine: { show: false },
  axisTick: { show: false },
  axisLabel: { color: '#666', fontSize: 9, fontFamily: 'Consolas, monospace' },
  splitLine: { show: false }
},
yAxis: {
  axisLine: { show: false },
  axisTick: { show: false },
  axisLabel: { color: '#666', fontSize: 9, fontFamily: 'Consolas, monospace' },
  splitLine: { lineStyle: { color: '#1a1a1a', type: 'dashed' } }
}
```

**Series — flat, no gradients:**
```javascript
// Bar charts: flat color, no border-radius, tight bars
{ type: 'bar', itemStyle: { color: '#2B4F7E' }, barMaxWidth: 10 }

// Line charts: thin line, almost invisible area fill
{ type: 'line', lineStyle: { width: 1.5 }, showSymbol: false,
  areaStyle: { opacity: 0.08 } }
```

### What NOT to do (these make dashboards look childish)
- **NO gradient fills** on bars/areas — flat colors only
- **NO rounded corners** (`border-radius: 0` everywhere)
- **NO large fonts** — keep body text at 10-11px
- **NO generous padding/whitespace** — density is the point
- **NO drop shadows** on panels
- **NO animated chart transitions** (`animation: false`)
- **NO rainbow color palettes** — amber shades only, color = semantic meaning
- **NO saturated/bright accent colors** — mute everything, this is a terminal not a children's app
- **NO dark text on dark backgrounds** — all labels/text must be light (`#ccc`+) on dark chart elements. Readability under all conditions is non-negotiable
- **NO dark gray backgrounds** (`#0d1117`, `#161b22` look like GitHub/Discord clones)
- **NO thick borders** — 1px `#1a1a1a` max

### Token address resolution
Include a lookup map for common token addresses → symbols. For unknown addresses, show `0xABCD..EF12` format.

### bytes32 decoding (MakerDAO-style identifiers)
Some protocols use bytes32 for identifiers (e.g., MakerDAO's `ilk` for collateral types like "ETH-A"). Decode in dashboard JS:
```javascript
function decodeBytes32(hex) {
  var str = '';
  var h = hex.startsWith('0x') ? hex.slice(2) : hex;
  for (var i = 0; i < h.length; i += 2) {
    var code = parseInt(h.substr(i, 2), 16);
    if (code === 0) break;
    str += String.fromCharCode(code);
  }
  return str;
}
```

### MakerDAO decimal conventions
These appear in MakerDAO and forks: `wad` = 18 decimals, `ray` = 27 decimals, `rad` = 45 decimals. Divide accordingly.

## Improvement Tracking (MANDATORY after every indexer)

**You MUST do ALL of these after EVERY indexer. No exceptions.**

### 1. Update root improvement files
- **`CLI_IMPROVEMENTS.md`** — Append any new Pipes CLI issues (templates, init bugs, missing features). Add the source example reference. Don't duplicate existing entries — update with new source refs if same issue recurs.
- **`AGENT_SKILLS_IMPROVEMENTS.md`** — Append any new agent-skills issues (skill docs, workflows, missing patterns). Same dedup rules.

### 2. Patch agent-skills and create PR (MANDATORY)
After every indexer, review what you learned and determine if any agent-skills files need updating. This includes:
- **Portal query skills** (portal-query-evm-logs, portal-query-evm-traces, etc.) — wrong filter docs, missing warnings, verification workflows
- **pipes-new-indexer** — proxy patterns, ABI issues, scaffold gaps
- **pipes-deploy** — Docker, ClickHouse, CORS issues
- **pipes-troubleshooting** — new error patterns and fixes

If changes are needed, edit files under `.agents/skills/`, commit separately, and create a PR:
```bash
git add .agents/skills/
git commit -m "fix(skills): <what and why>"
SKILL_COMMIT=$(git rev-parse HEAD)
bash scripts/pr-skill-patches.sh "$SKILL_COMMIT" "<description>"
```

The PR script syncs with upstream before patching — it will only submit actual changes, not formatting diffs. If nothing genuinely new was learned, skip the PR but still review.

### 3. Check — did you skip anything?
Before committing the indexer, verify:
- [ ] `CLI_IMPROVEMENTS.md` — reviewed, updated if needed (even if "no new issues")
- [ ] `AGENT_SKILLS_IMPROVEMENTS.md` — reviewed, updated if needed
- [ ] Skills PR submitted if patches were made (or confirmed nothing new to patch)
- [ ] `contracts.json` created and pushed to contracts-registry

## Contracts Registry Integration

This repo feeds verified contract addresses back to [contracts-registry-llm](https://github.com/karelxfi/contracts-registry-llm) — a structured registry of smart contract addresses for AI agents.

### How it works

Every indexer generation verifies contract addresses (via Etherscan, Portal cross-reference, tx spot-checks). These verified addresses are valuable and should be contributed back.

### After each indexer — capture ALL contracts

**This is not optional.** When researching a protocol, capture EVERY deployed contract across EVERY chain — not just the one event we're indexing. Most protocols publish a full address list in their docs. Find it.

Where to find addresses:
- Official docs (e.g., Morpho's `/get-started/resources/addresses/` — click EVERY tab for each chain)
- GitHub repos (deployment scripts, address constants)
- Block explorer verified contracts
- Protocol dashboards / governance portals

1. Create a `contracts.json` in the example directory with ALL verified addresses across ALL chains:
```json
{
  "deployments": {
    "ethereum": {
      "contracts": {
        "morpho": { "address": "0xBBBBBbbBBb9cC5e90e3b3Af64bdAF62C37EEFFCb", "deploymentBlock": 18883124, "verified": true },
        "adaptiveCurveIrm": { "address": "0x870aC11D48B15DB9a138Cf899d20F13F79Ba00BC", "deploymentBlock": 18883153, "verified": true },
        "morphoVaults": { "address": "0x...", "deploymentBlock": null, "verified": true }
      },
      "source": "morpho-docs",
      "sourceUrl": "https://docs.morpho.org/get-started/resources/addresses/"
    },
    "base": {
      "contracts": {
        "morpho": { "address": "0xBBBBBbbBBb9cC5e90e3b3Af64bdAF62C37EEFFCb", "deploymentBlock": null, "verified": true }
      },
      "source": "morpho-docs",
      "sourceUrl": "https://docs.morpho.org/get-started/resources/addresses/"
    }
  }
}
```

2. Run the update script (it processes all chains):
```bash
./scripts/update-contracts-registry.sh <slug> <path-to-contracts.json>
```

3. The script merges addresses into the registry's protocol file and creates a branch for PR.

### What gets verified
- Contract addresses match on-chain data (Portal cross-reference)
- Deployment blocks are correct
- Contracts are verified on block explorers
- Source attribution is included

### When to skip
- Protocol is on an unsupported chain (Tron, Sui, Near, etc.)
- Protocol has no discoverable on-chain contracts (off-chain infrastructure)
- Registry already has complete, up-to-date addresses for this protocol

## Conventions

- Follow agent-skills CLAUDE.md (Rule 0: always read project docs before implementation)
- Record installed agent-skills commit SHA in META.json
- Pipes SDK version pinning is the primary reproducibility mechanism
- Each example is a self-contained commit
- Use `npm` as package manager (not bun — for wider compatibility)
- Use dedicated ClickHouse database per indexer (avoid sync table conflicts)
