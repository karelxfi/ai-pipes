# 056 — infiniFi Reserve Pulse

![Dashboard](dashboard/screenshot.png)

## Angle

**Reserve Pulse** — Tracks iUSD mints/burns/transfers and siUSD ERC-4626 vault deposits/withdrawals to visualize the heartbeat of infiniFi's on-chain fractional reserve banking protocol.

## Verification Report

```
=== infiniFi Reserve Pulse — Validation ===

--- Phase 1: Structural Checks ---
PASS: Structural - iusd_transfers has 70728 rows
PASS: Structural - siusd_vault has 7173 rows
PASS: Schema - iusd_transfers.transfer_type exists
PASS: Schema - iusd_transfers.from_addr exists
PASS: Schema - iusd_transfers.to_addr exists
PASS: Schema - iusd_transfers.value exists
PASS: Schema - iusd_transfers.block_number exists
PASS: Schema - iusd_transfers.tx_hash exists
PASS: Schema - iusd_transfers.timestamp exists
PASS: Timestamps - 2025-07-26 01:34:47 to 2026-03-26 19:14:35
PASS: Distribution - transfer: 56900
PASS: Distribution - mint: 8513
PASS: Distribution - burn: 5315

--- Phase 2: Portal Cross-Reference ---
PASS: Portal cross-ref - ClickHouse: 174, Portal: 174 (0.0% diff, within 5% tolerance) [blocks 23871908-23876908]
PASS: Portal cross-ref siUSD - ClickHouse: 12, Portal: 12 (0.0% diff)

--- Phase 3: Transaction Spot-Checks ---
PASS: Spot-check tx 0x92c5c728... - block 23000814, mint, from/to match Portal
PASS: Spot-check tx 0xc022fc5c... - block 23001066, mint, from/to match Portal
PASS: Spot-check tx 0x78ca7a6d... - block 23001272, mint, from/to match Portal

=== Results: 18 passed, 0 failed ===
```

## Run

```bash
docker compose up -d
npm install
npm start
# Wait for sync (~15 min from block 23000000)
npx tsx validate.ts
open dashboard/index.html
```

## Sample ClickHouse Queries

```sql
-- Daily mint/burn counts
SELECT toDate(timestamp) AS d, transfer_type, count() AS cnt
FROM iusd_transfers
WHERE transfer_type IN ('mint', 'burn')
GROUP BY d, transfer_type
ORDER BY d;

-- Top mint recipients
SELECT to_addr, count() AS mints
FROM iusd_transfers
WHERE transfer_type = 'mint'
GROUP BY to_addr
ORDER BY mints DESC
LIMIT 10;

-- siUSD vault deposit volume by day
SELECT toDate(timestamp) AS d, count() AS deposits, sum(toUInt256(assets)) / 1e18 AS total_assets
FROM siusd_vault
WHERE event_type = 'deposit'
GROUP BY d
ORDER BY d;
```

## Contracts

| Contract | Address | Type |
|----------|---------|------|
| iUSD | `0x48f9e38f3070ad8945dfeae3fa70987722e3d89c` | ReceiptToken (ERC-20) |
| siUSD | `0xDBDC1Ef57537E34680B898E1FEBD3D68c7389bCB` | Staked iUSD (ERC-4626) |
| liUSD-1w | `0x12b004719fb632f1e7c010c6f5d6009fb4258442` | Locked iUSD (1 week) |
