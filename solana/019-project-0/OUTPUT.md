# Output — Project 0 (marginfi v2) Prime Broker Pulse

## What happened

Built a Solana indexer tracking all lending activity on Project 0 (previously marginfi), Solana's first multi-venue DeFi prime broker.

## Key decisions

- **Program ID**: `MFv2hWf31Z9kbCa1snEPYctwafyhdvnV7FZnsebVacA` — the marginfi-v2 lending program, confirmed active via Portal
- **5 instruction types indexed**: deposit (`0xab5eeb675240d48c`), withdraw (`0x24484a13d2d2c0c0`), borrow (`0x047e74353005d41f`), repay (`0x4fd1acb1de33ad97`), liquidate (`0xd6a997d5fba756db`)
- **Bank account extraction**: Bank address at index 3 for deposit/withdraw/borrow/repay, index 1 (asset_bank) for liquidations — derived from marginfi-v2 docs
- **Discriminators**: Computed via SHA256("global:<instruction_name>")[0..8] per Anchor convention, verified against Portal data
- **5-day lookback**: High-frequency protocol (130K+ actions/day), 5 days yields 664K rows

## Issues resolved

- No IDL file publicly available at expected GitHub paths — computed discriminators manually from instruction names
- Project 0 is a rebrand of marginfi — discovered via blog post linking to marginfi-v2 audit repo
- Contracts registry had empty placeholder — populated with verified program ID

## Results

- 663,887 total rows indexed
- 325,650 repays, 325,392 borrows, 6,293 withdrawals, 5,925 deposits, 627 liquidations
- 18,938 unique users across 68 bank accounts
- Borrow/repay ratio of 1.00 indicates healthy market equilibrium
- Dashboard shows clear daily patterns and dominant bank pool (CCKt..LYGh with 650K+ actions)
