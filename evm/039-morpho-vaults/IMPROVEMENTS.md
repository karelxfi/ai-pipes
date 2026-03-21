# Improvements — MetaMorpho Vaults

## Skills patches applied

No skill patches needed. The existing skills handled this case well:
- `pipes-new-indexer` correctly documents topic0-only filtering (omit `contracts` from `evmDecoder`)
- Portal query tools worked correctly for event counting and cross-reference
- The SDK 1.0.0-alpha.1 pattern with `outputs` is well-documented

## CLAUDE.md improvements

None needed. The Bloomberg dashboard style guide, topic0 filtering pattern, and validation workflow all worked as documented.

## Dashboard patterns

- The stacked bar chart for supply vs withdraw reallocations works well to show both volume and ratio over time
- Horizontal bar charts for top vaults/markets/allocators with truncated hex addresses are readable at 9px

## What worked well

- Topic0-only filtering captured events across 92 vaults without needing any address list
- The `evmDecoder` approach with no `contracts` array is clean and reliable
- Portal cross-reference showed 0.0% diff — perfect match
- Puppeteer screenshot capture at 1200x675 worked cleanly
