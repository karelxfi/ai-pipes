# Improvements — Stader

## CLAUDE.md Improvements

### Add: verify event signatures before writing manual definitions
- **Issue:** Wrote manual Oracle event definitions based on source code, but the deployed contract has different parameter encoding (3 uint256 in data instead of 4). The contract was likely upgraded and the event changed.
- **Fix:** Add to workflow: "When writing manual event definitions, always verify against actual Portal log data first. Decode a sample log's `data` field to confirm byte count matches your parameter list."

## Agent Skills Improvements
No new issues.

## Skills Patches Applied
No skill patches needed.
