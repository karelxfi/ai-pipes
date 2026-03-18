# Improvements from Aave V3 Generation

## Agent Skills Issues (subsquid-labs/agent-skills)

### 1. CLI `ora` crash is a showstopper
The `pipes-new-indexer` skill documents the `ora` ESM/CJS crash workaround, but doesn't make it clear this happens on **every** `init` call. The workaround requires patching cached npm files which `npx` can overwrite at any time.

**Suggestion for agent-skills:** Either fix the CLI upstream, or add a pre-flight check script that patches automatically before `init`. The current manual patch approach is fragile.

### 2. Proxy contract detection should be part of the skill workflow
The skill mentions proxy detection in Step 3.5 but it's buried. For Aave V3, the Pool contract is a proxy — the CLI fetched only the `Upgraded` event ABI. This is the #1 failure mode for custom template indexers on major DeFi protocols.

**Suggestion for agent-skills:** Add proxy detection as a mandatory pre-step in the `pipes-new-indexer` skill, before running the CLI. Check Etherscan for proxy status, fetch implementation address, and plan for ABI regeneration.

### 3. No guidance on ClickHouse CORS for browser dashboards
The skills focus on indexer → ClickHouse pipeline but don't mention that browser-based dashboards (which query ClickHouse directly via HTTP) need CORS headers. Every dashboard builder will hit this.

**Suggestion for agent-skills:** Add a `clickhouse-cors.xml` snippet to the `pipes-deploy` skill's local Docker section.

### 4. Database isolation not enforced by CLI
The skill documents "use separate database per indexer" but the CLI defaults to `pipes` database. Every new user will run into sync table conflicts.

**Suggestion for agent-skills:** Either default to a project-specific database name in the CLI, or make the skill's post-generation step more prominent about creating a dedicated database.

### 5. `packageManager: "bun"` should not be the default in examples
The skill examples use `bun` but many users don't have bun installed. Using `npm` is more universally compatible.

**Suggestion for agent-skills:** Use `npm` in examples, mention bun as an alternative for speed.

## Dashboard & Visualization Issues (our learnings)

### 6. TradingView Lightweight Charts is wrong for BI dashboards
We initially used Lightweight Charts per the spec. It's designed for financial candlestick data — terrible for bar charts, categorical data, treemaps. The v5 API also broke backward compatibility (`addLineSeries` → `addSeries`).

**Resolution:** Switched to Apache ECharts. Much better for mixed chart types, dark themes, no watermarks, proper tooltips.

### 7. Don't sum raw token amounts across different tokens
We initially divided `debt_to_cover` by `1e18` for "volume" charts. This is wrong — USDC has 6 decimals, WBTC has 8. The resulting numbers are garbage.

**Resolution:** Use counts (number of liquidations) for comparisons. If volume is needed, normalize to a single denomination using on-chain price data.

### 8. Never use pie/donut charts
They're hard to compare, waste space, and look dated. Treemaps show the same proportional data better.

### 9. Pick charts that match the data type
- Counts over time → bar histogram
- Rankings → horizontal bar chart
- Composition → treemap
- Continuous values → area/line chart

### 10. Always include legends on categorical charts
Without legends, colored bars mean nothing. Each categorical chart needs a legend mapping colors to labels.

## Infrastructure Issues

### 11. ClickHouse data lost on container restart
Docker containers without persistent volumes lose all data when recreated. Every `docker compose down && up` wipes the index.

**Resolution:** Added named volume `clickhouse-data:/var/lib/clickhouse` to docker-compose.yml.

### 12. validate.ts didn't read .env for auth
The validation script hardcoded no auth, but ClickHouse had a password set. Any script connecting to ClickHouse must use `dotenv/config`.

### 13. Screenshot tooling needs to wait for data
Initial screenshot attempts captured empty dashboards because the Puppeteer script used a fixed timeout. Dashboards should set `window.__DASHBOARD_READY__ = true` after data loads, and the screenshot script should wait for that signal.
