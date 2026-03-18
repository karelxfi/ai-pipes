You are generating the first SOLANA indexer example for ai-pipes: **Kamino Lend** on Solana mainnet.

Work from: /Users/kb/dev/playground/ai-pipes
Target directory: solana/001-kamino-lend/

## IMPORTANT: This is Solana, NOT EVM

Solana indexers work differently from EVM:
- Use `"networkType": "svm"` and `"network": "solana-mainnet"` in CLI
- No ABI decoding — filter by program ID + instruction discriminators
- Solana uses slots (not blocks) — current is ~350M
- Instructions have raw data bytes, not decoded events
- Account positions (a0, a1...) instead of named parameters

## Protocol Details

**Kamino Lend (KLend)** — Largest Solana lending protocol ($2.4B TVL). Anchor program.

**Program ID:** `KLend2g3cP87fffoy8q1mQqGKjrxjC8boSyAYavgmjD`

**Angle: Lending Activity Pulse** — Track deposits, borrows, and liquidations to show protocol usage patterns, growth trajectory, and risk events.

**Instruction discriminators (Anchor d8):**
- Deposit: `0x81c70402de271a2e` (`deposit_reserve_liquidity_and_obligation_collateral`)
- Borrow: `0x797f12cc49f5e141` (`borrow_obligation_liquidity`)
- Repay: `0x91b20de14cf09348` (`repay_obligation_liquidity`)
- Liquidate: `0xb1479abce2854a37` (`liquidate_obligation_and_redeem_reserve_collateral`)
- Withdraw: `0x4b5d5ddc2296dac4` (`withdraw_obligation_collateral_and_redeem_reserve_collateral`)

**Start from slot 280000000** (~December 2024, to get recent activity).

### Dashboard (4 ECharts charts — DefiLlama style)

1. **Daily Activity Breakdown** — stacked area chart with 5 colors for each action type
2. **Action Distribution** — treemap showing relative volume of each action type
3. **Unique Users Per Day** — area chart (blue gradient) showing fee_payer uniqueness
4. **Liquidation Events** — bar chart (red) showing liquidation frequency

Stats: total actions, unique users, liquidations, period
