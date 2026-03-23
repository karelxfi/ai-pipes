# Improvements: SPL Stake Pool POC

## Findings

1. **SPL Stake Pool IS indexable** — the CLI_IMPROVEMENTS.md issue #12 claiming these programs aren't indexable was incorrect. d1 discriminators work fine.

2. **Low volume is the real issue** — ~170 user-facing ops per 27 days across ALL pools. Individual pools like BNSOL have near-zero on-chain activity. This makes it impractical for meaningful dashboards, not technically impossible.

3. **Non-Anchor programs need manual decoding** — typegen doesn't help here. Manual Borsh decoding (d1 byte + u64 LE amount) is simple but needs to be documented.

## Skills Update Needed

- Document d1 discriminator filtering pattern for non-Anchor programs
- Note that volume assessment BEFORE building is critical — many Solana programs have very low instruction volume
- Add SPL Stake Pool as an example of a non-Anchor program with d1 discriminators

## No Skills Patch Applied

This was a proof of concept — the findings should inform the CLI_IMPROVEMENTS.md correction rather than a skill patch.
