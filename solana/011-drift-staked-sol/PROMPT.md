Create a complete Solana indexer for Drift Staked SOL (dSOL) at /Users/kb/dev/playground/ai-pipes/solana/011-drift-staked-sol/

Key info:
- dSOL uses the SPL Stake Pool program, similar to jupSOL
- dSOL stake pool: `9mhGNSPArRMHpLDMSmxAvuoizBqtBGqYdT8WGuqgxNdn`
- dSOL mint: `Dso1bDeDjCQxTrWHqUUi63oBvV7Mdm6WaobLbQ7gnPQ`
- Approach: Track dSOL token mint/burn via SPL Token program (same pattern as jupSOL)

SPL Token discriminators:
- MintTo: d1=0x07, MintToChecked: d1=0x0e (a0 = mint for both)
- Burn: d1=0x08, BurnChecked: d1=0x0f (a1 = mint for both)

Use FROM_SLOT = 405_000_000 for recent data.
