# Venus Core Pool — Improvements

## CLAUDE.md Improvements
- Add note about BSC sync speed: ~4x more blocks than Ethereum per time period due to 3s block times. Plan accordingly for sync duration.
- The Compound V2 fork pattern (Mint, Redeem, Borrow, RepayBorrow, LiquidateBorrow) is now confirmed working across chains (BSC in addition to Ethereum).

## CLI Improvements
- First successful non-Ethereum EVM indexer. CLI correctly sets the portal URL to `binance-mainnet` when `network: "binance-mainnet"` is specified. No issues.

## Agent Skills Improvements
- The fork patterns section should note that Compound V2 forks work identically on BSC (Venus) — same event signatures, no chain-specific quirks.

## Skills Patches Applied
No skill patches needed — clean generation on BSC.
