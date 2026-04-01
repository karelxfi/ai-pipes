# 062 — Avantis Perps Pulse

![Dashboard](dashboard/screenshot.png)

Perpetuals trading pulse indexer for **Avantis V1.5** on Base mainnet — tracking market orders, limit orders, TP/SL updates, and margin changes across 80+ trading pairs with up to 1000x leverage.

## Verification Report

```
=== AVANTIS PERPS PULSE VALIDATION ===

--- Phase 1: Structural Checks ---
PASS: market_orders has 40422 rows
PASS: limit_orders has 10761 rows
PASS: open_limits has 671 rows
PASS: margin_updates has 1530 rows
PASS: tp_updates has 16027 rows
PASS: sl_updates has 2537 rows
PASS: market_orders has column 'trader'
PASS: market_orders has column 'pair_index'
PASS: market_orders has column 'is_open'
PASS: market_orders has column 'order_id'
PASS: market_orders has column 'is_buy'
PASS: market_orders has column 'leverage'
PASS: market_orders has column 'block_number'
PASS: market_orders has column 'tx_hash'
PASS: market_orders has column 'timestamp'
PASS: Timestamps in expected range: 2026-03-25 to 2026-04-01 (7.0 days)
PASS: Leverage range valid: 1x to 1000x

--- Phase 2: Portal Cross-Reference ---
PASS: Portal cross-ref — ClickHouse: 17, Portal: 17 in blocks 43830437-43830537 (0.0% diff)

--- Phase 3: Transaction Spot-Checks ---
PASS: Spot-check tx 0x181121be... — block 43830437, trader 0xe8301b88..., pair 50 matches Portal
PASS: Spot-check tx 0xb77c99c3... — block 43830450, trader 0xe8301b88..., pair 50 matches Portal
PASS: Spot-check tx 0x36899796... — block 43830458, trader 0x8e1c4e0a..., pair 21 matches Portal

=== VALIDATION SUMMARY ===
PASSED: 21
FAILED: 0
```

## Run

```bash
docker compose up -d
npm install
npm start
```

## Sample ClickHouse Query

```sql
-- Top pairs by market order count (opens only)
SELECT pair_index, count() as cnt,
       sum(is_buy) as buys,
       count() - sum(is_buy) as sells,
       avg(leverage) / 1e10 as avg_leverage_x
FROM avantis.market_orders
WHERE is_open = 1
GROUP BY pair_index
ORDER BY cnt DESC
LIMIT 10
```
