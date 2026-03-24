# Improvements — Drift Trade

## CLAUDE.md Improvements

- **Add Anchor discriminator computation pattern:** Document that Anchor programs use `SHA256("global:<instruction_name>")[0:8]` as instruction discriminators. This is critical for filtering Solana instructions by type. Include a code snippet for computing them.
- **Add high-volume indexer guidance:** When expecting 1M+ rows, document best practices for ClickHouse partitioning (by day) and order keys to keep insert and query performance acceptable.

## Agent Skills Improvements

- **Solana instruction filtering skill should mention Anchor discriminators:** The current skill docs focus on raw program_id filtering but don't explain how to compute or use d8 discriminators for Anchor programs. This is the most common pattern on Solana.

## Dashboard Patterns That Worked

- **Order flow breakdown treemap:** Treemap of instruction types by count clearly shows the dominance of cancels vs fills.
- **Liquidation timeline:** Separate panel for liquidations per hour highlights volatility-correlated spikes.
- **Cancel-to-fill ratio KPI:** A single stat showing 19:1 ratio immediately communicates the market microstructure.
- **Horizontal bar chart for top instruction types:** Ranked by count with monospace value labels — clean and readable.

## Key Learnings

1. **Anchor d8 discriminator pattern:** This is the standard for ~90% of Solana programs. Computing `SHA256("global:instruction_name")[0:8]` is essential for instruction-level filtering. Should be a first-class pattern in the skills.
2. **Cancel dominance in perp DEXes:** Order cancellations vastly outnumber fills — this is normal market maker behavior, not a data quality issue.
3. **Rate limiting with concurrent indexers:** Running multiple Solana indexers simultaneously can hit Portal rate limits. Stagger starts or reduce concurrency.
