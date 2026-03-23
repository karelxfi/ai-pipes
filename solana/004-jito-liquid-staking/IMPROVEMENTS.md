# Improvements: Jito Liquid Staking

## Skills Patches Applied

The Solana typegen workflow was added to agent-skills in the immediately preceding commit (`36314dd`). This indexer validated that workflow end-to-end:
- `npx squid-solana-typegen` successfully fetched on-chain IDL
- Generated typed instruction decoders worked correctly with `SolanaQueryBuilder`
- `instructions.claim.decode(ins)` returned properly typed `{ accounts, data }`

No additional skill patches needed — the typegen documentation proved accurate.

## CLAUDE.md Improvements

- **Solana bursty data pattern**: Claims on Jito come in bursts of thousands per slot followed by gaps of 10K+ slots. When validating, use small Portal cross-reference windows (1K slots) to avoid Portal response truncation.
- **Portal response limits for high-volume Solana**: A 10K slot window with 50K instructions exceeds Portal streaming limits. Use 1K slot windows for cross-reference when dealing with high-volume programs.
- **`d8` not a valid addFields field**: `SolanaQueryBuilder.addFields({ instruction: { d8: true } })` causes `Type 'true' is not assignable to type 'never'`. The `d8` field is only for filtering in `addInstruction()`, not for field selection. The typegen decoder doesn't need it — it reads from the raw `data` field.

## Dashboard Design

- Bloomberg terminal style works well for Solana MEV data
- The bursty nature of tip claims creates distinctive spike patterns in daily/hourly charts
- SOL amounts vary enormously (0.000001 to 715 SOL) — use flexible number formatting

## What Worked Well

- Solana typegen from on-chain IDL — zero friction, correct types on first try
- Typed decode eliminated all manual base58/hex parsing
- `SolanaQueryBuilder` d8 filter with typegen discriminator — clean integration
