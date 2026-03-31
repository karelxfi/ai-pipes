# Aster asBNB — Liquid Staking Pulse

## What happened

Built a multi-contract indexer tracking the asBNB liquid staking token lifecycle on BSC. Combines ERC20 Transfer events from the asBNB token with domain-specific events (AsBnbMinted, AsBnbBurned, RewardsCompounded) from the AsBnbMinter proxy contract.

## Key decisions

1. **Multi-contract approach** — The asBNB token contract only emits standard ERC20 Transfer/Approval events. The interesting minting/burning logic lives in the AsBnbMinter proxy at `0x2f31...fd8`. Combined both to get the full picture.

2. **Transfer classification** — Classified token Transfer events as mint (from=zero), burn (to=zero), or transfer based on addresses. This eliminates the need for the rare minter events to show mint/burn activity.

3. **30-day lookback** — BSC has 3-second blocks, so 90 days = 2.6M blocks which would take over an hour to sync. Reduced to 30 days (~860K blocks) which syncs in ~8 minutes and yields 24K rows.

4. **Proxy pattern** — The AsBnbMinter is an ERC1967 proxy. Generated types from the implementation contract at `0x7f52773065fd350b5a935ce2b293fdb16551a6fc` and indexed the proxy address.

## Issues resolved

- AsBnbMinter proxy unverified on BscScan — used the implementation contract for typegen
- BSC sync speed — reduced from 90-day to 30-day lookback for practical sync time
- The minter has extremely low direct activity (5 events/week) — the real activity flows through the token transfers

## Results

- 24,394 rows indexed over 30 days (Mar 1-31, 2026)
- 11,329 BNB minted, 24,051 BNB burned, -12,722 BNB net outflow
- 2,302 unique addresses
- Validation: 16/16 checks passed, Portal cross-ref exact match (0.0% diff)
