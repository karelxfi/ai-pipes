# Output: Jupiter Perpetual Exchange — Position Lifecycle

## Angle

Full position lifecycle on Jupiter Perps — opens, closes, liquidations, TP/SL orders, and limit orders across all markets.

## Key Decisions

1. **On-chain IDL typegen** — `npx squid-solana-typegen src/abi PERPHjGBqRHArX4DySjwM6UJHiR3sWAatqfdBS2qQJu#perpetuals` fetched the IDL directly and generated typed decoders for 60+ instructions.

2. **11 position instructions decoded** — each with its own typed `decode()` call. No fallback/catchall — every tracked instruction is properly decoded with typed accounts and data fields.

3. **Keeper model architecture** — Jupiter Perps uses a 2-step keeper model: traders submit requests (createDecreasePositionMarketRequest, closePositionRequest2), then keepers execute (increasePosition4, decreasePosition4). Both are tracked.

4. **Side extraction** — Only instructions that create new positions carry `side` (Long/Short). Close/decrease/TPSL operations act on existing positions and don't specify side — these correctly show as `n/a`.

## Data Summary

- 63.5K position operations in Dec 7-8 2025 (~1.5 days)
- 11 action types: open_position (19%), close_request (16%), create_tpsl (10%), close_position (9%), increase_preswap (9%), etc.
- 1.7K liquidations
- Long/Short ratio: 66/34 — longs dominate
- Validation: 11/11 pass

## Issues

- d8 `0xe445a52e51cb9a1d` (174 occurrences in 10K slots) not in on-chain IDL — likely a newer instruction added after the IDL was published. These are skipped rather than decoded with a fallback.
