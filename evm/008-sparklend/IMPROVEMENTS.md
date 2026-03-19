# SparkLend — Improvements

## CLAUDE.md Improvements
- The Aave V3 fork pattern is now well-established (Aave V3, SparkLend). Could add a note that any Aave V3 fork uses the same Pool ABI and event signatures — just swap the proxy address and implementation.

## Agent Skills Improvements
- No new issues discovered. The proxy ABI resolution workflow from pipes-new-indexer skill worked correctly on first try.

## Dashboard Patterns That Worked
- Token address → symbol mapping in dashboard JS is essential for readability. The map for common Ethereum tokens (DAI, WETH, wstETH, WBTC, USDC, USDT) should be a shared snippet.
- Action type treemap with color-coding by action works well for 4 categories.

## Skills Patches Applied
No skill patches needed — clean generation using established patterns.
