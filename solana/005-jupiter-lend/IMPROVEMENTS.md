# Improvements: Jupiter Lend

## Skills Patches Needed

**CPI / innerInstructions pattern**: The `pipes-new-indexer` skill should document that many Solana programs use CPI architecture where user-facing programs delegate to core programs. The `innerInstructions: true` flag on `addInstruction()` is required to capture these. Without it, the indexer silently returns zero data.

**GitHub IDL fallback**: The skill should document that on-chain IDL fetch (`programId#name`) doesn't always work — some programs don't store IDLs on-chain. Fallback: download IDL from GitHub and pass the local path to typegen.

## CLAUDE.md Improvements

- **Solana CPI pattern**: Add a section noting that many Solana DeFi protocols use CPI (cross-program invocation) where the core logic runs in inner instructions. Always check with Portal if data volume seems too low — it might be a CPI issue.
- **Int128 ClickHouse support**: ClickHouse handles Int128 natively — no need to convert to string or split into two columns.

## What Worked Well

- Typegen from local IDL files — downloaded 3 IDLs, generated typed decoders for all in one command
- Operation type classification from signed amounts — clean pattern for unified instruction decoders
- Portal cross-reference immediately caught the CPI issue — this verification step is invaluable
