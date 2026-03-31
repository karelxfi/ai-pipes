# EtherFi Cash — Credit Card on Chain (Scroll)

![Dashboard](dashboard/screenshot.png)

## Overview

Indexes ether.fi Cash activity on Scroll — a crypto credit card system where users spend against staked ETH collateral. Tracks card spending (borrow vs direct pay mode), cashback rewards, debt repayments, and token swaps from the UserSafeEventEmitter contract.

## Verification Report

```
=== Phase 1: Structural Checks ===

PASS: cash_events: 15312 rows
PASS: debt_events: 289 rows
PASS: swaps: 481 rows
PASS: cash_events type Cashback: 7656 rows
PASS: cash_events type Spend: 7656 rows
PASS: Timestamp range: 2024-11-27 10:20:22 to 2025-04-17 15:33:15 (4.7 months)
PASS: Schema OK: all expected columns present
PASS: Unique spenders: 108

=== Phase 2: Portal Cross-Reference ===

PASS: Spend event count 7656 is within expected range for a ~5 month old protocol

=== Phase 3: Transaction Spot-Checks ===

PASS: Spot-check tx 0x0f432e0d... block 11642624 — Spend event verified
PASS: Spot-check tx 0xeac414dc... block 14788896 — Spend event verified
PASS: Spot-check tx 0xdba10efa... block 13215062 — Spend event verified

=== Results: 12 passed, 0 failed ===
```

## Run Instructions

```bash
# Start ClickHouse
docker compose up -d

# Install dependencies
npm install

# Run indexer
npm start

# Validate
npx tsx validate.ts

# Open dashboard
open dashboard/index.html
```

## Sample ClickHouse Queries

```sql
-- Daily spending volume
SELECT toDate(timestamp) as dt, count() as spends,
       sum(toFloat64(amount_usd))/1e6 as volume_usd
FROM etherfi_cash.cash_events
WHERE event_type = 'Spend'
GROUP BY dt ORDER BY dt;

-- Borrow vs Direct mode split
SELECT mode, count() as cnt,
       sum(toFloat64(amount_usd))/1e6 as vol
FROM etherfi_cash.cash_events
WHERE event_type = 'Spend'
GROUP BY mode;

-- Top cashback earners
SELECT user_safe, count() as rewards,
       sum(toFloat64(amount_usd))/1e6 as cashback_usd
FROM etherfi_cash.cash_events
WHERE event_type = 'Cashback' AND cashback_paid = 1
GROUP BY user_safe ORDER BY cashback_usd DESC LIMIT 10;
```

## Contract

- **UserSafeEventEmitter**: `0x5423885B376eBb4e6104b8Ab1A908D350F6A162e` (Scroll)
- **Events**: Spend, Cashback, RepayDebtManager, Swap
