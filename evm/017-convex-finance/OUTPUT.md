# Convex Finance — Generation Output

## Angle Chosen
**Curve LP staking flows** — deposits and withdrawals across Convex Booster pools showing how Curve liquidity is being boosted over time.

## Why This Angle
Convex is the largest CRV governance layer. The Booster contract's Deposited/Withdrawn events tell the full story of how much Curve LP capital flows through Convex for boosted rewards. The 4-year time series shows Convex's rise and the DeFi yield landscape evolution.

## Key Decisions
- **Booster contract directly**: NOT a proxy — typegen worked first try.
- **Pool ID instead of amounts**: Used `pool_id` as the main dimension. Amounts are in LP token units which differ per pool — using counts is more meaningful.
- **Start block 12450000**: Convex Booster deployed May 2021. Full history.
- **418 unique pools**: Convex has one of the largest pool ecosystems in DeFi.

## Issues Encountered
- None. Clean generation — direct contract, well-documented events, good activity.

## Data Quality
- 269K+ events across ~4 years (May 2021 → Mar 2025)
- 148K deposits, 121K withdrawals
- 418 unique pools, 24K unique users
- Portal cross-reference: exact match (179/179)
- 3/3 spot-checks confirmed
