# ai-pipes Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Set up the `karelxfi/ai-pipes` public repo with all infrastructure, Claude config, protocol list, dashboard template, and generation command — then prove it works with one end-to-end example.

**Architecture:** Monorepo organized by VM type (`evm/`, `solana/`, `hyperliquid/`). Each example is self-contained with indexer code, validation, dashboard, and metadata. A `/generate-indexer` Claude Code slash command drives the full generation workflow using `subsquid-labs/agent-skills`.

**Tech Stack:** TypeScript, SQD Pipes SDK, ClickHouse (Docker), TradingView Lightweight Charts, Claude Code slash commands, `subsquid-labs/agent-skills`

---

## Chunk 1: Repo Initialization

### Task 1: Initialize git repo and directory structure

**Files:**
- Create: `.gitignore`
- Create: `package.json`
- Create: `evm/.gitkeep`
- Create: `solana/.gitkeep`
- Create: `hyperliquid/.gitkeep`
- Create: `scripts/.gitkeep`

- [ ] **Step 1: Initialize git repo**

```bash
cd /Users/kb/dev/playground/ai-pipes
git init
```

- [ ] **Step 2: Create .gitignore**

Create `.gitignore`:

```
node_modules/
dist/
.env
*.log
.DS_Store
```

- [ ] **Step 3: Create root package.json**

Create `package.json` (root-level tooling only, each example has its own):

```json
{
  "name": "ai-pipes",
  "private": true,
  "description": "100 DeFi Indexers, Fully AI-Generated with SQD Pipes SDK",
  "scripts": {
    "fetch-protocols": "tsx scripts/fetch-protocols.ts",
    "update-readme": "tsx scripts/update-readme.ts",
    "screenshot": "tsx scripts/screenshot.ts"
  },
  "devDependencies": {
    "tsx": "^4.0.0",
    "puppeteer": "^23.0.0"
  }
}
```

- [ ] **Step 4: Install root dependencies**

```bash
npm install
```

- [ ] **Step 5: Create directory structure**

```bash
mkdir -p evm solana hyperliquid shared/dashboard-template scripts
touch evm/.gitkeep solana/.gitkeep hyperliquid/.gitkeep scripts/.gitkeep
```

- [ ] **Step 6: Initial commit**

```bash
git add .gitignore package.json package-lock.json evm/ solana/ hyperliquid/ scripts/
git commit -m "init: repo structure with evm/solana/hyperliquid directories"
```

### Task 2: Create GitHub repo and push

- [ ] **Step 1: Create public repo on GitHub**

```bash
gh repo create karelxfi/ai-pipes --public --source=. --description "100 DeFi Indexers, Fully AI-Generated with SQD Pipes SDK"
```

- [ ] **Step 2: Push initial commit**

```bash
git push -u origin main
```

---

## Chunk 2: Claude Configuration

### Task 3: Create .claude/settings.json

**Files:**
- Create: `.claude/settings.json`

- [ ] **Step 1: Create settings file**

Create `.claude/settings.json`:

```json
{
  "permissions": {
    "allow": [
      "Bash(npx skills*)",
      "Bash(npm install*)",
      "Bash(npm start*)",
      "Bash(docker compose*)",
      "Bash(npx tsx*)"
    ]
  }
}
```

- [ ] **Step 2: Commit**

```bash
git add .claude/settings.json
git commit -m "config: add Claude Code settings with permissions"
```

### Task 4: Create CLAUDE.md

**Files:**
- Create: `CLAUDE.md`

- [ ] **Step 1: Write CLAUDE.md**

Create `CLAUDE.md`:

```markdown
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
- [ ] `META.json` — date, pipes_sdk_version, agent_skills_version, claude_model, angle, runtime_status, validation_status
- [ ] `README.md` — with dashboard screenshot at top, run instructions, sample ClickHouse query
- [ ] `package.json` — with pinned Pipes SDK version
- [ ] `src/` — indexer source code
- [ ] `docker-compose.yml` — ClickHouse for local development
- [ ] `validate.ts` — data validation (row count, schema, spot checks, range checks)
- [ ] `dashboard/index.html` — standalone dark-themed dashboard with TradingView Lightweight Charts
- [ ] `dashboard/screenshot.png` — captured screenshot of populated dashboard (1200x675, X-optimized)

## Validation

Before marking an example as done:

1. Run `docker compose up -d && npm start` — indexer must start and sync
2. Run `npx tsx validate.ts` — all assertions must pass
3. Open `dashboard/index.html` — charts must render with real data
4. Capture screenshot — must look good enough to share on X
5. Update `protocols.json` status to "done"

## Conventions

- Follow agent-skills CLAUDE.md (Rule 0: always read project docs before implementation)
- Record installed agent-skills commit SHA in META.json
- Pipes SDK version pinning is the primary reproducibility mechanism
- Each example is a self-contained commit

## Dashboard Design

- Dark theme, optimized for 1200x675 (X card ratio)
- Self-contained single HTML file, CDN dependencies only
- TradingView Lightweight Charts for time-series data
- Subtle "Built with ai-pipes + SQD Pipes SDK" watermark
- Use `shared/dashboard-template/` as starting point (copy, don't import)
```

- [ ] **Step 2: Commit**

```bash
git add CLAUDE.md
git commit -m "config: add CLAUDE.md with generation workflow and conventions"
```

---

## Chunk 3: Protocol List

### Task 5: Fetch and filter DeFiLlama protocols into protocols.json

**Files:**
- Create: `scripts/fetch-protocols.ts`
- Create: `protocols.json`

- [ ] **Step 1: Create fetch script**

Create `scripts/fetch-protocols.ts` — a TypeScript script that:
1. Fetches `https://api.llama.fi/protocols`
2. Sorts by TVL descending
3. Filters out CEXes, canonical bridges, RWA-only, staking pools without events
4. Keeps top entries that are indexable DeFi protocols (DEXes, Lending, CDPs, Yield, Derivatives, Liquid Staking)
5. Classifies each by VM: `evm`, `solana`, `hyperliquid`
6. Assigns numbered directory paths (`evm/001-slug/`, etc.)
7. Sets all statuses to `pending`, angles to `null` (determined during generation)
8. Writes `protocols.json`

```typescript
import { writeFileSync } from 'fs';

const EXCLUDED_CATEGORIES = [
  'CEX', 'Chain', 'Bridge', 'Canonical Bridge',
];

const EXCLUDED_NAMES = [
  'Binance CEX', 'OKX', 'Bitfinex', 'Bybit', 'Bitget', 'HTX',
  'Gemini', 'Gate', 'Deribit', 'KuCoin', 'MEXC', 'Crypto.com',
  'Poloniex', 'Bitkub', 'HashKey Exchange', 'Robinhood',
  'Figure Markets Exchange',
];

interface Protocol {
  name: string;
  slug: string;
  category: string;
  tvl: number;
  chains: string[];
}

async function main() {
  const res = await fetch('https://api.llama.fi/protocols');
  const data: Protocol[] = await res.json();

  const sorted = data
    .filter(p => p.tvl > 0)
    .sort((a, b) => b.tvl - a.tvl);

  const filtered = sorted.filter(p => {
    if (EXCLUDED_CATEGORIES.includes(p.category)) return false;
    if (EXCLUDED_NAMES.includes(p.name)) return false;
    // Keep protocols with on-chain activity
    return true;
  });

  const evmChains = new Set([
    'Ethereum', 'Polygon', 'Arbitrum', 'Optimism', 'Base',
    'BSC', 'Avalanche', 'Fantom', 'Gnosis', 'zkSync Era',
    'Linea', 'Scroll', 'Blast', 'Manta', 'Mantle',
  ]);

  const counters = { evm: 0, solana: 0, hyperliquid: 0 };

  const protocols = filtered.slice(0, 150).map(p => {
    // Determine VM — Solana-only or Hyperliquid-only protocols get their own category.
    // Multi-chain protocols that include EVM chains default to evm.
    let vm = 'evm'; // default
    const chains = p.chains || [];
    const hasEvm = chains.some(c => evmChains.has(c));
    const hasSolana = chains.includes('Solana');
    const hasHyperliquid = chains.includes('Hyperliquid');

    if (hasHyperliquid && !hasEvm && !hasSolana) {
      vm = 'hyperliquid';
    } else if (hasSolana && !hasEvm) {
      vm = 'solana';
    }

    counters[vm as keyof typeof counters]++;
    const num = String(counters[vm as keyof typeof counters]).padStart(3, '0');
    const slug = p.slug || p.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
    const directory = `${vm}/${num}-${slug}`;

    return {
      name: p.name,
      slug,
      category: p.category,
      tvl: Math.round(p.tvl),
      vm,
      chains,
      angle: null,
      directory,
      status: 'pending',
    };
  });

  // Take ~100 after filtering
  const final = protocols.slice(0, 100);

  const output = {
    source: 'https://api.llama.fi/protocols',
    fetched: new Date().toISOString().split('T')[0],
    total: final.length,
    breakdown: {
      evm: final.filter(p => p.vm === 'evm').length,
      solana: final.filter(p => p.vm === 'solana').length,
      hyperliquid: final.filter(p => p.vm === 'hyperliquid').length,
    },
    protocols: final,
  };

  writeFileSync('protocols.json', JSON.stringify(output, null, 2));
  console.log(`Wrote ${final.length} protocols to protocols.json`);
  console.log(`EVM: ${output.breakdown.evm}, Solana: ${output.breakdown.solana}, Hyperliquid: ${output.breakdown.hyperliquid}`);
}

main().catch(console.error);
```

- [ ] **Step 2: Run the fetch script**

```bash
npx tsx scripts/fetch-protocols.ts
```

Expected: `protocols.json` created with ~100 filtered protocols.

- [ ] **Step 3: Review and manually adjust if needed**

Verify the output — check for any protocols that slipped through filtering (CEXes disguised as DeFi, etc.) and remove them. Verify VM classification is correct.

- [ ] **Step 4: Commit**

```bash
git add scripts/fetch-protocols.ts protocols.json
git commit -m "data: fetch and filter top 100 DeFi protocols from DeFiLlama"
```

---

## Chunk 4: Dashboard Template

### Task 6: Create shared dashboard template

**Files:**
- Create: `shared/dashboard-template/index.html`
- Create: `shared/dashboard-template/README.md`

- [ ] **Step 1: Create the dashboard HTML template**

Create `shared/dashboard-template/index.html` — a standalone HTML file with:

1. TradingView Lightweight Charts loaded from CDN (`https://unpkg.com/lightweight-charts/dist/lightweight-charts.standalone.production.js`)
2. Dark theme CSS (background: `#0d1117`, text: `#e6edf3`, accent: `#58a6ff`)
3. ClickHouse HTTP interface query helper function
4. Standard layout:
   - Header: protocol name, angle description, date range
   - Chart grid: 2x2 layout for up to 4 charts
   - Footer: "Built with ai-pipes + SQD Pipes SDK" watermark
5. Viewport optimized for 1200x675 (X card ratio)
6. Placeholder chart initialization code with comments explaining customization points

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=1200">
  <title>ai-pipes Dashboard</title>
  <script src="https://unpkg.com/lightweight-charts/dist/lightweight-charts.standalone.production.js"></script>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      background: #0d1117;
      color: #e6edf3;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;
      width: 1200px;
      height: 675px;
      overflow: hidden;
    }
    .header {
      padding: 20px 24px 12px;
    }
    .header h1 {
      font-size: 24px;
      font-weight: 600;
      color: #e6edf3;
    }
    .header .angle {
      font-size: 14px;
      color: #8b949e;
      margin-top: 4px;
    }
    .chart-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-template-rows: 1fr 1fr;
      gap: 12px;
      padding: 12px 24px;
      height: calc(100% - 90px - 36px);
    }
    .chart-container {
      background: #161b22;
      border: 1px solid #30363d;
      border-radius: 8px;
      padding: 12px;
      position: relative;
    }
    .chart-container .chart-title {
      font-size: 12px;
      color: #8b949e;
      margin-bottom: 8px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .chart-container .chart {
      width: 100%;
      height: calc(100% - 24px);
    }
    .footer {
      padding: 8px 24px;
      text-align: right;
      font-size: 11px;
      color: #484f58;
    }
  </style>
</head>
<body>
  <div class="header">
    <!-- CUSTOMIZE: Protocol name and angle -->
    <h1>Protocol Name</h1>
    <div class="angle">Compelling angle description — what story does this data tell?</div>
  </div>

  <div class="chart-grid">
    <!-- CUSTOMIZE: Up to 4 charts. Remove containers you don't need. -->
    <div class="chart-container">
      <div class="chart-title">Chart 1 Title</div>
      <div class="chart" id="chart1"></div>
    </div>
    <div class="chart-container">
      <div class="chart-title">Chart 2 Title</div>
      <div class="chart" id="chart2"></div>
    </div>
    <div class="chart-container">
      <div class="chart-title">Chart 3 Title</div>
      <div class="chart" id="chart3"></div>
    </div>
    <div class="chart-container">
      <div class="chart-title">Chart 4 Title</div>
      <div class="chart" id="chart4"></div>
    </div>
  </div>

  <div class="footer">Built with ai-pipes + SQD Pipes SDK</div>

  <script>
    // ClickHouse HTTP interface helper
    const CLICKHOUSE_URL = 'http://localhost:8123';

    async function queryClickHouse(sql) {
      const res = await fetch(`${CLICKHOUSE_URL}/?query=${encodeURIComponent(sql + ' FORMAT JSON')}`);
      const json = await res.json();
      return json.data;
    }

    // Chart configuration defaults (dark theme)
    function createChart(containerId) {
      const container = document.getElementById(containerId);
      const chart = LightweightCharts.createChart(container, {
        layout: {
          background: { type: 'solid', color: '#161b22' },
          textColor: '#8b949e',
        },
        grid: {
          vertLines: { color: '#21262d' },
          horzLines: { color: '#21262d' },
        },
        width: container.clientWidth,
        height: container.clientHeight,
        timeScale: {
          borderColor: '#30363d',
        },
        rightPriceScale: {
          borderColor: '#30363d',
        },
      });
      return chart;
    }

    // CUSTOMIZE: Replace with your ClickHouse queries and chart setup
    async function init() {
      // Example: const data = await queryClickHouse('SELECT time, value FROM my_table ORDER BY time');
      // const chart1 = createChart('chart1');
      // const series = chart1.addLineSeries({ color: '#58a6ff' });
      // series.setData(data.map(d => ({ time: d.time, value: parseFloat(d.value) })));
    }

    init().catch(console.error);
  </script>
</body>
</html>
```

- [ ] **Step 2: Create template README**

Create `shared/dashboard-template/README.md`:

```markdown
# Dashboard Template

Base HTML template for ai-pipes example dashboards.

## Usage

Copy `index.html` into your example's `dashboard/` directory and customize:

1. Update the header (protocol name, angle)
2. Write ClickHouse queries for your indexed data
3. Create charts using the `createChart()` helper
4. Adjust chart grid (remove unused containers, change layout)

## Design Constraints

- Dark theme (do not change base colors)
- 1200x675 viewport (optimized for X card screenshots)
- Self-contained: CDN dependencies only, no imports from this directory
- Subtle watermark in footer
```

- [ ] **Step 3: Commit**

```bash
git add shared/dashboard-template/
git commit -m "feat: add shared dashboard template with TradingView charts"
```

---

## Chunk 4b: Screenshot Tooling

### Task 6b: Create screenshot capture script

**Files:**
- Create: `scripts/screenshot.ts`

- [ ] **Step 1: Create screenshot script**

Create `scripts/screenshot.ts` — uses Puppeteer to capture a dashboard at 1200x675:

```typescript
import puppeteer from 'puppeteer';
import { resolve } from 'path';

async function main() {
  const htmlPath = process.argv[2];
  const outputPath = process.argv[3] || htmlPath.replace('index.html', 'screenshot.png');

  if (!htmlPath) {
    console.error('Usage: npx tsx scripts/screenshot.ts <path-to-index.html> [output.png]');
    process.exit(1);
  }

  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewport({ width: 1200, height: 675 });

  const fileUrl = `file://${resolve(htmlPath)}`;
  await page.goto(fileUrl, { waitUntil: 'networkidle0', timeout: 30000 });

  // Wait for charts to render
  await new Promise(r => setTimeout(r, 2000));

  await page.screenshot({ path: resolve(outputPath), type: 'png' });
  console.log(`Screenshot saved to ${resolve(outputPath)}`);

  await browser.close();
}

main().catch(e => { console.error(e); process.exit(1); });
```

- [ ] **Step 2: Commit**

```bash
git add scripts/screenshot.ts
git commit -m "feat: add Puppeteer screenshot script for dashboard captures"
```

---

## Chunk 5: Generate-Indexer Command

### Task 7: Create the /generate-indexer slash command

**Files:**
- Create: `.claude/commands/generate-indexer.md`

- [ ] **Step 1: Write the slash command**

Create `.claude/commands/generate-indexer.md`:

```markdown
---
description: Generate a new AI-powered DeFi indexer example
---

Generate a new indexer example for the ai-pipes repo.

## Protocol Selection

$ARGUMENTS

If no protocol is specified above, read `protocols.json` and pick the next protocol with status "pending".

## Workflow

### 1. Research the Protocol

- Look up the protocol's documentation, smart contracts, and key events
- Identify a compelling, protocol-specific angle (see CLAUDE.md)
- The angle should NOT be generic "index Transfer events"
- Think about what makes this protocol unique and what data story would look great as a chart

### 2. Scaffold the Indexer

- Use the `pipes-new-indexer` skill from agent-skills
- Place in the correct VM directory based on `protocols.json`
- Pin the Pipes SDK version in `package.json`

### 3. Create Metadata Files

**PROMPT.md** — Write the exact prompt that describes what this indexer does. This is the prompt that would be used to reproduce this example. It should be specific enough that running it through `/generate-indexer` would produce an equivalent result.

**META.json:**
```json
{
  "date": "YYYY-MM-DD",
  "pipes_sdk_version": "<from package.json>",
  "agent_skills_version": "<installed commit SHA>",
  "claude_model": "claude-opus-4-6",
  "prompt_file": "PROMPT.md",
  "angle": "<the compelling angle>",
  "runtime_status": "untested",
  "validation_status": "untested"
}
```

### 4. Create Validation Script

Create `validate.ts` that:
- Connects to ClickHouse at `http://localhost:8123`
- Checks row count > 0
- Verifies schema (correct table, columns, types)
- Spot-checks known data points
- Validates value ranges (no negatives where inappropriate, timestamps in range)
- Exits 0 on pass, 1 on fail with details

### 5. Create Dashboard

- Copy `shared/dashboard-template/index.html` to `dashboard/index.html`
- Customize: protocol name, angle, ClickHouse queries, chart types
- Use 2-4 charts that tell the data story
- Keep the dark theme and 1200x675 layout

### 6. Create README

Create `README.md` with:
- Protocol name and angle at the top
- `![Dashboard](dashboard/screenshot.png)` embedded image
- Run instructions: `docker compose up -d && npm start`
- Validate: `npx tsx validate.ts`
- View dashboard: open `dashboard/index.html`
- Sample ClickHouse query with expected output shape

### 7. Test & Validate

1. `docker compose up -d` — start ClickHouse
2. `npm install && npm start` — run the indexer, wait for initial sync
3. `npx tsx validate.ts` — verify data
4. Open `dashboard/index.html` in browser — verify charts render
5. Capture `dashboard/screenshot.png` (1200x675)

### 8. Write OUTPUT.md

Document what happened during generation:
- What angle was chosen and why
- Any issues encountered and how they were resolved
- Key decisions made

### 9. Update Status

- Update `META.json`: set `runtime_status` and `validation_status`
- Update `protocols.json`: set status to "done" (or "failed" with reason)

### 10. Commit

```bash
git add <example-directory>/
git commit -m "feat(<vm>): add <protocol-name> indexer — <angle>"
```
```

- [ ] **Step 2: Commit**

```bash
git add .claude/commands/generate-indexer.md
git commit -m "feat: add /generate-indexer slash command"
```

---

## Chunk 6: Root README

### Task 8: Create root README.md

**Files:**
- Create: `README.md`

- [ ] **Step 1: Write README.md skeleton**

Create `README.md`:

```markdown
# ai-pipes

**100 DeFi Indexers, Fully AI-Generated**

Every indexer in this repo was generated by [Claude Code](https://claude.ai) using [SQD Agent Skills](https://github.com/subsquid-labs/agent-skills) and the [Pipes SDK](https://docs.sqd.dev). Each example includes a compelling data story, a shareable dashboard, and full reproducibility metadata.

## How It Works

1. We feed a protocol name to the `/generate-indexer` command
2. Claude Code researches the protocol and picks a compelling angle
3. The `pipes-new-indexer` skill scaffolds a working indexer
4. A dashboard, validation script, and metadata are generated
5. Everything is tested locally and committed

## Protocols

<!-- PROTOCOLS:START -->
<!-- Auto-generated from protocols.json — run `npm run update-readme` to refresh -->
| # | Protocol | Category | VM | Status |
|---|----------|----------|----|--------|
<!-- PROTOCOLS:END -->

## Quick Start

Pick any example and run:

```bash
cd evm/001-aave-v3-liquidations
docker compose up -d
npm install
npm start
```

Open `dashboard/index.html` in your browser to see the charts.

## Reproduce

1. Fork this repo
2. Install [Claude Code](https://claude.ai)
3. Run: `npx skills add subsquid-labs/agent-skills --all`
4. Run: `/generate-indexer <protocol-name>`

## Links

- [Pipes SDK Docs](https://docs.sqd.dev)
- [SQD Agent Skills](https://github.com/subsquid-labs/agent-skills)
- [DeFiLlama](https://defillama.com)
- [SQD Portal](https://portal.sqd.dev)
```

- [ ] **Step 2: Create update-readme script**

Create `scripts/update-readme.ts`:

```typescript
import { readFileSync, writeFileSync } from 'fs';

interface Protocol {
  name: string;
  category: string;
  vm: string;
  angle: string | null;
  status: string;
}

const STATUS_EMOJI: Record<string, string> = {
  pending: '⏳',
  done: '✅',
  failed: '❌',
  skipped: '⏭️',
};

function main() {
  const data = JSON.parse(readFileSync('protocols.json', 'utf-8'));
  const protocols: Protocol[] = data.protocols;

  const rows = protocols.map((p, i) =>
    `| ${i + 1} | ${p.name} | ${p.category} | ${p.vm} | ${STATUS_EMOJI[p.status] || p.status} |`
  );

  const table = [
    '<!-- Auto-generated from protocols.json — run `npm run update-readme` to refresh -->',
    '| # | Protocol | Category | VM | Status |',
    '|---|----------|----------|----|--------|',
    ...rows,
  ].join('\n');

  const readme = readFileSync('README.md', 'utf-8');
  const START = '<!-- PROTOCOLS:START -->';
  const END = '<!-- PROTOCOLS:END -->';

  const startIdx = readme.indexOf(START);
  const endIdx = readme.indexOf(END);

  if (startIdx === -1 || endIdx === -1) {
    console.error('Missing PROTOCOLS markers in README.md');
    process.exit(1);
  }

  const updated = readme.slice(0, startIdx + START.length) + '\n' + table + '\n' + readme.slice(endIdx);
  writeFileSync('README.md', updated);
  console.log(`Updated README.md with ${protocols.length} protocols`);
}

main();
```

- [ ] **Step 3: Run the script to populate the table**

```bash
npx tsx scripts/update-readme.ts
```

- [ ] **Step 4: Commit**

```bash
git add README.md scripts/update-readme.ts
git commit -m "docs: add root README with protocol table"
```

---

## Chunk 7: First Example (End-to-End Proof)

### Task 9: Generate the first example — Aave V3 Liquidations (EVM)

This task manually walks through the `/generate-indexer` workflow step by step to prove the pipeline works. After this succeeds, future examples can use the slash command directly.

- [ ] **Step 1: Run the generation command**

```
/generate-indexer Aave V3
```

This invokes the full workflow defined in the slash command. The agent will: research Aave V3, pick a compelling angle, scaffold the indexer using `pipes-new-indexer` skill, create all metadata files, validation, dashboard, and README.

Monitor the generation — intervene if it gets stuck or makes wrong choices.

- [ ] **Step 2: Verify directory structure**

```bash
ls -la evm/001-*/
```

Expected: All required files exist: `PROMPT.md`, `OUTPUT.md`, `META.json`, `README.md`, `package.json`, `docker-compose.yml`, `validate.ts`, `src/`, `dashboard/index.html`.

- [ ] **Step 3: Start ClickHouse**

```bash
cd evm/001-*
docker compose up -d
```

Expected: ClickHouse container running on port 8123. Verify:

```bash
curl -s 'http://localhost:8123/?query=SELECT+1'
```

Expected output: `1`

- [ ] **Step 4: Run the indexer**

```bash
npm install && npm start
```

Watch logs for sync progress. Wait until the indexer has processed at least a few thousand blocks. Check for data:

```bash
curl -s 'http://localhost:8123/?query=SHOW+TABLES'
```

Expected: At least one table created by the indexer.

- [ ] **Step 5: Run validation**

```bash
npx tsx validate.ts
```

Expected: All assertions pass, exit code 0.

- [ ] **Step 6: Capture dashboard screenshot**

```bash
npx tsx ../../scripts/screenshot.ts dashboard/index.html dashboard/screenshot.png
```

Expected: `dashboard/screenshot.png` created at 1200x675.

- [ ] **Step 7: Verify README has screenshot embedded**

```bash
grep 'screenshot.png' README.md
```

Expected: `![Dashboard](dashboard/screenshot.png)` present.

- [ ] **Step 8: Verify META.json is complete**

```bash
cat META.json | python3 -c "import sys,json; d=json.load(sys.stdin); assert d['runtime_status']=='working'; assert d['validation_status']=='passed'; print('OK')"
```

- [ ] **Step 9: Update protocols.json and root README**

```bash
cd ../..
npm run update-readme
```

Verify `protocols.json` shows Aave V3 as `"status": "done"`.

- [ ] **Step 10: Commit and push**

```bash
git add evm/001-*/ protocols.json README.md
git commit -m "feat(evm): add Aave V3 liquidations indexer"
git push origin main
```

- [ ] **Step 11: Verify on GitHub**

Check `https://github.com/karelxfi/ai-pipes` — the root README should show the protocol table with Aave V3 marked done, and the example's README should display the dashboard screenshot inline.

---

## Execution Notes

- **Tasks 1-8** are repo scaffolding — they set up the infrastructure
- **Task 9** is the proof — it tests the entire generation pipeline end-to-end
- After Task 9 succeeds, generating the remaining ~99 examples is just repeated runs of `/generate-indexer`
- Generate examples in batches by category (all lending protocols, then DEXes, etc.) for efficiency
- Each example is an independent commit — failures don't block other examples
