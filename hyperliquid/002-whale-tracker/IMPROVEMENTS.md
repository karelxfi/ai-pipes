# Improvements — Hyperliquid Whale Tracker

## Agent Skills Improvements

### portal-query-hyperliquid-fills: undocumented direction types
- **Source:** hyperliquid/002-whale-tracker
- **Issue:** Skill documents 4 `dir` values (Open Long, Open Short, Close Long, Close Short). Real data has 9: also "Long > Short", "Short > Long", "Buy", "Sell", "Net Child Vaults".
- **Fix:** Update the Fill Fields Reference table with all 9 direction types.

## Skills Patches Applied
Patching portal-query-hyperliquid-fills with extended direction types.
