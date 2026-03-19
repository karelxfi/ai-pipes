# Hyperliquid Perps Majors — Improvements

## CLAUDE.md Improvements
- Add note: for very high-volume data (Hyperliquid fills: 900K+/day per coin), use sub-daily chart granularity (6-hour or hourly) if the time range is short. Daily bars with <7 days of data look ugly.
- Add note: Hyperliquid indexers don't need contracts.json since HL is an L1 with no traditional smart contracts.

## CLI Improvements
- No CLI template for Hyperliquid. Manual setup required — but the pipes-new-indexer skill documents it well.

## Agent Skills Improvements
- The Hyperliquid guide could mention that long syncs (>30 days for popular coins) may crash due to memory pressure. Consider limiting to 7-14 days for 3+ coins, or use fewer coins for longer ranges.

## Skills Patches Applied
No skill patches needed — the manual Hyperliquid setup from the skill worked correctly.

## Skipped Protocols Note
Several Solana liquid staking protocols (DoubleZero, Sanctum, Jito, Jupiter Staked SOL, etc.) were skipped because they all use Solana's native Stake Pool program which doesn't emit traditional events. These need a different indexing approach (instruction-level analysis).
