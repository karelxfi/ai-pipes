# Improvements — Lista Liquid Staking

## CLAUDE.md Improvements

### Add: manual event definition import pattern
- **Issue:** When writing manual event definitions, `p` comes from `@subsquid/evm-codec` (not `@subsquid/evm-abi`). This is a common mistake.
- **Fix:** Add to Known Issues: "When writing manual event definitions, use `import * as p from '@subsquid/evm-codec'` and `import { event, indexed } from '@subsquid/evm-abi'`"

## Agent Skills Improvements
No new issues beyond the import pattern above.

## Skills Patches Applied
No skill patches needed.
