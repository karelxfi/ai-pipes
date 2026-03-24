# Improvements — Kamino Liquidity

## CLAUDE.md Improvements

- **Add guidance for programs with many instruction types:** When a program has 20+ instruction types, document how to systematically enumerate and compute all discriminators. Include a script pattern for batch computation from an IDL.
- **Add Kamino/CLMM pattern:** Concentrated liquidity management involves invest, deposit, withdraw, rebalance, and fee collection. This multi-instruction pattern should be documented as it applies to other CLMM protocols too (Orca Whirlpool, Raydium CLMM).

## Agent Skills Improvements

- **Anchor IDL to discriminator mapping tool:** A skill that takes an Anchor IDL and outputs all d8 discriminators would save significant manual work. Currently each discriminator must be computed individually via SHA256.
- **Document d8 filter array limits:** When passing 23+ discriminators to `portal_query_solana_instructions`, verify that the Portal API handles large filter arrays correctly. No issues were observed, but the limit should be documented.

## Dashboard Patterns That Worked

- **Treemap for instruction type distribution:** With 6 instruction types of vastly different frequencies, a treemap clearly shows the proportional breakdown.
- **Daily activity heatmap:** Color-coded grid of instruction types by day reveals operational patterns (e.g., rebalances clustered at specific times).
- **Invest dominance KPI:** Showing "73% Invest" as a headline stat immediately communicates Kamino's automated nature.

## Key Learnings

1. **Broad discriminator coverage pays off:** Tracking 23 instructions instead of just 3-4 reveals the full protocol lifecycle. The SwapRewards instruction (only 7 events) still tells an important story about fee compounding.
2. **Anchor discriminator computation at scale:** For programs with many instructions, a systematic approach is needed — enumerate all instruction names from the IDL, compute SHA256 for each, take first 8 bytes. Should be automated.
3. **CLMM protocols have complex instruction sets:** Unlike simple swap or staking protocols, concentrated liquidity managers like Kamino have rebalance, compound, and position management instructions that are essential to track for a complete picture.
4. **Running multiple Solana indexers:** When running 5 indexers concurrently, Portal rate limits can cause intermittent failures. Stagger indexer starts by 30-60 seconds to avoid burst rate limiting.
