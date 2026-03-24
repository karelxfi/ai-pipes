# Improvements — Marinade Liquid Staking

## CLAUDE.md Improvements

- **Distinguish Anchor programs from SPL programs:** Document that some protocols (Marinade, Drift) have their own Anchor programs with unique program IDs, while others (Jupiter, Drift staked SOL) use the generic SPL Stake Pool program. The indexing approach differs significantly.
- **Add delayed unstake pattern:** Some protocols have multi-step withdrawal flows (order then claim). Document how to track these as linked operations.

## Agent Skills Improvements

- **No significant issues found.** The Solana instruction query skills worked well for Anchor program filtering with d8 discriminators.

## Dashboard Patterns That Worked

- **Staking lifecycle funnel:** Showing deposits -> liquid unstake -> delayed unstake -> claim as a flow gives insight into user preferences.
- **Deposit vs unstake daily bars:** Stacked bar chart clearly shows net flow direction each day.
- **Operation type distribution:** Horizontal bar chart showing that liquid_unstake is 74x more popular than delayed_unstake is a meaningful protocol insight.

## Key Learnings

1. **Marinade is a dedicated Anchor program:** Unlike jupSOL/dSOL which use SPL Stake Pool, Marinade has its own program ID. This makes filtering much simpler — no need for the mint/burn proxy pattern.
2. **Liquid unstake dominance:** Users overwhelmingly prefer instant liquid unstakes over delayed unstakes, despite the fee. This reveals user preference for immediacy over cost savings.
3. **Lower volume protocols still tell a story:** Even with only 1,535 rows, the ratio between operation types reveals meaningful protocol dynamics.
