# Improvements — Kamino Lend Solana Indexer

## Pipes CLI issues

1. **SVM custom template broken** — `npx @iankressin/pipes-cli@latest init` with `networkType: "svm"` and `templateId: "custom"` fails with `Invalid input: expected array, received undefined`. The CLI likely expects template params that don't exist for the custom SVM path. Fix: add a working `custom` template for SVM in the CLI, or at minimum generate the boilerplate files (package.json, tsconfig, docker-compose, .env).

2. **No Solana ABI/IDL tooling** — EVM has `@subsquid/evm-typegen` to generate typed event/function decoders from ABIs. Solana needs an equivalent that takes an Anchor IDL and generates Pipes-compatible instruction definitions (with d8 discriminators, account maps, and borsh codecs). Without this, every Solana indexer requires manual instruction definition.

## CLAUDE.md improvements

3. **Add Solana-specific section** — CLAUDE.md should document:
   - How Solana Pipes indexers work (solanaPortalSource, SolanaQueryBuilder, d8 discriminators)
   - How to use `createTransformer` for custom classification without full ABI decoding
   - Base58 data handling patterns
   - Fee payer extraction (`accountKeys[0]`)
   - Slot vs block terminology

4. **Add example of custom transformer pattern** — The current CLAUDE.md only shows the `evmDecoder` pattern. Solana often needs raw transformer access since Anchor IDL tooling doesn't exist yet.

## Agent skills

5. **pipes-new-indexer skill needs Solana path** — The skill should detect SVM projects and adjust its scaffolding accordingly (no ABI, use d8 discriminators, different field names like slot instead of block_number).

## Data findings

8. **Borrow/repay/liquidate discriminators returned zero results** — The computed Anchor discriminators for `borrow_obligation_liquidity`, `repay_obligation_liquidity`, and `liquidate_obligation_and_redeem_reserve_collateral` matched zero instructions on-chain. Either Kamino uses different instruction names internally, or these actions go through CPI (inner instructions) from a different entry point. The actual top discriminators on-chain are dominated by `refreshReserve`/`refreshObligation` maintenance calls. Future Solana indexers should first discover actual discriminators by querying a broad sample from Portal, then map them to actions.

## Pipes SDK

6. **`solanaInstructionDecoder` needs a "classify-only" mode** — Currently it requires a full `decode` method on each instruction. A lighter-weight API that just classifies by d8 and returns raw instruction data (without borsh decoding) would cover the common "count by action type" use case.

7. **Add `feePayer` field to Transaction** — While `accountKeys[0]` works, having an explicit `feePayer` field would be cleaner and avoid the need to request the full `accountKeys` array.
