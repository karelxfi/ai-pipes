# Stake DAO — Governance Pulse

## What happened

Built a multi-contract indexer tracking the Stake DAO governance ecosystem: sdCRV (liquid-locked CRV) transfers, SDT (governance token) transfers, and veSDT (vote-escrowed SDT) lock/unlock/supply events.

## Key decisions

1. **Angle: Governance token lifecycle** — Rather than just Transfer events, combined three contracts to show the full flow: CRV → sdCRV (liquid locker), SDT → veSDT (vote escrow), and the supply dynamics.

2. **Multi-contract multi-decoder pattern** — Used two separate evmDecoder instances: one for ERC20 Transfer events on sdCRV + SDT tokens, another for veSDT's domain-specific Deposit/Withdraw/Supply events.

3. **90-day lookback** — Ethereum has ~7,200 blocks/day vs BSC's 28,800, so 90-day lookback (648K blocks) syncs in ~5 minutes.

4. **veSDT proxy resolution** — veSDT at `0x0C30...8a` is a TransparentUpgradeableProxy. Generated types from implementation `0x8fb5...F4` which has the Deposit/Withdraw/Supply events.

## Results

- 18,911 rows indexed over ~85 days (Dec 31, 2025 → Mar 26, 2026)
- sdCRV: 14,790 events (78.2% of total), SDT: 3,577, veSDT: 544
- 252 veSDT lock events, 20 unlocks — strong locking commitment
- 931 unique addresses
- Validation: 16/16 checks passed, Portal cross-ref exact match (0.0% diff)
