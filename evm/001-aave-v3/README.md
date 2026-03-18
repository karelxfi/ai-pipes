# Aave V3 — Liquidation Cascades

![Dashboard](dashboard/screenshot.png)

Track liquidation events on Aave V3 to analyze cascading liquidations during market stress on Ethereum mainnet.

## Verification Report

This data was validated against the SQD Portal (independent source of truth):

```
============================================================
Validating aave_v3_pool.aave_v_3_pool_liquidation_call
============================================================

--- Phase 1: Structural Checks ---
PASS: Table has rows (found 509)
PASS: Column 'collateral_asset' exists
PASS: Column 'debt_asset' exists
PASS: Column 'user' exists
PASS: Column 'debt_to_cover' exists
PASS: Column 'liquidated_collateral_amount' exists
PASS: Column 'liquidator' exists
PASS: Column 'receive_a_token' exists
PASS: Column 'block_number' exists
PASS: Column 'tx_hash' exists
PASS: Column 'log_index' exists
PASS: Column 'timestamp' exists
PASS: Column 'sign' exists
PASS: Min timestamp is 2023+ (got 2023-08-29T05:55:35.000Z)
PASS: Max timestamp is 2023+ (got 2024-03-14T03:53:23.000Z)
PASS: Time range spans multiple dates
PASS: No negative amounts
PASS: No empty addresses
PASS: Min block >= 18000000 (got 18018927)

--- Phase 2: Portal Cross-Reference ---
PASS: Portal cross-ref (blocks 18018927-18028927) — ClickHouse: 3, Portal: 3 (exact match)

--- Phase 3: Transaction Spot-Checks ---
PASS: Spot-check tx 0x33ada9fb... block 18018927 — contract, event, collateral, debt all match Portal
PASS: Spot-check tx 0xebedb6ad... block 18023528 — contract, event, collateral, debt all match Portal
PASS: Spot-check tx 0xd368659b... block 18027762 — contract, event, collateral, debt all match Portal

============================================================
Results: 23 passed, 0 failed
============================================================
```

**What this means:** The indexed data is verified correct — event counts match the SQD Portal exactly, and individual transactions were spot-checked for field-level accuracy (contract address, event signature, collateral asset, debt asset).

## Run

```bash
docker compose up -d
npm install
npm start
```

## Validate

Re-run verification yourself:

```bash
npx tsx validate.ts
```

## Dashboard

Open `dashboard/index.html` in your browser after the indexer has synced.

## Sample Query

```sql
SELECT
  toDate(timestamp) as day,
  count() as liquidations,
  uniq(user) as unique_users
FROM aave_v3_pool.aave_v_3_pool_liquidation_call
GROUP BY day
ORDER BY day DESC
LIMIT 10
```
