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
