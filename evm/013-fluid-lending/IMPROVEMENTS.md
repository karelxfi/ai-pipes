# Fluid Lending — Improvements

## CLAUDE.md Improvements
- Add note about **unified operation events**: Some protocols (Fluid) use a single event with signed int256 amounts to capture all operations. Positive = deposit/borrow, negative = withdraw/repay. This is more efficient than separate events.

## CLI Improvements
- Proxy ABI (9/14 now). Fluid Liquidity is another proxy where typegen returns only admin events.

## Agent Skills Improvements
- No new issues.

## Skills Patches Applied
No skill patches needed.
