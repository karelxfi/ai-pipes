# Compound V2 — Wind-Down Pulse

## What happened

Built a multi-market indexer for Compound V2 on Ethereum, tracking all 5 Compound lending events across 17 cToken markets. The data reveals Compound V2 is in full wind-down mode: zero mints, zero borrows — only redeems (48.2%), repays (28%), and liquidations (23.8%).

## Key decisions

1. **Angle: Protocol wind-down visualization** — This is the most compelling angle for Compound V2. The OG lending protocol has moved to V3 (Comet), and V2 shows a pure exit pattern. A large liquidation cascade around Jan 25 created a dramatic spike.

2. **90-day lookback** — Initially tried 7 days (only 142 rows). Extended to 90 days for 8,206 rows — enough to show the wind-down trajectory over months.

3. **Reused Benqi ABI** — Compound V2 and Benqi share identical event signatures (Benqi is a Compound fork). Copied the QiToken types directly as CToken.

## Results

- 8,206 rows over 85 days (Jan 1 – Mar 26, 2026)
- 17 active cToken markets, 0 mints, 0 borrows
- 3,953 redeems, 2,296 repays, 1,957 liquidations
- 1,416 unique users still exiting positions
- Validation: 15/15 passed, Portal exact match
