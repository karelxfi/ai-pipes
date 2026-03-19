# Pendle Finance — Improvements

## CLAUDE.md Improvements
- Add a section on **Diamond proxy handling**: when `evm-typegen` returns an empty Contract class, the contract is likely a Diamond proxy. Document the manual event definition pattern with verified topic0 hashes.
- Add a note about **event signature version changes**: some protocols change event parameters across contract upgrades. The same event name can have different data layouts in different blocks. Need to handle this gracefully (try/catch or version detection).

## Agent Skills Improvements
- The `pipes-new-indexer` skill should mention Diamond proxy detection as a known issue. If the generated contract file has no `export const events`, it's likely a Diamond proxy.
- The ABI_GUIDE reference should include a section on manually defining events when typegen fails.

## Dashboard Patterns That Worked
- Treemap for swap type distribution is more visually interesting than a horizontal bar when there are only 2-3 categories
- 110K rows renders instantly in the dashboard — ClickHouse handles it well

## Skills Patches Applied
No skill patches needed — the Diamond proxy issue is already partially documented in the pipes-new-indexer skill under "Non-standard proxy patterns."
