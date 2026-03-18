# Output — Morpho Blue Market Activity & Lending Dynamics

## What happened

Scaffolded indexer using Pipes CLI with the Morpho Blue singleton contract (`0xBBBBBbbBBb9cc5e90e3b3Af64bDAF62C37EEFFCb`). The CLI correctly auto-detected the full ABI from the deployed contract, including all 17 events and all functions. We selectively index only Supply, Borrow, and Liquidate events into 3 separate tables.

## Key decisions

1. **Three separate tables** — Supply, Borrow, and Liquidate are stored in separate ClickHouse tables rather than one unified table. This allows table-specific schemas (Liquidate has 8 event params vs Supply's 5) and cleaner queries. The dashboard unions them where needed.

2. **Market ID as bytes32** — Morpho Blue markets are identified by a keccak256 hash of (loanToken, collateralToken, oracle, irm, lltv). The `id` field is stored as `FixedString(66)` (hex with 0x prefix). The dashboard shows first 10 chars for readability since the full hash is not human-readable (unlike MakerDAO ilks which decode to ASCII).

3. **Weekly aggregation for charts** — Supply and Borrow events are high-volume (thousands per day once the protocol matures). Weekly aggregation keeps the charts readable while still showing trends. Liquidations are less frequent so weekly works well there too.

4. **Bad debt tracking** — Liquidate events include `badDebtAssets` and `badDebtShares` fields. The dashboard highlights weeks where bad debt occurred using a separate bar series, which is critical for monitoring protocol health.

5. **Database name** — Uses `morpho_blue` as dedicated database to avoid sync table conflicts.

## Issues resolved

- CLI generated docker-compose without persistent volume or CORS config — fixed manually.
- CLI used default `pipes` database name — changed to `morpho_blue`.
- The contract is NOT a proxy (immutable singleton), so the CLI correctly fetched the full ABI directly without needing implementation address lookup.
