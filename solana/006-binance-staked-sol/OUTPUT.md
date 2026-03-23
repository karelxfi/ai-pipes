# Output: SPL Stake Pool Indexer — Proof of Concept

## Purpose

Prove that "Solana Stake Pool programs not indexable" (CLI_IMPROVEMENTS.md issue #12) is wrong. SPL Stake Pool operations ARE indexable via instruction-level filtering with d1 discriminators.

## What Works

- **d1 discriminator filtering**: SPL Stake Pool uses single-byte enum discriminators (not Anchor d8). Portal supports `d1` filtering natively.
- **Borsh decoding**: Amounts are u64 little-endian after the d1 byte. Manual decoding is straightforward.
- **Multi-pool capture**: A single indexer captures operations across ALL SPL stake pools (Jito, BNSOL, and 16 others) without needing pool-specific addresses.
- **Pool identification**: The pool account is always at `a0` (first account in the instruction), making it easy to identify which pool each operation belongs to.

## What Doesn't Work

- **typegen**: `@subsquid/solana-typegen` only works with Anchor IDLs. SPL Stake Pool uses a custom Borsh layout, so decoding must be manual.
- **Volume**: SPL Stake Pool has very low on-chain instruction volume (~170 user-facing ops per 5M slots / ~27 days). Most liquid staking flows through aggregators or off-chain systems. BNSOL specifically had zero on-chain activity in our 1M-slot sample.
- **Individual pool filtering**: While technically possible (filter by `a0`), most individual pools have too few instructions to build meaningful dashboards.

## Data Summary

- 4,234 operations across 18 pools in Jun 5-6, 2024
- Instruction types: WithdrawSol (50%), DepositStake (19%), WithdrawStake (17%), DepositSol (13%)
- Jito dominates (~70% of all SPL Stake Pool activity)
- Validation: 10/10 pass, Portal cross-reference confirms data is flowing

## Conclusion

SPL Stake Pool programs are indexable. The issue was never technical — it's that the volume is genuinely low for individual pools. The pattern works but produces sparse data.
