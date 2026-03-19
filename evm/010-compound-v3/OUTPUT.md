# Compound V3 — Generation Output

## Angle Chosen
**Multi-market lending flows** — tracking supply, withdraw, and collateral activity across Compound V3's isolated Comet markets (cUSDCv3 and cWETHv3).

## Why This Angle
Compound V3 (Comet) is a complete redesign — single-asset markets where each Comet has one borrowable base asset. This is fundamentally different from Aave/Compound V2's pooled model. Tracking both markets shows which base asset attracts more activity.

## Key Decisions
- **Two Comet markets**: cUSDCv3 (`0xc3d688...`) and cWETHv3 (`0xA17581...`) — both proxies sharing the same Comet implementation ABI.
- **4 action types**: Supply, Withdraw, SupplyCollateral, WithdrawCollateral — Compound V3 separates base asset supply from collateral supply, which is unique.
- **Implementation ABI**: Both proxies use the same Comet implementation. Generated types from `0xeB330B7c...`.
- **Start block 15300000**: cUSDCv3 deployed Aug 2022.

## Issues Encountered
- Proxy ABI resolution needed (as expected — 8/11 now).
- No other issues — Compound V3's event signatures are clean and well-documented.

## Data Quality
- 150K+ events across ~2.5 years (Aug 2022 → Mar 2025)
- cUSDCv3: 129K events (dominant), cWETHv3: 21K events
- 18K unique users
- Portal cross-reference: exact match (224/224)
- 3/3 spot-checks confirmed
