# Ostium — RWA Perpetuals Pulse

## Results
- 15,329 rows in 5 days (Mar 27 – Apr 1, 2026)
- 5,908 market opens, 4,824 market closes, 1,932 automation events, 1,405 limit orders
- 55 distinct trading pairs, 855 unique traders
- 14/14 validation passed, Portal exact match (2 vs 2)

## Key decisions
- **5-day lookback** — Ostium is extremely active (~3K events/day on Arbitrum). 5 days gives 15K+ rows.
- **8 event types tracked** — full trading lifecycle: market open/close, limit place/cancel/update, automation open/close, delegate added
- **ERC-1967 proxy resolution** — Trading contract is a TransparentUpgradeableProxy. Generated types from implementation `0xde48b32e...`.
- **Pair index tracking** — Each trade references a pair_index (0-54) representing different RWA assets (gold, oil, FX pairs, stock indices).
