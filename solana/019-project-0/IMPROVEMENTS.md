# Improvements — Project 0 (marginfi v2)

## CLAUDE.md improvements needed

1. **Solana Anchor discriminator computation**: Add a section showing how to compute d8 discriminators from instruction names. Currently not documented — had to figure out `SHA256("global:<ix_name>")[0..8]` pattern independently.

2. **Protocol rebrand awareness**: Could mention that DeFi protocols frequently rebrand (marginfi → Project 0, Lyra → Derive). When researching, check for rebrands in the DeFiLlama metadata.

3. **Bank/vault account extraction pattern**: For lending protocols on Solana, document the common account layout patterns. marginfi-v2 puts the bank at index 3 for most instructions but index 1 for liquidations. This is protocol-specific but the pattern of needing docs for account layouts is universal.

## generate-indexer command improvements

1. **Anchor IDL lookup**: The scaffolding could attempt to fetch the Anchor IDL from common locations (GitHub releases, verified programs on Anchor registry) to auto-populate discriminators.

2. **Solana program activity check**: Before scaffolding, query Portal for recent activity with the given program ID to validate it's active and estimate the right lookback window.

## Template improvements

1. **Solana bank/token resolution**: Dashboard template could include a utility for resolving Solana bank PDAs to human-readable token names. Currently showing truncated addresses.
