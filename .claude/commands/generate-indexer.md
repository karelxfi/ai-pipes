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
