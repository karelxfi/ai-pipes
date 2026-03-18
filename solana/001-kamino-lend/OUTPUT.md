# Output — Kamino Lend Solana Indexer

## What happened

This is the first Solana indexer in the ai-pipes collection. The approach differs fundamentally from EVM indexers.

## Key decisions

### CLI scaffolding failed
The Pipes CLI (`@iankressin/pipes-cli`) does not support `svm` + `custom` template combination. It throws `Invalid input: expected array, received undefined` during init. The project was scaffolded manually using the EVM example as a structural reference.

### Custom transformer instead of `solanaInstructionDecoder`
The SDK's `solanaInstructionDecoder` requires full ABI instruction definitions with borsh decoders (a `decode` method that parses instruction data). Since our angle only needs to **classify** instructions by their d8 discriminator (not decode the full data payload), we used `createTransformer` directly with a custom `query` + `transform` function. This:
1. Adds instruction filters for the Kamino program ID + all 5 d8 discriminators
2. In the transform phase, reads each instruction's base58-encoded data, extracts the first 8 bytes as hex, and maps to action type

### Base58 decoding
Solana Portal returns instruction data as base58 strings. We implemented a minimal base58 decoder to extract the d8 discriminator bytes. This avoids adding `bs58` as a dependency.

### Fee payer extraction
On Solana, the fee payer is `accountKeys[0]` on the transaction. We request `accountKeys` in the field selection and use the first entry. This gives us the actual wallet address for unique user tracking.

### Single table design
All 5 action types go into one `kamino_actions` table with a `LowCardinality(String)` action column. This keeps queries simple for the dashboard and makes cross-action analysis easy.

## Issues

1. **CLI does not support SVM custom template** — needs fix upstream
2. **No Solana ABI generation** — unlike EVM where typegen creates typed decoders from ABIs, Solana Anchor IDLs would need a separate tool to generate Pipes-compatible instruction definitions
3. **Instruction data not decoded** — we only classify by discriminator. To get amounts/accounts would need borsh schema definitions for each instruction
