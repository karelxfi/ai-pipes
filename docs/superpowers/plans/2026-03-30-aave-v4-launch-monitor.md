# Aave v4 Launch Monitor Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build a real-time launch monitor dashboard for Aave v4's Hub & Spoke architecture on Ethereum mainnet, tracking supply/borrow/liquidation flows across all 3 Hubs and 11 Spokes from deployment block 24720891.

**Architecture:** Single evmDecoder indexer targeting Hub implementation events (Add, Remove, Draw, Restore) and Spoke implementation events (Supply, Withdraw, Borrow, Repay, LiquidationCall). Data lands in 3 ClickHouse tables: `hub_flows`, `spoke_events`, `liquidations`. A Bloomberg-terminal-style dashboard queries ClickHouse directly.

**Tech Stack:** Pipes SDK 1.0, @subsquid/evm-abi + evm-codec, ClickHouse, Apache ECharts, TypeScript/tsx

---

## File Structure

```
evm/055-aave-v4/
  .env
  package.json
  tsconfig.json
  docker-compose.yml
  clickhouse-cors.xml
  migrations/
    001-hub-flows.sql
    002-spoke-events.sql
    003-liquidations.sql
  src/
    index.ts              # Main indexer entry point
    contracts/
      hub.ts              # Hub implementation ABI (events only)
      spoke.ts            # Spoke implementation ABI (events only)
    utils/
      index.ts            # enrichEvents, serialization helpers (copy from 001)
      addresses.ts        # Contract address constants + spoke name mapping
  validate.ts
  dashboard/
    index.html
  PROMPT.md
  OUTPUT.md
  IMPROVEMENTS.md
  META.json
  contracts.json
  README.md
```

---

### Task 1: Scaffold project and dependencies

**Files:**
- Create: `evm/055-aave-v4/package.json`
- Create: `evm/055-aave-v4/tsconfig.json`
- Create: `evm/055-aave-v4/.env`
- Create: `evm/055-aave-v4/docker-compose.yml`
- Create: `evm/055-aave-v4/clickhouse-cors.xml`

- [ ] **Step 1: Create package.json**

```json
{
  "name": "055-aave-v4",
  "version": "0.0.1",
  "type": "module",
  "private": true,
  "scripts": {
    "dev": "tsx src/index.ts",
    "start": "tsx src/index.ts",
    "build": "tsup src/index.ts --format esm --dts",
    "lint": "biome check . --write"
  },
  "dependencies": {
    "@clickhouse/client": "^1.14.0",
    "@subsquid/evm-abi": "0.3.1",
    "@subsquid/evm-codec": "0.3.0",
    "@subsquid/pipes": "1.0.0-alpha.1",
    "better-sqlite3": "^12.4.5",
    "dotenv": "^16.4.5",
    "zod": "^4.3.4"
  },
  "devDependencies": {
    "@biomejs/biome": "^2.3.4",
    "@types/node": "^22.14.1",
    "tsup": "^8.5.0",
    "tsx": "^4.20.6",
    "typescript": "^5.9.2"
  }
}
```

- [ ] **Step 2: Create tsconfig.json**

Copy from `evm/001-aave-v3/tsconfig.json`.

- [ ] **Step 3: Create .env**

```
CLICKHOUSE_URL=http://localhost:8123
CLICKHOUSE_DATABASE=aave_v4
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
      CLICKHOUSE_DB: aave_v4
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
        <header><name>Access-Control-Allow-Origin</name><value>*</value></header>
        <header><name>Access-Control-Allow-Methods</name><value>GET, POST, OPTIONS</value></header>
        <header><name>Access-Control-Allow-Headers</name><value>*</value></header>
    </http_options_response>
</clickhouse>
```

- [ ] **Step 6: Run npm install**

```bash
cd evm/055-aave-v4 && npm install
```

- [ ] **Step 7: Commit scaffold**

```bash
git add evm/055-aave-v4/
git commit -m "feat(evm): scaffold Aave v4 launch monitor (055)"
```

---

### Task 2: Generate contract ABIs from implementation addresses

**Files:**
- Create: `evm/055-aave-v4/src/contracts/hub.ts`
- Create: `evm/055-aave-v4/src/contracts/spoke.ts`

Since all Aave v4 contracts are TransparentUpgradeableProxy, we need ABIs from the implementation contracts:
- Hub implementation: `0xfe89fd96f270ac3c0f11921af0390dbb1340f704`
- Spoke implementation: `0xABd0E26Fe17bde4f1f1187ed8aa80c274e03D8b5`

- [ ] **Step 1: Generate Hub ABI**

```bash
cd evm/055-aave-v4
npx @subsquid/evm-typegen@latest src/contracts 0xfe89fd96f270ac3c0f11921af0390dbb1340f704 --chain-id 1
mv src/contracts/0xfe89fd96f270ac3c0f11921af0390dbb1340f704.ts src/contracts/hub.ts
```

Verify the generated file has the expected Hub events (Add, Remove, Draw, Restore, AddAsset, AddSpoke):
```bash
grep -E "Add:|Remove:|Draw:|Restore:" src/contracts/hub.ts
```

If the ABI only has `Upgraded` (proxy ABI problem), try fetching the ABI from the Aave v4 GitHub repo interfaces (IHub.sol, IHubBase.sol) and manually define the events. See fallback in Step 2.

- [ ] **Step 2: Generate Spoke ABI**

```bash
npx @subsquid/evm-typegen@latest src/contracts 0xABd0E26Fe17bde4f1f1187ed8aa80c274e03D8b5 --chain-id 1
mv src/contracts/0xABd0E26Fe17bde4f1f1187ed8aa80c274e03D8b5.ts src/contracts/spoke.ts
```

Verify expected Spoke events (Supply, Withdraw, Borrow, Repay, LiquidationCall):
```bash
grep -E "Supply:|Withdraw:|Borrow:|Repay:|LiquidationCall:" src/contracts/spoke.ts
```

**Fallback — manual event definitions:** If evm-typegen fails (unverified contracts), manually define events using the signatures from the Aave v4 interfaces. The key events and their signatures:

Hub events (`hub.ts`):
```typescript
import * as p from '@subsquid/evm-codec'
import { event, indexed } from '@subsquid/evm-abi'

// Add(uint256 indexed assetId, address indexed spoke, uint256 shares, uint256 amount)
// Remove(uint256 indexed assetId, address indexed spoke, uint256 shares, uint256 amount)
// Draw(uint256 indexed assetId, address indexed spoke, uint256 drawnShares, uint256 drawnAmount)
// Restore(uint256 indexed assetId, address indexed spoke, uint256 drawnShares, ..., uint256 drawnAmount, uint256 premiumAmount)

export const events = {
  Add: event("0x<topic0>", "Add(uint256,address,uint256,uint256)", {
    assetId: indexed(p.uint256), spoke: indexed(p.address), shares: p.uint256, amount: p.uint256
  }),
  // ... etc. Compute topic0 from keccak256 of signature
}
```

You'll need to compute topic0 hashes. Use: `cast sig-event "Add(uint256,address,uint256,uint256)"` or look them up from on-chain logs via Portal.

- [ ] **Step 3: Verify both files export expected events**

```bash
grep "export const events" src/contracts/hub.ts src/contracts/spoke.ts
```

Both should export an `events` object. Confirm the key event names exist.

- [ ] **Step 4: Commit ABIs**

```bash
git add src/contracts/
git commit -m "feat(evm/055): add Aave v4 Hub and Spoke ABIs from implementation contracts"
```

---

### Task 3: Create address constants and utility helpers

**Files:**
- Create: `evm/055-aave-v4/src/utils/addresses.ts`
- Create: `evm/055-aave-v4/src/utils/index.ts`

- [ ] **Step 1: Create addresses.ts**

```typescript
// All Aave v4 contract addresses on Ethereum mainnet
// Source: https://aave.com/docs/resources/addresses

export const HUBS = {
  CORE: '0xCca852Bc40e560adC3b1Cc58CA5b55638ce826c9',
  PLUS: '0x06002e9c4412CB7814a791eA3666D905871E536A',
  PRIME: '0x9438827DCA022D0F354a8a8c332dA1e5Eb9F9F931',
} as const

export const SPOKES = {
  MAIN: '0x94e7A5dCbE816e498b89aB752661904E2F56c485',
  BLUECHIP: '0x973a023A77420ba610f06b3858aD991Df6d85A08',
  ETHENA_CORRELATED: '0x58131E79531caB1d52301228d1f7b842F26B9649',
  ETHENA_ECOSYSTEM: '0xba1B3D55D249692b669A164024A838309B7508AF',
  ETHERFI: '0xbF10BDfE177dE0336aFD7fcCF80A904E15386219',
  FOREX: '0xD8B93635b8C6d0fF98CbE90b5988E3F2d1Cd9da1',
  GOLD: '0x65407b940966954b23dfA3caA5C0702bB42984DC',
  KELP: '0x3131FE68C4722e726fe6B2819ED68e514395B9a4',
  LIDO: '0xe1900480ac69f0B296841Cd01cC37546d92F35Cd',
  LOMBARD_BTC: '0x7EC68b5695e803e98a21a9A05d744F28b0a7753D',
  TREASURY: '0xB9B0b8616f6Bf6841972a52058132BE08d723155',
} as const

export const ALL_HUB_ADDRESSES = Object.values(HUBS).map(a => a.toLowerCase())
export const ALL_SPOKE_ADDRESSES = Object.values(SPOKES).map(a => a.toLowerCase())

// Reverse lookup: address -> human-readable name
export const SPOKE_NAMES: Record<string, string> = Object.fromEntries(
  Object.entries(SPOKES).map(([name, addr]) => [addr.toLowerCase(), name.replace(/_/g, ' ')])
)
export const HUB_NAMES: Record<string, string> = Object.fromEntries(
  Object.entries(HUBS).map(([name, addr]) => [addr.toLowerCase(), name])
)

// Deployment block
export const DEPLOYMENT_BLOCK = 24720891
```

- [ ] **Step 2: Create utils/index.ts**

Copy `enrichEvents`, `serializeJsonWithBigInt`, `toSnakeKeys`, `toSnakeKeysArray` from `evm/001-aave-v3/src/utils/index.ts`. These are reusable helpers.

- [ ] **Step 3: Commit**

```bash
git add src/utils/
git commit -m "feat(evm/055): add address constants and utility helpers"
```

---

### Task 4: Create ClickHouse migrations

**Files:**
- Create: `evm/055-aave-v4/migrations/001-hub-flows.sql`
- Create: `evm/055-aave-v4/migrations/002-spoke-events.sql`
- Create: `evm/055-aave-v4/migrations/003-liquidations.sql`

- [ ] **Step 1: Create hub_flows table**

```sql
CREATE TABLE IF NOT EXISTS hub_flows (
  event_type LowCardinality(String),
  hub LowCardinality(String),
  asset_id UInt256,
  spoke LowCardinality(String),
  shares UInt256,
  amount UInt256,
  block_number UInt32,
  tx_hash String,
  log_index UInt16,
  timestamp DateTime CODEC(DoubleDelta, ZSTD),
  sign Int8 DEFAULT toInt8(1)
)
ENGINE = CollapsingMergeTree(sign) PARTITION BY toYYYYMM(timestamp)
ORDER BY (block_number, tx_hash, log_index);
```

- [ ] **Step 2: Create spoke_events table**

```sql
CREATE TABLE IF NOT EXISTS spoke_events (
  event_type LowCardinality(String),
  spoke LowCardinality(String),
  reserve_id UInt256,
  caller String,
  user String,
  shares UInt256,
  amount UInt256,
  block_number UInt32,
  tx_hash String,
  log_index UInt16,
  timestamp DateTime CODEC(DoubleDelta, ZSTD),
  sign Int8 DEFAULT toInt8(1)
)
ENGINE = CollapsingMergeTree(sign) PARTITION BY toYYYYMM(timestamp)
ORDER BY (block_number, tx_hash, log_index);
```

- [ ] **Step 3: Create liquidations table**

```sql
CREATE TABLE IF NOT EXISTS liquidations (
  spoke LowCardinality(String),
  collateral_reserve_id UInt256,
  debt_reserve_id UInt256,
  user String,
  liquidator String,
  receive_shares Bool,
  debt_amount_restored UInt256,
  drawn_shares_liquidated UInt256,
  collateral_amount_removed UInt256,
  collateral_shares_liquidated UInt256,
  collateral_shares_to_liquidator UInt256,
  block_number UInt32,
  tx_hash String,
  log_index UInt16,
  timestamp DateTime CODEC(DoubleDelta, ZSTD),
  sign Int8 DEFAULT toInt8(1)
)
ENGINE = CollapsingMergeTree(sign) PARTITION BY toYYYYMM(timestamp)
ORDER BY (block_number, tx_hash, log_index);
```

- [ ] **Step 4: Commit**

```bash
git add migrations/
git commit -m "feat(evm/055): add ClickHouse migrations for hub_flows, spoke_events, liquidations"
```

---

### Task 5: Write the indexer

**Files:**
- Create: `evm/055-aave-v4/src/index.ts`

This is the core indexer. It uses two `evmDecoder` instances — one for Hub contracts, one for Spoke contracts — and pipes both into ClickHouse.

- [ ] **Step 1: Write src/index.ts**

```typescript
import 'dotenv/config'
import path from 'node:path'
import { createClient } from '@clickhouse/client'
import { evmDecoder, evmPortalStream } from '@subsquid/pipes/evm'
import { clickhouseTarget } from '@subsquid/pipes/targets/clickhouse'
import { z } from 'zod'
import { events as hubEvents } from './contracts/hub.js'
import { events as spokeEvents } from './contracts/spoke.js'
import { enrichEvents, serializeJsonWithBigInt, toSnakeKeysArray } from './utils/index.js'
import { ALL_HUB_ADDRESSES, ALL_SPOKE_ADDRESSES, DEPLOYMENT_BLOCK } from './utils/addresses.js'

const env = z.object({
  CLICKHOUSE_USER: z.string(),
  CLICKHOUSE_PASSWORD: z.string(),
  CLICKHOUSE_URL: z.string(),
  CLICKHOUSE_DATABASE: z.string(),
}).parse(process.env)

// Hub decoder: Add, Remove, Draw, Restore
const hubDecoder = evmDecoder({
  range: { from: String(DEPLOYMENT_BLOCK) },
  contracts: ALL_HUB_ADDRESSES,
  events: {
    Add: hubEvents.Add,
    Remove: hubEvents.Remove,
    Draw: hubEvents.Draw,
    Restore: hubEvents.Restore,
  },
}).pipe(enrichEvents)

// Spoke decoder: Supply, Withdraw, Borrow, Repay, LiquidationCall
const spokeDecoder = evmDecoder({
  range: { from: String(DEPLOYMENT_BLOCK) },
  contracts: ALL_SPOKE_ADDRESSES,
  events: {
    Supply: spokeEvents.Supply,
    Withdraw: spokeEvents.Withdraw,
    Borrow: spokeEvents.Borrow,
    Repay: spokeEvents.Repay,
    LiquidationCall: spokeEvents.LiquidationCall,
  },
}).pipe(enrichEvents)

export async function main() {
  await evmPortalStream({
    id: 'aave-v4-launch-monitor',
    portal: 'https://portal.sqd.dev/datasets/ethereum-mainnet',
    outputs: { hubDecoder, spokeDecoder },
  }).pipeTo(
    clickhouseTarget({
      client: createClient({
        username: env.CLICKHOUSE_USER,
        password: env.CLICKHOUSE_PASSWORD,
        url: env.CLICKHOUSE_URL,
        database: env.CLICKHOUSE_DATABASE,
        json: { stringify: serializeJsonWithBigInt },
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
        // Hub flows: Add, Remove, Draw, Restore
        for (const eventType of ['Add', 'Remove', 'Draw', 'Restore'] as const) {
          const events = data.hubDecoder[eventType]
          if (events.length > 0) {
            await store.insert({
              table: 'hub_flows',
              values: events.map(e => ({
                event_type: eventType,
                hub: e.contract ?? '',
                asset_id: String(e.assetId),
                spoke: e.spoke,
                shares: String(e.shares ?? e.drawnShares ?? 0n),
                amount: String(e.amount ?? e.drawnAmount ?? 0n),
                block_number: e.blockNumber,
                tx_hash: e.txHash,
                log_index: e.logIndex,
                timestamp: new Date(e.timestamp * 1000).toISOString(),
              })),
              format: 'JSONEachRow',
            })
          }
        }

        // Spoke events: Supply, Withdraw, Borrow, Repay
        for (const eventType of ['Supply', 'Withdraw', 'Borrow', 'Repay'] as const) {
          const events = data.spokeDecoder[eventType]
          if (events.length > 0) {
            await store.insert({
              table: 'spoke_events',
              values: events.map(e => ({
                event_type: eventType,
                spoke: e.contract ?? '',
                reserve_id: String(e.reserveId),
                caller: e.caller,
                user: e.user,
                shares: String(e.suppliedShares ?? e.withdrawnShares ?? e.drawnShares ?? 0n),
                amount: String(e.suppliedAmount ?? e.withdrawnAmount ?? e.drawnAmount ?? e.totalAmountRepaid ?? 0n),
                block_number: e.blockNumber,
                tx_hash: e.txHash,
                log_index: e.logIndex,
                timestamp: new Date(e.timestamp * 1000).toISOString(),
              })),
              format: 'JSONEachRow',
            })
          }
        }

        // Liquidations
        const liqs = data.spokeDecoder.LiquidationCall
        if (liqs.length > 0) {
          await store.insert({
            table: 'liquidations',
            values: liqs.map(e => ({
              spoke: e.contract ?? '',
              collateral_reserve_id: String(e.collateralReserveId),
              debt_reserve_id: String(e.debtReserveId),
              user: e.user,
              liquidator: e.liquidator,
              receive_shares: e.receiveShares,
              debt_amount_restored: String(e.debtAmountRestored),
              drawn_shares_liquidated: String(e.drawnSharesLiquidated),
              collateral_amount_removed: String(e.collateralAmountRemoved),
              collateral_shares_liquidated: String(e.collateralSharesLiquidated),
              collateral_shares_to_liquidator: String(e.collateralSharesToLiquidator),
              block_number: e.blockNumber,
              tx_hash: e.txHash,
              log_index: e.logIndex,
              timestamp: new Date(e.timestamp * 1000).toISOString(),
            })),
            format: 'JSONEachRow',
          })
        }
      },
      onRollback: async ({ safeCursor, store }) => {
        for (const table of ['hub_flows', 'spoke_events', 'liquidations']) {
          await store.removeAllRows({
            tables: [table],
            where: 'block_number > {latest:UInt32}',
            params: { latest: safeCursor.number },
          })
        }
      },
    }),
  )
}

void main()
```

**Important:** The field names in the `.map()` calls (e.g., `e.assetId`, `e.spoke`, `e.suppliedShares`) depend on the exact ABI output from evm-typegen. Adjust based on the actual generated event parameter names. The `enrichEvents` helper flattens event params into the top level and adds `blockNumber`, `txHash`, `logIndex`, `timestamp` (unix seconds), and `contract`.

- [ ] **Step 2: Verify it compiles**

```bash
cd evm/055-aave-v4 && npx tsx --no-warnings src/index.ts --help 2>&1 || true
# Just checking for compilation errors, not runtime
```

- [ ] **Step 3: Commit**

```bash
git add src/
git commit -m "feat(evm/055): implement Aave v4 Hub & Spoke indexer"
```

---

### Task 6: Write the Bloomberg-terminal dashboard

**Files:**
- Create: `evm/055-aave-v4/dashboard/index.html`

Dashboard panels (1200x675 viewport):
1. **Header strip** — "AAVE V4 LAUNCH MONITOR" + KPI tiles: total events, unique users, active spokes, time since launch
2. **Hub Liquidity Flows** — stacked bar chart (Add/Remove/Draw/Restore) by hour
3. **Spoke Activity Ranking** — horizontal bar chart: event count per spoke
4. **Supply vs Borrow Timeline** — dual-line chart: cumulative supply count + borrow count
5. **Event Type Breakdown** — treemap of Supply/Withdraw/Borrow/Repay proportions
6. **Liquidations Feed** — table of recent liquidations (may be empty on day 1 — show "No liquidations yet" message)

- [ ] **Step 1: Create dashboard/index.html**

Build a single-file HTML dashboard following the Bloomberg terminal style from CLAUDE.md:
- Pure black `#000` background, `#0a0a0a` panels, `#1a1a1a` borders
- Royal blue palette: `#2B4F7E` primary, `#4A7AB5` accent
- Consolas monospace, 10-11px body, 9px axis labels
- ECharts 5.5.1 via CDN
- `animation: false` on all charts
- Queries ClickHouse at `http://localhost:8123` with `database=aave_v4&user=default&password=password`
- Sets `window.__DASHBOARD_READY__ = true` when data loads
- Footer: `Built with ai-pipes + SQD Pipes SDK | github.com/karelxfi | x.com/karelxfi`

Key ClickHouse queries for the dashboard:
```sql
-- KPIs
SELECT count() as total FROM spoke_events
SELECT count(DISTINCT user) as users FROM spoke_events
SELECT count(DISTINCT spoke) as spokes FROM spoke_events
SELECT min(timestamp) as first, max(timestamp) as last FROM spoke_events

-- Hub flows by hour
SELECT toStartOfHour(timestamp) as hour, event_type, count() as cnt
FROM hub_flows GROUP BY hour, event_type ORDER BY hour

-- Spoke ranking
SELECT spoke, count() as cnt FROM spoke_events GROUP BY spoke ORDER BY cnt DESC

-- Supply vs Borrow timeline (cumulative)
SELECT toStartOfHour(timestamp) as hour, event_type, count() as cnt
FROM spoke_events WHERE event_type IN ('Supply', 'Borrow')
GROUP BY hour, event_type ORDER BY hour

-- Event breakdown
SELECT event_type, count() as cnt FROM spoke_events GROUP BY event_type

-- Recent liquidations
SELECT * FROM liquidations ORDER BY block_number DESC LIMIT 20
```

Use the `SPOKE_NAMES` mapping in JS to convert addresses to readable names (MAIN, BLUECHIP, etc.).

- [ ] **Step 2: Commit**

```bash
git add dashboard/
git commit -m "feat(evm/055): add Bloomberg-terminal launch monitor dashboard"
```

---

### Task 7: Write validate.ts

**Files:**
- Create: `evm/055-aave-v4/validate.ts`

Follow the 3-phase validation pattern from the project CLAUDE.md:

- [ ] **Step 1: Write validate.ts**

Phase 1 — Structural checks:
- `hub_flows` table exists and has rows
- `spoke_events` table exists and has rows
- Expected columns in each table
- Timestamps after March 2026
- No empty addresses

Phase 2 — Portal cross-reference:
- Query Portal for logs from one of the Hub contracts (Core Hub `0xCca852Bc40e560adC3b1Cc58CA5b55638ce826c9`) in a sample block range
- Compare event count with ClickHouse `hub_flows` for same range
- 5% tolerance

Phase 3 — Transaction spot-checks:
- Pick 2-3 tx hashes from `spoke_events`
- Query Portal for those specific blocks
- Verify contract address, event topic, and block number match

Use `dotenv/config` for ClickHouse credentials.

- [ ] **Step 2: Commit**

```bash
git add validate.ts
git commit -m "feat(evm/055): add 3-phase validation with Portal cross-reference"
```

---

### Task 8: Run indexer, validate, and capture screenshot

- [ ] **Step 1: Start ClickHouse**

```bash
cd evm/055-aave-v4 && docker compose up -d
```

- [ ] **Step 2: Run the indexer**

```bash
npm start
```

Since Aave v4 was deployed on block 24720891 (March 23) and activated today (March 30), there's only ~7 days of data. Let the indexer sync to head. Monitor progress:
```bash
curl -s 'http://localhost:8123/?user=default&password=password' --data-binary "SELECT count() FROM aave_v4.spoke_events"
curl -s 'http://localhost:8123/?user=default&password=password' --data-binary "SELECT count() FROM aave_v4.hub_flows"
```

- [ ] **Step 3: Run validation**

```bash
npx tsx validate.ts
```

All phases must pass. Fix any issues.

- [ ] **Step 4: Open dashboard and verify**

Open `dashboard/index.html` in browser. Verify:
- All charts render with real data (not empty)
- Spoke names display correctly
- KPIs show meaningful numbers
- Timeline shows activity from launch to now

- [ ] **Step 5: Capture screenshot**

Resize browser to exactly 1200x675. Take screenshot and save to `dashboard/screenshot.png`.

- [ ] **Step 6: Commit validated data**

```bash
git add dashboard/screenshot.png
git commit -m "feat(evm/055): validated Aave v4 launch monitor with real data"
```

---

### Task 9: Create documentation and metadata files

**Files:**
- Create: `evm/055-aave-v4/PROMPT.md`
- Create: `evm/055-aave-v4/OUTPUT.md`
- Create: `evm/055-aave-v4/IMPROVEMENTS.md`
- Create: `evm/055-aave-v4/META.json`
- Create: `evm/055-aave-v4/contracts.json`
- Create: `evm/055-aave-v4/README.md`

- [ ] **Step 1: Create PROMPT.md** — exact verbatim prompt used

- [ ] **Step 2: Create OUTPUT.md** — narrative: what happened, key decisions, issues

- [ ] **Step 3: Create IMPROVEMENTS.md** — feedback on templates, skills, CLI

- [ ] **Step 4: Create META.json**

```json
{
  "date": "2026-03-30",
  "pipes_sdk_version": "1.0.0-alpha.1",
  "agent_skills_version": "<sha>",
  "claude_model": "claude-opus-4-6",
  "angle": "Aave v4 Launch Monitor — Hub & Spoke liquidity flows across 3 Hubs and 11 Spokes",
  "runtime_status": "working",
  "validation_status": "passed"
}
```

- [ ] **Step 5: Create contracts.json** — ALL Aave v4 addresses (Hubs, Spokes, Peripherals)

Include every contract from the research: 3 Hubs, 11 Spokes, Access Manager, Hub Configurator, Spoke Configurator, Position Managers, Gateways.

- [ ] **Step 6: Create README.md** — with screenshot, verification report, run instructions, sample query

- [ ] **Step 7: Final commit**

```bash
git add evm/055-aave-v4/
git commit -m "feat(evm): add Aave v4 launch monitor (055) — Hub & Spoke liquidity flows"
```

---

### Task 10: Update root improvement files

- [ ] **Step 1: Update CLI_IMPROVEMENTS.md** if any new CLI issues found
- [ ] **Step 2: Update AGENT_SKILLS_IMPROVEMENTS.md** if any new skill issues found
- [ ] **Step 3: Push contracts.json to contracts-registry** (if applicable)
