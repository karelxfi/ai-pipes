# Improvements — Euler V2

## CLAUDE.md Improvements

### Add: factory pattern workaround via mediator contracts
- **Issue:** Protocols with factory patterns (each vault/pool is its own contract) can't use static `contracts` arrays in `evmDecoder`. But many have a mediator contract (like EVC) that sees all operations.
- **Fix:** Add to Known Issues/Patterns: "For factory-pattern protocols, look for a mediator/router contract that all operations flow through. Index the mediator instead of individual vaults."

## Agent Skills Improvements
No new issues.

## Skills Patches Applied
No skill patches needed.
