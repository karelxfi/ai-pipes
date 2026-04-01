# Improvements

## CLAUDE.md

- The treemap chart guidance says to use blue shades only, but commodity dashboards benefit from semantically meaningful colors (gold for XAU, silver for XAG). Could add a note: "semantic commodity/asset colors are acceptable when they aid recognition"
- Position size bucket queries using `multiIf` with `toFloat64` on String columns work but are verbose — could document a cleaner pattern

## generate-indexer / pipes-new-indexer

- When building a derivative indexer from an existing one (same contract, different filter), the workflow could be faster if there were a "fork from existing" template option
- The pair-index filtering pattern (decode all events, filter in onData) is common for multi-asset perps protocols — could be a documented pattern

## Agent Skills

- No issues encountered — Portal cross-reference worked well with the smaller block range (500 blocks vs 50K)
- The Portal stream API handles commodity pair filtering correctly when parsing raw event data bytes
