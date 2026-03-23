# Output: Jupiter Lend — Liquidity Operations

## Angle

Jupiter Lend liquidity operations — tracking supply, borrow, withdraw, and payback flows through the unified `operate` instruction on the core Liquidity program.

## Why This Angle

Jupiter Lend uses a unique architecture: a single `operate` instruction on the Liquidity program handles all four operation types via signed i128 amounts (`supplyAmount` positive=supply, negative=withdraw; `borrowAmount` positive=borrow, negative=payback). This is called via CPI from the user-facing Lending (Earn) and Vaults (Borrow) programs.

## Key Decisions

1. **Used `@subsquid/solana-typegen` with GitHub IDLs** — the on-chain IDL fetch failed (no on-chain IDL), but downloading from `jup-ag/jupiter-lend` GitHub repo worked. Generated typed decoders for all 3 programs (Liquidity, Lending, Vaults).

2. **innerInstructions: true is CRITICAL** — 100% of `operate` calls are CPI (inner instructions) from Lending/Vaults. Without this flag, zero data is captured. This was discovered via Portal cross-reference showing 502 instructions where ClickHouse had 0.

3. **Operation type classification** — Derived from the sign of `supplyAmount` and `borrowAmount`: positive supply = supply, negative supply = withdraw, positive borrow = borrow, negative borrow = payback. Combined operations (supply+borrow) are also tracked.

4. **Start slot 375M** — Activity is sparse before 375M (~Oct 2025). Volume peaks around 380M with 1,242 instructions per 10K slots across all 3 programs.

## Issues Encountered

- **On-chain IDL not available**: `npx squid-solana-typegen src/abi jupeiUmn...#liquidity` failed. Had to download IDLs from GitHub.
- **100% CPI instructions**: Without `innerInstructions: true`, the indexer captured zero data. Portal cross-reference caught this immediately.
- **Int128 in ClickHouse**: ClickHouse supports `Int128` natively — no special handling needed for the signed amounts.

## Data Summary

- 33K operations across Oct 22-24, 2025
- 4 operation types: borrow (39%), payback (39%), supply (13%), withdraw (9%)
- 16 unique mints (SOL, USDC, USDT, JLP, JitoSOL, mSOL, etc.)
- Borrow/payback dominate — Jupiter Lend is primarily used for leveraged positions
