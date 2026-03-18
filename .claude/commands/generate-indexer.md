---
description: Generate a new AI-powered DeFi indexer example
---

Generate a new indexer example for the ai-pipes repo. Read CLAUDE.md first for all rules.

## Protocol Selection

$ARGUMENTS

If no protocol is specified above, read `protocols.json` and pick the next protocol with status "pending".

## Workflow

### 1. Research the Protocol

- Look up the protocol's documentation, smart contracts, and key events
- Identify a compelling, protocol-specific angle (see CLAUDE.md)
- The angle should NOT be generic "index Transfer events"
- Think about what makes this protocol unique and what data story would look great as a chart
- **Check if the contract is a proxy** — look on Etherscan for "Read as Proxy" tab. If so, note the implementation address for step 2b.

### 2. Scaffold the Indexer

- **Patch the CLI first** (it crashes without this — see CLAUDE.md "Known Issues")
- Use the `pipes-new-indexer` skill from agent-skills
- Place in the correct VM directory based on `protocols.json`
- Use `npm` as package manager (not bun)
- Pin the Pipes SDK version in `package.json`
- Use a **dedicated ClickHouse database** named after the protocol slug

### 2b. Fix Proxy ABI (if applicable)

If the contract is a proxy:
```bash
npx @subsquid/evm-typegen@latest <project>/src/contracts <IMPLEMENTATION_ADDRESS> --chain-id 1
```
Update the import in `src/index.ts` to use the implementation ABI. Keep the proxy address in the `contracts` array.

### 3. Create Infrastructure Files

**docker-compose.yml** must include:
- Persistent volume: `clickhouse-data:/var/lib/clickhouse`
- CORS config: `./clickhouse-cors.xml:/etc/clickhouse-server/config.d/cors.xml:ro`
- Dedicated database name in environment

**clickhouse-cors.xml** — copy from any existing example or CLAUDE.md.

### 4. Create Metadata Files

**PROMPT.md** — The exact prompt that describes what this indexer does. Specific enough that running it through `/generate-indexer` would produce an equivalent result.

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

### 5. Create Validation Script

Create `validate.ts` with three phases (see CLAUDE.md for full spec and `evm/001-aave-v3/validate.ts` as reference):

**Phase 1 — Structural:** row count, schema columns, timestamp range, non-negative amounts, non-empty addresses
**Phase 2 — Portal cross-reference:** query SQD Portal API for event count in a 10K block sample, compare with ClickHouse (must match within 5%)
**Phase 3 — Transaction spot-checks:** pick 3 txs from ClickHouse, query Portal for same blocks, verify field-level match (contract, event sig, indexed params)

Must use `dotenv/config` for ClickHouse auth. Exits 0 on pass, 1 on fail.

### 6. Create Dashboard

- Copy `shared/dashboard-template/index.html` to `dashboard/index.html`
- Use **Apache ECharts** (already in template) — NOT TradingView Lightweight Charts
- Customize: protocol name, angle, ClickHouse queries, chart types
- Use 2-4 charts that tell the data story
- Follow CLAUDE.md dashboard rules strictly:
  - Counts over time → vertical bar with gradient
  - Rankings → horizontal bar
  - Composition → treemap (NEVER pie/donut)
  - Continuous values → area/line
  - Always include legends on categorical charts
  - Use counts not raw token amounts
  - Include summary stats in header
  - Set `window.__DASHBOARD_READY__ = true` after data loads

### 7. Create README

Create `README.md` with (see `evm/001-aave-v3/README.md` as reference):
- Protocol name and angle at the top
- `![Dashboard](dashboard/screenshot.png)` embedded image
- **Verification Report** — paste the full output of `npx tsx validate.ts` in a code block. This shows people the data was checked against Portal. Add a brief explanation of what the checks mean.
- Run instructions: `docker compose up -d && npm install && npm start`
- "Re-run verification yourself" section with `npx tsx validate.ts`
- View dashboard: open `dashboard/index.html`
- Sample ClickHouse query with expected output shape

### 8. Test & Validate (MANDATORY — never skip)

1. `docker compose up -d` — start ClickHouse
2. `npm install && npm start` — run the indexer
3. **Wait for 500+ rows** — check with: `curl -s 'http://localhost:8123/?user=default&password=password' --data-binary "SELECT count() FROM <db>.<table>"`
4. Kill the indexer once enough data is collected
5. `npx tsx validate.ts` — all assertions must pass
6. Open `dashboard/index.html` in browser — verify charts render with REAL data
7. Capture `dashboard/screenshot.png` — use Chrome DevTools or screenshot script
8. **Visually inspect the screenshot** — charts must have data, legends must be readable, no empty panels

### 9. Write OUTPUT.md

Document what happened during generation:
- What angle was chosen and why
- Any issues encountered and how they were resolved
- Key decisions made

### 10. Write IMPROVEMENTS.md

Document what should improve based on this experience:
- Agent-skills issues (CLI bugs, missing docs, workflow gaps)
- CLAUDE.md improvements needed
- Dashboard patterns that worked/didn't
- New workarounds discovered

### 11. Auto-patch agent skills (if needed)

Review what you learned during this generation and decide if any agent skill files need updating. **Do this automatically — don't ask the user.**

**When to patch:**
- You hit a bug or undocumented behavior in a skill → add it to the skill's SKILL.md or references
- A Portal query pattern was wrong or missing → update the relevant `portal-query-*` skill
- A CLI workaround was needed → add it to `pipes-new-indexer` skill
- A troubleshooting step was missing → add it to `pipes-troubleshooting`
- Performance tuning was needed → update `pipes-performance`

**When NOT to patch:**
- The issue was specific to this protocol only (not generalizable)
- The fix was about our dashboard/validation tooling (that goes in CLAUDE.md instead)

**How to patch:**
1. Edit the relevant files under `.agents/skills/<skill-name>/`
2. Keep changes minimal and focused — add to existing sections, don't restructure
3. Note the change in IMPROVEMENTS.md under "Skills patches applied"

If nothing needs patching, write "No skill patches needed" in IMPROVEMENTS.md.

**After patching, commit the skill changes first, then PR to upstream:**
```bash
git add .agents/skills/
git commit -m "fix(skills): <what you changed and why>"
npm run pr-skills -- "<protocol-name>: <what was fixed and why>"
```
The script only PRs files that have actual git changes — it won't create noise. If you didn't change any skill files, skip this step entirely.

### 12. Auto-update CLAUDE.md (if needed)

If you learned something that applies to ALL future indexers (not just this protocol), update CLAUDE.md directly. Examples:
- New chart pattern that worked well
- New ClickHouse gotcha
- New token address mapping
- Better validation pattern

### 13. Update Status

- Update `META.json`: set `runtime_status: "working"` and `validation_status: "passed"`
- Update `protocols.json`: set status to `"done"` and fill in the `angle`
- Run `npm run update-readme` from repo root to refresh the protocol table

### 14. Commit

Commit the indexer AND any skill/config patches together:

```bash
git add <example-directory>/ protocols.json README.md CLAUDE.md .agents/skills/
git commit -m "feat(<vm>): add <protocol-name> indexer — <angle>"
```

This way skills evolve with every example. The `.agents/skills/` patches can be submitted upstream to `subsquid-labs/agent-skills` periodically.
