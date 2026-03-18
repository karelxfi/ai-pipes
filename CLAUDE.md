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
- [ ] `IMPROVEMENTS.md` — feedback on how CLAUDE.md, generate-indexer command, and templates should improve based on this experience
- [ ] `META.json` — date, pipes_sdk_version, agent_skills_version, claude_model, angle, runtime_status, validation_status
- [ ] `README.md` — with dashboard screenshot at top, run instructions, sample ClickHouse query
- [ ] `package.json` — with pinned Pipes SDK version
- [ ] `src/` — indexer source code
- [ ] `docker-compose.yml` — ClickHouse for local development
- [ ] `validate.ts` — data validation (row count, schema, spot checks, range checks)
- [ ] `dashboard/index.html` — standalone dark-themed dashboard with TradingView Lightweight Charts
- [ ] `dashboard/screenshot.png` — captured screenshot of populated dashboard (1200x675, X-optimized)

## Validation (MANDATORY — never skip)

**You MUST run the indexer, validate the output, and capture a real screenshot before committing.** An example without a working screenshot with real data is not done.

Before marking an example as done:

1. `docker compose up -d` — start ClickHouse
2. `npm install && npm start` — run the indexer, wait until data appears in ClickHouse
3. `npx tsx validate.ts` — all assertions must pass
4. Open `dashboard/index.html` in browser — verify charts render with REAL data (not empty)
5. Capture `dashboard/screenshot.png` — must show populated charts, not empty panels
6. Visually confirm the screenshot looks good enough to share on X
7. Update META.json: `runtime_status: "working"`, `validation_status: "passed"`
8. Update `protocols.json` status to "done"

**If charts are empty:** Check browser console for errors. Common issues:
- ClickHouse CORS: mount `clickhouse-cors.xml` in docker-compose.yml
- Lightweight Charts v5 API: use `chart.addSeries(LightweightCharts.LineSeries, ...)` NOT `chart.addLineSeries(...)`
- Auth: include `user=default&password=password` in ClickHouse query URLs

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
