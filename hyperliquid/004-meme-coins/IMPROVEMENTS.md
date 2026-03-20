# Improvements — Hyperliquid Meme Coins

## Agent Skills Improvements

### portal-query-hyperliquid-fills: fills may return only one side
- **Source:** hyperliquid/004-meme-coins
- **Issue:** All 586K meme coin fills have side="A" (Sell). The fills API may return only one counterparty per fill for certain coins. The `dir` field still provides position context.
- **Fix:** Add a note that `side` may not always contain both B and A values — rely on `dir` for position direction analysis.

## Skills Patches Applied
No skill patches needed — this is a minor data characteristic note, not a workflow issue.
