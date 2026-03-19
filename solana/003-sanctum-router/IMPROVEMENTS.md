# Improvements — Sanctum Router

## CLAUDE.md Improvements

### Add: verify instruction volume before building indexer
- **Issue:** Wasted time building a Router-only indexer before discovering the Router has very low instruction volume (~2 per 1K slots). Should have checked Portal instruction counts first.
- **Fix:** Add a step in the workflow: "Query Portal for instruction count in a 10K slot sample before committing to a program ID. If count < 50, investigate whether the activity happens on related programs."

### Add: Pipes SDK sync table reset
- **Issue:** When resetting an indexer, truncating the data table is not enough. The `sync` table in ClickHouse stores the cursor. Must `DROP TABLE sync` to fully reset.
- **Fix:** Add to Known Issues: "To fully reset a Pipes SDK indexer, drop both the data tables AND the `sync` table: `DROP TABLE IF EXISTS <db>.sync`"

## Agent Skills Improvements

### portal-query-solana-instructions: document `signatures` vs `signature` field
- **Source:** solana/003-sanctum-router
- **Issue:** Portal Solana transaction fields use `signatures` (plural, array) not `signature`. Using `signature` causes "unknown field" error. The skill should document this.

### portal-query-solana-instructions: add volume estimation workflow
- **Source:** solana/003-sanctum-router
- **Issue:** No guidance on how to estimate instruction volume for a program before building an indexer. Should recommend: query a small slot range (1K-10K), check result count, extrapolate.

## Skills Patches Applied
No skill files patched in this example — the improvements are documented above for future PR.
