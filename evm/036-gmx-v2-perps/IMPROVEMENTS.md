# Improvements — GMX V2 Perps

## CLAUDE.md Improvements

### Add: Portal dataset name for Arbitrum
- **Issue:** Portal uses `arbitrum-one` not `arbitrum`. This caused a 404 error.
- **Fix:** Add to Known Issues or a dataset name reference: "Arbitrum = `arbitrum-one`, not `arbitrum`"

## Agent Skills Improvements

### portal-dataset-discovery: common dataset name aliases
- **Source:** evm/036-gmx-v2-perps
- **Issue:** Easy to guess wrong dataset names. `arbitrum` seems natural but the correct name is `arbitrum-one`.
- **Fix:** Add a quick-reference table of common chains and their Portal dataset names to the skill.

## Skills Patches Applied
No skill patches needed — the dataset name issue is a documentation improvement.
