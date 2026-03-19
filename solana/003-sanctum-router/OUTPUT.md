# Output — Sanctum Router LST Swap Flow

## Angle
Track how stake flows between validator LSTs via Sanctum's infrastructure on Solana. Sanctum enables every validator to have its own liquid staking token — this indexer captures activity across the Router (LST-to-LST swaps), Infinity pool (multi-LST AMM), and Unstake program (instant unstaking).

## Key Decisions

1. **Pivoted from Router-only to all 3 programs** — The Router program (`stkitrT1Uoy18Dk1fTrgPw8W6MVzoCfYoAFT4MLsmhq`) only has ~2 instructions per 1,000 slots. The S Controller (Infinity pool, `5ocnV1qiCgaQR8Jb8xWnVbApfaygJ8tNoZfgPwsgx9kx`) has orders of magnitude more activity. Combined with the Unstake program, we get a complete picture.

2. **LST mint extraction from account layout** — For S Controller instructions, account[0] is the LST mint. For Router, account[6] is the source LST. For Unstake, we take the first non-system account.

3. **1,021 unique validator LSTs discovered** — Sanctum's ecosystem is much larger than expected. Over 1K distinct LST mints appeared in just 3 days of data.

## Issues Encountered

- **Sync table in ClickHouse** — Pipes SDK stores sync cursor in a `sync` table in the same ClickHouse database. When resetting, you must `DROP TABLE sync` along with truncating data tables, or the indexer resumes from the old cursor.
- **Low Router volume** — Initial assumption that the Router would be high-volume was wrong. Most Sanctum activity goes through the S Controller (Infinity pool) or Unstake program. Always verify instruction volume before committing to a program ID.
- **Portal field validation** — Solana transaction fields differ from what might be expected. `signature` is not a valid field — use `signatures` (array). This caused an initial Portal query error.

## Results
- 11,270 actions indexed across 3 programs
- 1,021 unique validator LSTs
- 2,500+ unique users
- 3 days of data (Dec 26-29, 2024)
- All 12 validation checks pass
