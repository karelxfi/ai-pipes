# Improvements — Beefy (051)

## CLAUDE.md improvements needed

1. **Large address list pattern** — When a protocol has hundreds of contracts (vault aggregators, factory-deployed pools), document the pattern: fetch addresses from protocol API, save as JSON, import into indexer. The evmDecoder handles large address arrays well (89 addresses worked fine).

## generate-indexer skill improvements

1. **No new issues** — The manual workflow with API-fetched vault addresses was clean.

## Dashboard template improvements

1. **Dual-axis chart** — The daily activity chart uses a bar+line combo (vault deposits/withdraws as bars, BIFI as line overlay). This pattern is useful for multi-source data with different scales.
