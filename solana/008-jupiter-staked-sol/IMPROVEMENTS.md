# Improvements — Jupiter Staked SOL

## CLAUDE.md Improvements

- **Add Solana scan speed guidance:** Document that scanning high-traffic programs (SPL Token Program, SPL Stake Pool) without tight filters is impractical. Always filter by specific accounts (mint address, program ID + account filter) rather than scanning an entire program.
- **Add SPL Token mint/burn pattern:** For liquid staking tokens (jupSOL, mSOL, dSOL), tracking MintTo/Burn on the token mint is far more efficient than tracking the stake pool program instructions. This should be a documented pattern in CLAUDE.md.

## Agent Skills Improvements

- **Solana query skill should warn about high-traffic programs:** The SPL Token Program processes billions of instructions. Querying it without `mentions_account` or tight slot ranges will time out or return irrelevant data. Add a warning to the portal-query-solana skills.

## Dashboard Patterns That Worked

- **Deposit vs withdrawal bar chart:** Daily stacked bars with deposits (blue) vs withdrawals (red) clearly show net flow direction.
- **Cumulative flow line:** Running total of net deposits gives a sense of protocol growth trajectory.
- **Summary stats header:** Total deposits, total withdrawals, net flow, and date range in the top bar provides instant context.

## Key Learnings

1. **SPL Token mint/burn as staking proxy:** For any Solana liquid staking token, the mint/burn events on the derivative token (jupSOL, mSOL, dSOL) perfectly capture deposit/withdrawal activity without needing to decode the stake pool program.
2. **Solana scan speed:** Programs like SPL Token and SPL Stake Pool are too high-traffic to scan broadly. Always use `mentions_account` filters to narrow to specific token mints or pools.
3. **Wrapper program routing:** Jupiter and Sanctum route staking operations through their own wrapper programs, so filtering by the stake pool program ID alone misses most activity. Token mint/burn captures all paths.
