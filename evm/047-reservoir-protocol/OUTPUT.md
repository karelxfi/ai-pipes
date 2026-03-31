# Reservoir Protocol — PSM Stablecoin Pulse

## What happened

Reservoir Protocol is a CDP protocol on Ethereum that issues rUSD stablecoin via Peg Stability Modules (PSMs). Built an indexer tracking all four core PSM events (Mint, Redeem, Allocate, Withdraw) across three PSM contracts (USDC, USDT, USD1).

## Key decisions

1. **Angle: Multi-PSM tracking** — Rather than indexing a single contract, indexed all three PSMs together to give a complete picture of rUSD stablecoin flows. The USDC PSM dominates (~98% of activity) but USD1 and USDT PSMs provide additional context.

2. **90-day lookback** — Protocol has low activity (~65 events/day across all PSMs), so used 90-day lookback to accumulate 5,000+ rows for meaningful dashboard visualizations.

3. **Per-PSM decimal handling** — USD1 uses 18 decimals while USDC/USDT use 6 decimals. Built a `toUsd()` helper that maps PSM contract address → decimal count. Initial run had wrong USD values ($67 quadrillion!) because all amounts were divided by 1e6. Fixed by checking PSM-specific decimals.

4. **Portal cross-ref block windowing** — Used mid-range 2K-block window for Portal cross-reference. Larger windows (5K+) caused count mismatches due to known Portal Stream API truncation on sparse data.

## Issues resolved

- PSM contract ABI was fetched successfully from Etherscan (verified contract, no proxy issues)
- Portal 503 errors near the chain tip — transient issue, the SDK auto-retries with exponential backoff
- USD amount calculation required per-PSM decimal mapping (USDC=6, USDT=6, USD1=18)

## Results

- 5,089 rows indexed over ~75 days (Dec 31, 2025 → Mar 14, 2026)
- $257M minted, $180M redeemed, +$76.8M net positive flow
- 115 unique addresses interacting with PSMs
- Validation: 15/15 checks passed, Portal cross-reference exact match (0.0% diff)
