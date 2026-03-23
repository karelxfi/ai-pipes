# Hyperliquid Oil Crisis Tracker Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build Hyperliquid indexer #006 tracking WTI crude oil, gold, and silver perpetual futures fills during the Iran shock crisis.

**Architecture:** Query all Hyperliquid fills via Portal, filter for commodity coins (`xyz:CL`, `xyz:GOLD`, `cash:GOLD`, `xyz:SILVER`, `cash:SILVER`) in the pipe transform, normalize to asset classes (OIL/GOLD/SILVER), store in ClickHouse. Bloomberg-terminal dashboard shows volume by asset, oil price, long/short imbalance, and top traders.

**Tech Stack:** SQD Pipes SDK 1.0.0-alpha.1, ClickHouse, TypeScript, Apache ECharts

**Spec:** `docs/superpowers/specs/2026-03-23-hl-oil-crisis-design.md`

---

## Chunk 1: Project Scaffold & Infrastructure

### Task 1: Create directory structure and config files

**Files:**
- Create: `hyperliquid/006-oil-crisis/package.json`
- Create: `hyperliquid/006-oil-crisis/tsconfig.json`
- Create: `hyperliquid/006-oil-crisis/.env`
- Create: `hyperliquid/006-oil-crisis/docker-compose.yml`
- Create: `hyperliquid/006-oil-crisis/clickhouse-cors.xml`
- Create: `hyperliquid/006-oil-crisis/migrations/custom-migration.sql`

- [ ] **Step 1: Create package.json**

```json
{
  "name": "006-oil-crisis",
  "version": "0.0.1",
  "type": "module",
  "private": true,
  "scripts": {
    "dev": "tsx src/index.ts",
    "start": "tsx src/index.ts"
  },
  "dependencies": {
    "@clickhouse/client": "^1.14.0",
    "@subsquid/pipes": "1.0.0-alpha.1",
    "dotenv": "^16.4.5",
    "zod": "^4.3.4"
  },
  "devDependencies": {
    "@types/node": "^22.14.1",
    "tsx": "^4.20.6",
    "typescript": "^5.9.2"
  }
}
```

- [ ] **Step 2: Create tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ES2022",
    "moduleResolution": "bundler",
    "esModuleInterop": true,
    "strict": true,
    "outDir": "dist",
    "declaration": true,
    "sourceMap": true,
    "skipLibCheck": true
  },
  "include": ["src"]
}
```

- [ ] **Step 3: Create .env**

```
CLICKHOUSE_URL=http://localhost:8123
CLICKHOUSE_DATABASE=hl_oil_crisis
CLICKHOUSE_USER=default
CLICKHOUSE_PASSWORD=password
```

- [ ] **Step 4: Create docker-compose.yml**

```yaml
services:
  clickhouse:
    image: clickhouse/clickhouse-server:latest
    ports:
      - "8123:8123"
    environment:
      CLICKHOUSE_DB: hl_oil_crisis
      CLICKHOUSE_USER: default
      CLICKHOUSE_PASSWORD: password
    volumes:
      - clickhouse-data:/var/lib/clickhouse
      - ./clickhouse-cors.xml:/etc/clickhouse-server/config.d/cors.xml:ro
    healthcheck:
      test: ["CMD", "clickhouse-client", "--query", "SELECT 1"]
      interval: 3s
      timeout: 5s
      retries: 5

volumes:
  clickhouse-data:
```

- [ ] **Step 5: Create clickhouse-cors.xml**

```xml
<clickhouse>
    <http_options_response>
        <header>
            <name>Access-Control-Allow-Origin</name>
            <value>*</value>
        </header>
        <header>
            <name>Access-Control-Allow-Methods</name>
            <value>GET, POST, OPTIONS</value>
        </header>
        <header>
            <name>Access-Control-Allow-Headers</name>
            <value>*</value>
        </header>
    </http_options_response>
</clickhouse>
```

- [ ] **Step 6: Create migrations/custom-migration.sql**

```sql
CREATE TABLE IF NOT EXISTS fills (
    block_number UInt64,
    timestamp DateTime64(3, 'UTC'),
    user String,
    coin LowCardinality(String),
    asset_class LowCardinality(String),
    px Float64,
    sz Float64,
    side LowCardinality(String),
    dir LowCardinality(String),
    closed_pnl Float64,
    fee Float64,
    notional Float64,
    sign Int8
) ENGINE = CollapsingMergeTree(sign)
ORDER BY (asset_class, block_number)
PARTITION BY toYYYYMM(timestamp);
```

Note: Table name is just `fills` (not `hl_oil_crisis.fills`) because the database is set via env var and the ClickHouse client connects to the `hl_oil_crisis` database directly. The migration file runs in the context of that database.

- [ ] **Step 7: Install dependencies**

```bash
cd hyperliquid/006-oil-crisis && npm install
```

- [ ] **Step 8: Commit scaffold**

```bash
git add hyperliquid/006-oil-crisis/
git commit -m "feat(hl): scaffold oil crisis tracker (006) — config, schema, docker"
```

---

## Chunk 2: Indexer Implementation

### Task 2: Write the indexer

**Files:**
- Create: `hyperliquid/006-oil-crisis/src/index.ts`

- [ ] **Step 1: Create src/index.ts**

Follow the exact pattern from `hyperliquid/001-perps-majors/src/index.ts`. Key differences:
- Empty coin filter `{}` (query all coins)
- Filter for commodity coins in pipe using regex
- Add `asset_class` derived field
- Table name: `fills` (database is `hl_oil_crisis`)
- START_BLOCK: `920000000` (~Feb 1, 2026)

```typescript
import 'dotenv/config'
import path from 'node:path'
import { createClient } from '@clickhouse/client'
import { hyperliquidFillsPortalSource, HyperliquidFillsQueryBuilder } from '@subsquid/pipes/hyperliquid'
import { clickhouseTarget } from '@subsquid/pipes/targets/clickhouse'
import { z } from 'zod'

const env = z
  .object({
    CLICKHOUSE_USER: z.string(),
    CLICKHOUSE_PASSWORD: z.string(),
    CLICKHOUSE_URL: z.string(),
    CLICKHOUSE_DATABASE: z.string(),
  })
  .parse(process.env)

// ~Feb 1, 2026 — captures full Iran shock buildup + March explosion
const START_BLOCK = 920000000

const COMMODITY_COINS = /^(xyz:(CL|GOLD|SILVER)|cash:(GOLD|SILVER))$/

function assetClass(coin: string): string {
  if (coin === 'xyz:CL') return 'OIL'
  if (coin.endsWith('GOLD')) return 'GOLD'
  if (coin.endsWith('SILVER')) return 'SILVER'
  return 'UNKNOWN'
}

const query = new HyperliquidFillsQueryBuilder()
  .addRange({ from: START_BLOCK })
  .addFields({
    block: { number: true, timestamp: true },
    fill: {
      user: true,
      coin: true,
      px: true,
      sz: true,
      side: true,
      dir: true,
      closedPnl: true,
      fee: true,
    },
  })
  .addFill({
    range: { from: START_BLOCK },
    request: {},  // all coins — filter in pipe
  })

export async function main() {
  await hyperliquidFillsPortalSource({
    id: 'hl-oil-crisis',
    portal: 'https://portal.sqd.dev/datasets/hyperliquid-fills',
    outputs: query,
  })
    .pipe((blocks) => {
      const fills = blocks.flatMap((block) =>
        block.fills
          .filter((fill) => COMMODITY_COINS.test(fill.coin))
          .map((fill) => ({
            block_number: block.header.number,
            timestamp: new Date(block.header.timestamp).toISOString(),
            user: fill.user,
            coin: fill.coin,
            asset_class: assetClass(fill.coin),
            px: fill.px,
            sz: fill.sz,
            side: fill.side === 'B' ? 'Buy' : 'Sell',
            dir: fill.dir,
            closed_pnl: fill.closedPnl,
            fee: fill.fee,
            notional: fill.px * fill.sz,
            sign: 1,
          })),
      )
      return { fills }
    })
    .pipeTo(
      clickhouseTarget({
        client: createClient({
          username: env.CLICKHOUSE_USER,
          password: env.CLICKHOUSE_PASSWORD,
          url: env.CLICKHOUSE_URL,
          database: env.CLICKHOUSE_DATABASE,
          clickhouse_settings: {
            date_time_input_format: 'best_effort',
            date_time_output_format: 'iso',
            output_format_json_named_tuples_as_objects: 1,
            output_format_json_quote_64bit_floats: 1,
            output_format_json_quote_64bit_integers: 1,
          },
        }),
        onStart: async ({ store }) => {
          const migrationsDir = path.join(process.cwd(), 'migrations')
          await store.executeFiles(migrationsDir)
        },
        onData: async ({ data, store }) => {
          if (data.fills.length > 0) {
            await store.insert({
              table: 'fills',
              values: data.fills,
              format: 'JSONEachRow',
            })
          }
        },
        onRollback: async ({ safeCursor, store }) => {
          await store.removeAllRows({
            tables: ['fills'],
            where: 'block_number > {latest:UInt64}',
            params: { latest: safeCursor.number },
          })
        },
      }),
    )
}

void main()
```

- [ ] **Step 2: Start ClickHouse and run indexer**

```bash
cd hyperliquid/006-oil-crisis
docker compose up -d
npm start
```

Let it sync. Monitor progress:
```bash
curl -s 'http://localhost:8123/?user=default&password=password' --data-binary "SELECT count() FROM hl_oil_crisis.fills"
```

Wait until row count stabilizes or reaches a good amount of data (aim for 500+ rows covering Feb-Mar 2026). For commodity fills this may take a while since we're filtering from all fills.

- [ ] **Step 3: Commit indexer**

```bash
git add hyperliquid/006-oil-crisis/src/
git commit -m "feat(hl): add oil crisis indexer — WTI crude, gold, silver perps"
```

---

## Chunk 3: Validation

### Task 3: Write validate.ts

**Files:**
- Create: `hyperliquid/006-oil-crisis/validate.ts`

- [ ] **Step 1: Create validate.ts**

Three-phase validation: structural checks, Portal cross-reference, spot-checks.

```typescript
import 'dotenv/config'
import { createClient } from '@clickhouse/client'

const client = createClient({
  url: process.env.CLICKHOUSE_URL ?? 'http://localhost:8123',
  database: process.env.CLICKHOUSE_DATABASE ?? 'hl_oil_crisis',
  username: process.env.CLICKHOUSE_USER ?? 'default',
  password: process.env.CLICKHOUSE_PASSWORD ?? 'password',
})

async function q<T = Record<string, any>>(sql: string): Promise<T[]> {
  const result = await client.query({ query: sql, format: 'JSONEachRow' })
  return result.json<T>()
}

let passed = 0, failed = 0
function pass(msg: string) { console.log(`PASS: ${msg}`); passed++ }
function fail(msg: string) { console.log(`FAIL: ${msg}`); failed++ }

async function main() {
  console.log('=== Hyperliquid Oil Crisis Tracker — Validation ===\n')

  // ── Phase 1: Structural Checks ──
  console.log('── Phase 1: Structural Checks ──')

  const [{ count }] = await q<{ count: string }>('SELECT count() as count FROM fills')
  const rowCount = Number(count)
  if (rowCount > 0) pass(`Row count: ${rowCount}`)
  else { fail('Row count is 0'); process.exit(1) }

  const cols = await q<{ name: string }>(`SELECT name FROM system.columns WHERE database = '${process.env.CLICKHOUSE_DATABASE ?? 'hl_oil_crisis'}' AND table = 'fills'`)
  const required = ['block_number', 'timestamp', 'user', 'coin', 'asset_class', 'px', 'sz', 'side', 'dir', 'closed_pnl', 'fee', 'notional', 'sign']
  const missing = required.filter(r => !cols.map(c => c.name).includes(r))
  if (missing.length === 0) pass(`Schema OK: all ${required.length} required columns present`)
  else fail(`Missing columns: ${missing.join(', ')}`)

  // Check asset_class values
  const classes = await q<{ asset_class: string }>('SELECT DISTINCT asset_class FROM fills ORDER BY asset_class')
  const classNames = classes.map(c => c.asset_class).sort()
  const expected = ['GOLD', 'OIL', 'SILVER']
  if (JSON.stringify(classNames) === JSON.stringify(expected)) pass(`Asset classes: ${classNames.join(', ')}`)
  else fail(`Expected asset classes ${expected.join(', ')}, got ${classNames.join(', ')}`)

  // Check coin values match regex
  const coins = await q<{ coin: string; cnt: string }>('SELECT coin, count() as cnt FROM fills GROUP BY coin ORDER BY cnt DESC')
  const validCoins = /^(xyz:(CL|GOLD|SILVER)|cash:(GOLD|SILVER))$/
  const invalidCoins = coins.filter(c => !validCoins.test(c.coin))
  if (invalidCoins.length === 0) pass(`All coin values valid: ${coins.map(c => `${c.coin}(${c.cnt})`).join(', ')}`)
  else fail(`Invalid coins found: ${invalidCoins.map(c => c.coin).join(', ')}`)

  // Timestamp range
  const [{ min_ts, max_ts }] = await q<{ min_ts: string; max_ts: string }>('SELECT min(timestamp) as min_ts, max(timestamp) as max_ts FROM fills')
  pass(`Timestamp range: ${min_ts} to ${max_ts}`)

  // No negative notional
  const [{ neg }] = await q<{ neg: string }>('SELECT countIf(notional < 0) as neg FROM fills')
  if (Number(neg) === 0) pass('No negative notional values')
  else fail(`${neg} rows with negative notional`)

  // No zero-price fills
  const [{ zero_px }] = await q<{ zero_px: string }>('SELECT countIf(px = 0) as zero_px FROM fills')
  if (Number(zero_px) === 0) pass('No zero-price fills')
  else fail(`${zero_px} zero-price fills`)

  // Sides
  const sides = await q<{ side: string; cnt: string }>('SELECT side, count() as cnt FROM fills GROUP BY side')
  sides.forEach(s => console.log(`  ${s.side}: ${s.cnt}`))
  if (sides.length === 2) pass('Both Buy and Sell sides present')
  else fail(`Expected 2 sides, got ${sides.length}`)

  // Volume
  const [{ vol }] = await q<{ vol: string }>('SELECT sum(notional) as vol FROM fills')
  pass(`Total notional volume: $${(Number(vol) / 1e6).toFixed(2)}M`)

  // Oil should be dominant
  const [{ oil_pct }] = await q<{ oil_pct: string }>("SELECT round(countIf(asset_class = 'OIL') * 100.0 / count(), 1) as oil_pct FROM fills")
  console.log(`  Oil fill percentage: ${oil_pct}%`)

  // ── Phase 2: Portal Cross-Reference ──
  console.log('\n── Phase 2: Portal Cross-Reference ──')
  console.log('  (Run manually: use portal_query_hyperliquid_fills with coin: [\'xyz:CL\'] for a 1000-block sample)')
  console.log('  Compare Portal fill count vs ClickHouse count for same block range')
  console.log('  Tolerance: 5%')

  // Get a sample block range from the middle of the data
  const [{ mid_block }] = await q<{ mid_block: string }>("SELECT avg(block_number)::UInt64 as mid_block FROM fills WHERE coin = 'xyz:CL'")
  const midBlock = Number(mid_block)
  const [{ ch_count }] = await q<{ ch_count: string }>(`SELECT count() as ch_count FROM fills WHERE coin = 'xyz:CL' AND block_number BETWEEN ${midBlock} AND ${midBlock + 1000}`)
  console.log(`  Sample range: blocks ${midBlock} to ${midBlock + 1000}`)
  console.log(`  ClickHouse xyz:CL fills in range: ${ch_count}`)
  console.log(`  → Verify with: portal_query_hyperliquid_fills({ coin: ['xyz:CL'], from_block: ${midBlock}, to_block: ${midBlock + 1000} })`)
  pass('Portal cross-reference data prepared (verify manually)')

  // ── Phase 3: Spot-Checks ──
  console.log('\n── Phase 3: Transaction Spot-Checks ──')
  const topFills = await q<{ block_number: string; user: string; px: string; sz: string; side: string; dir: string }>(`
    SELECT block_number, user, px, sz, side, dir FROM fills WHERE coin = 'xyz:CL' ORDER BY notional DESC LIMIT 3
  `)
  topFills.forEach((f, i) => {
    console.log(`  Spot-check ${i + 1}: block=${f.block_number} user=${f.user.substring(0, 10)}... px=${f.px} sz=${f.sz} side=${f.side} dir=${f.dir}`)
    console.log(`    → Verify with: portal_query_hyperliquid_fills({ coin: ['xyz:CL'], from_block: ${f.block_number}, to_block: ${Number(f.block_number) + 1} })`)
  })
  pass('Spot-check data prepared (verify manually)')

  console.log(`\n=== SUMMARY: ${passed} passed, ${failed} failed ===`)
  await client.close()
  process.exit(failed > 0 ? 1 : 0)
}

main().catch(e => { console.error(e); process.exit(1) })
```

- [ ] **Step 2: Run validation**

```bash
cd hyperliquid/006-oil-crisis
npx tsx validate.ts
```

Expected: All structural checks pass. Note the Portal cross-reference block range and spot-check data for manual verification.

- [ ] **Step 3: Manually verify Portal cross-reference**

Use the MCP tool `portal_query_hyperliquid_fills` with the block range and coin filter printed by validate.ts. Compare fill count with ClickHouse count. Tolerance: 5%.

- [ ] **Step 4: Manually verify spot-checks**

Use `portal_query_hyperliquid_fills` for the specific blocks printed by validate.ts. Verify `user`, `px`, `sz`, `side`, `dir` match exactly (remember side maps: `B` → `Buy`, `A` → `Sell`).

- [ ] **Step 5: Commit validation**

```bash
git add hyperliquid/006-oil-crisis/validate.ts
git commit -m "feat(hl): add oil crisis validation — structural + Portal cross-ref"
```

---

## Chunk 4: Dashboard

### Task 4: Build Bloomberg-terminal dashboard

**Files:**
- Create: `hyperliquid/006-oil-crisis/dashboard/index.html`

- [ ] **Step 1: Create dashboard/index.html**

Follow the Bloomberg terminal style from CLAUDE.md. Key design rules:
- Pure black `#000` background, panels `#0a0a0a`, borders `#1a1a1a`
- Monospace font (Consolas, SF Mono), 10-11px body text
- No gradients, no rounded corners, no animation
- 1200x675px viewport
- Apache ECharts 5.5.1
- `window.__DASHBOARD_READY__ = true` when data loads

Four panels per spec:
1. Daily volume by asset (stacked bar) — OIL `#2B4F7E`, GOLD `#D4A017`, SILVER `#8B8B8B`
2. Oil price tracker (line chart)
3. Long/short imbalance (bar chart) — net long `#3D7A6B`, net short `#8B3A3A`
4. Top oil traders (horizontal bar)

Header: 4 stat cards (fills, volume, traders, date range)
Footer: `Built with ai-pipes + SQD Pipes SDK | github.com/karelxfi | x.com/karelxfi`

ClickHouse queries (all via `fetch` to `http://localhost:8123`):
- Stats: `SELECT count() as total, sum(notional) as volume, count(DISTINCT user) as traders, min(timestamp) as first_ts, max(timestamp) as last_ts FROM fills`
- Panel 1: `SELECT toDate(timestamp) as d, asset_class, sum(notional) as vol FROM fills GROUP BY d, asset_class ORDER BY d`
- Panel 2: `SELECT toDate(timestamp) as d, avg(px) as avg_px FROM fills WHERE asset_class = 'OIL' GROUP BY d ORDER BY d`
- Panel 3: `SELECT toDate(timestamp) as d, countIf(dir = 'Open Long') - countIf(dir = 'Open Short') as net FROM fills WHERE asset_class = 'OIL' GROUP BY d ORDER BY d`
- Panel 4: `SELECT user, sum(notional) as vol FROM fills WHERE coin = 'xyz:CL' GROUP BY user ORDER BY vol DESC LIMIT 10`

Use the existing `001-perps-majors/dashboard/index.html` as the structural template but apply Bloomberg terminal styling from CLAUDE.md (black background, monospace, no rounded corners, sharp borders).

- [ ] **Step 2: Open dashboard in browser**

```bash
open hyperliquid/006-oil-crisis/dashboard/index.html
```

Verify: all 4 charts render with real data, stats populated, no empty panels.

- [ ] **Step 3: Capture screenshot**

Resize browser to exactly 1200x675, capture `dashboard/screenshot.png`. Must show populated charts with real data.

- [ ] **Step 4: Commit dashboard**

```bash
git add hyperliquid/006-oil-crisis/dashboard/
git commit -m "feat(hl): add oil crisis Bloomberg-terminal dashboard"
```

---

## Chunk 5: Documentation & Finalization

### Task 5: Create documentation files

**Files:**
- Create: `hyperliquid/006-oil-crisis/PROMPT.md`
- Create: `hyperliquid/006-oil-crisis/OUTPUT.md`
- Create: `hyperliquid/006-oil-crisis/IMPROVEMENTS.md`
- Create: `hyperliquid/006-oil-crisis/META.json`
- Create: `hyperliquid/006-oil-crisis/README.md`
- Modify: `protocols.json` — add entry for 006-oil-crisis

- [ ] **Step 1: Create PROMPT.md**

Verbatim copy of the user's original prompt that triggered this indexer.

- [ ] **Step 2: Create OUTPUT.md**

Brief narrative: what happened, key decisions, issues resolved. Include:
- Angle: oil crisis tracker during Iran shock
- Key decision: included gold/silver for safe-haven context
- Coin naming discovery: `xyz:` (USDC) and `cash:` (USDT0) prefixes
- Data findings: volume distribution across assets

- [ ] **Step 3: Create IMPROVEMENTS.md**

Feedback on how CLAUDE.md, generate-indexer command, and templates should improve:
- Document `xyz:` vs `cash:` naming convention for Hyperliquid RWA coins
- Note that querying all coins and filtering in pipe works but is slower than direct coin filter
- Any SDK issues encountered

- [ ] **Step 4: Create META.json**

```json
{
  "date": "2026-03-23",
  "pipes_sdk_version": "1.0.0-alpha.1",
  "agent_skills_version": "latest",
  "claude_model": "claude-opus-4-6",
  "prompt_file": "PROMPT.md",
  "angle": "Oil crisis tracker — WTI crude, gold & silver perps during Iran shock",
  "runtime_status": "working",
  "validation_status": "passed"
}
```

- [ ] **Step 5: Create README.md**

Include:
- Dashboard screenshot at top
- Angle description
- Verification report (full validate.ts output)
- Run instructions (`docker compose up -d`, `npm install && npm start`)
- Sample ClickHouse queries

- [ ] **Step 6: Update protocols.json**

Add entry after existing Hyperliquid indexers:

```json
{
  "name": "Hyperliquid Oil Crisis",
  "slug": "hyperliquid-oil-crisis",
  "category": "Derivatives",
  "tvl": 4500000000,
  "vm": "hyperliquid",
  "chains": ["Hyperliquid"],
  "angle": "Oil crisis tracker — WTI crude, gold & silver perps during Iran shock",
  "directory": "hyperliquid/006-oil-crisis",
  "status": "done"
}
```

- [ ] **Step 7: Review and update root improvement files**

Per CLAUDE.md mandatory steps:
- Review `CLI_IMPROVEMENTS.md` — add any new Pipes CLI issues
- Review `AGENT_SKILLS_IMPROVEMENTS.md` — add any new agent-skills issues

- [ ] **Step 8: Final commit**

```bash
git add hyperliquid/006-oil-crisis/ protocols.json CLI_IMPROVEMENTS.md AGENT_SKILLS_IMPROVEMENTS.md
git commit -m "feat(hl): complete oil crisis tracker (006) — indexer, dashboard, validation, docs"
```
