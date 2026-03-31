# Improvements — Aster asBNB (048)

## CLAUDE.md improvements needed

1. **BSC sync time warning** — BSC has 3-second blocks, making 90-day lookbacks (2.6M blocks) take over an hour. CLAUDE.md should warn: "For BSC/BNB chain, reduce LOOKBACK_DAYS to 7-30 depending on event frequency. BSC has ~28,800 blocks/day vs Ethereum's ~7,200."

2. **ERC1967 proxy with unverified source** — When the proxy contract isn't verified but the implementation is, typegen should target the implementation address. Add this as an explicit workflow variant alongside the existing proxy guidance.

## generate-indexer skill improvements

1. **No new issues** — Manual workflow was appropriate for this multi-contract pattern.

## Dashboard template improvements

1. **Net flow with directional color** — The green (positive)/red (negative) net flow stat is a recurring pattern for liquid staking and CDP protocols. Could standardize this in the template.
