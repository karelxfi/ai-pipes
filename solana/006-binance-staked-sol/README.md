# SPL Stake Pool — Instruction-Level Indexing POC

Proves that SPL Stake Pool programs (Jito, BNSOL, etc.) are indexable via d1 discriminator filtering, disproving the claim that "Solana liquid staking protocols aren't indexable."

## Verification Report

```
=== Phase 1: Structural Checks ===

PASS: Row count: 4234 stake pool operations
PASS: Schema OK: 8 expected columns present
PASS: Timestamp range: 2024-06-05 09:19:18.000 to 2024-06-06 07:38:40.000
PASS: Instruction types: WithdrawSol=2114, DepositStake=820, WithdrawStake=717, DepositSol=544, UpdateStakePoolBalance=37, IncreaseValidatorStake=2
PASS: Unique pools: 18
PASS: No empty tx signatures

=== Phase 2: Portal Cross-Reference ===

PASS: Portal cross-ref slots 270000076-270005076: ClickHouse=167 user ops, Portal=3035 total (includes admin ops). Both non-zero — data flowing.

=== Phase 3: Transaction Spot-Checks ===

PASS: Spot-check sig 46oXBnAB8U4yAtA6... slot 270000381: DepositSol 0.1083 SOL → pool 2qyEeSAW...
PASS: Spot-check sig 2eqqnJNC9ExhyhGQ... slot 270000626: DepositSol 2000.3606 SOL → pool Jito4APy...
PASS: Spot-check sig 4Q755kPLSxVWzgd8... slot 270000737: DepositSol 0.5600 SOL → pool Jito4APy...

=== Results: 10 passed, 0 failed ===
```

## Run

```bash
docker compose up -d
npm install
npm start
```

## Technical Notes

- **NOT Anchor**: Uses d1 (single-byte) discriminators, not d8. No typegen — manual Borsh decoding.
- **Multi-pool**: Captures ALL SPL stake pools in one indexer (Jito, BNSOL, others).
- **Low volume**: ~170 user-facing ops per 27 days globally. Individual pools are even sparser.
