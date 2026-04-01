# Frax Ether — Liquid Staking Pulse

## Results
- 74,010 rows over 85 days (Jan 1 – Mar 26, 2026)
- frxETH: 68,482 events (92.2%), sfrxETH: 5,528 events
- 3,992.9 ETH staked into sfrxETH via minting
- frxETH minter contract has 0 activity — minting now happens via other paths
- 16/16 validation passed, Portal exact match (113 vs 113)

## Key decisions
- **Dual-token tracking** — frxETH (liquid ETH derivative) + sfrxETH (ERC-4626 yield vault)
- **90-day lookback** — frxETH is surprisingly active in DeFi with ~800 transfers/day
- **sfrxETH stake/unstake** — Classified via mint (from zero = deposit) and burn (to zero = withdrawal)
