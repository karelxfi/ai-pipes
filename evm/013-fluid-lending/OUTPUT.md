# Fluid Lending — Generation Output

## Angle Chosen
**Liquidity Layer operations** — tracking all supply/withdraw/borrow/repay through Fluid's unified LogOperate event, classified by the sign of supplyAmount and borrowAmount.

## Why This Angle
Fluid has a unique architecture — a single Liquidity contract processes ALL operations for ALL tokens. One event (LogOperate) captures everything. The `user` field is actually the protocol (fToken, Vault) that triggered the operation, not the end user. This gives a protocol-level view of capital flows.

## Key Decisions
- **Manual event definition**: Liquidity contract is a proxy with admin-only events. Had to manually define `LogOperate` with verified topic0.
- **Action classification**: Used `supplyAmount > 0 → supply`, `supplyAmount < 0 → withdraw`, `borrowAmount > 0 → borrow`, `borrowAmount < 0 → repay` from the signed int256 values.
- **Token name mapping**: Added 13 common Ethereum token addresses → symbols. Unknown tokens show truncated addresses.
- **Start block 18900000**: Fluid Liquidity deployed late 2023.

## Issues Encountered
- Proxy ABI again (9/14 now). Liquidity contract's typegen only returned admin events.
- The `user` field in LogOperate is the calling protocol contract (fToken, Vault), not the end user. This is actually more interesting — shows which Fluid protocols generate the most activity.

## Data Quality
- 737K+ operations across ~13 months (Feb 2024 → Mar 2025)
- 23 tokens, 121 protocols interacting
- USDC and ETH dominate, massive growth in late 2024
- Portal cross-reference: exact match (180/180)
- 3/3 spot-checks confirmed
