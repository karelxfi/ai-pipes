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

Create `validate.ts` that:
- Imports `dotenv/config` for ClickHouse auth from `.env`
- Connects to ClickHouse with username and password
- Checks row count > 0
- Verifies schema (correct table, columns, types)
- Spot-checks known data points
- Validates value ranges
- Exits 0 on pass, 1 on fail with details

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

Create `README.md` with:
- Protocol name and angle at the top
- `![Dashboard](dashboard/screenshot.png)` embedded image
- Run instructions: `docker compose up -d && npm install && npm start`
- Validate: `npx tsx validate.ts`
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

### 11. Update Status

- Update `META.json`: set `runtime_status: "working"` and `validation_status: "passed"`
- Update `protocols.json`: set status to `"done"` and fill in the `angle`
- Run `npm run update-readme` from repo root to refresh the protocol table

### 12. Commit

```bash
git add <example-directory>/ protocols.json README.md
git commit -m "feat(<vm>): add <protocol-name> indexer — <angle>"
```
