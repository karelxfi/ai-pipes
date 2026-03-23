# Output: Jito Liquid Staking — MEV Tip Distribution Claims

## Angle

Jito MEV Tip Distribution claims — tracking validator reward distributions via merkle proofs on the Tip Distribution program.

## Why This Angle

The Jito stake pool itself (SPL Stake Pool program) has very low instruction volume (~18 instructions per 100K slots). The real action is in the **Tip Distribution Program** (`4R3gSG8BpU4t19KYj8CfnbtRpnT8gtk4dvTHxVRwc2r7`) where MEV tips collected from searchers are distributed to validators via merkle proofs. This program processes ~6,600 claim instructions per 10K slots — massive volume and unique to Jito's MEV infrastructure.

## Key Decisions

1. **Used `@subsquid/solana-typegen`** to generate typed decoders from the on-chain Anchor IDL. This was the first Solana indexer in the repo to use typegen successfully — previous indexers manually computed discriminators and decoded raw hex.

2. **Typed decode vs manual parsing**: The generated `instructions.claim.decode(ins)` returns `{ accounts: { claimant, payer, tipDistributionAccount, ... }, data: { bump, amount, proof } }` — fully typed with named accounts and decoded parameters. No manual base58 decoding needed.

3. **Start slot 300M**: Claims before this are less dense. Starting from ~Oct 2024 gives high-volume data quickly.

4. **Single claimant pattern**: All 332K claims came from a single address (`GZctHpWX...`). This is expected — Jito uses an automated claiming bot that processes merkle proofs for all validators. The interesting dimension is `tip_distribution_account` (1,118 unique).

## Issues Encountered

- **No initial data for first 2 minutes**: Claims are extremely bursty (thousands in a few slots, then gaps of 10K+ slots). The indexer appeared to have 0 rows for the first 2 minutes while syncing through a gap.
- **Portal cross-reference window sizing**: A 10K slot window had 50K claims — too many for Portal's response. Reduced to 1K slot window for exact match (2,052 = 2,052).

## Typegen Success

This validates the Solana typegen workflow added to agent-skills in the previous commit:
```bash
npx squid-solana-typegen src/abi 4R3gSG8BpU4t19KYj8CfnbtRpnT8gtk4dvTHxVRwc2r7#jito-tip-distribution
```
Generated typed decoders for 9 instructions and 8 events, including the `claim` instruction with full account and data typing.
