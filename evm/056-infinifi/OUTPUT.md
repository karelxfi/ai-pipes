# Output — infiniFi Reserve Pulse (056)

## What happened

Built an indexer for infiniFi, an on-chain fractional reserve banking protocol on Ethereum. The protocol lets users deposit USDC to mint iUSD receipt tokens, which can then be staked in an ERC-4626 vault (siUSD) for yield.

## Angle

**"Reserve Pulse"** — Tracks iUSD token movements (mints from zero address = deposits, burns to zero = redemptions, transfers = secondary market) alongside siUSD ERC-4626 vault Deposit/Withdraw events. This visualizes the heartbeat of the fractional reserve: money flowing in, out, and between the savings account.

## Key decisions

- **Two contracts indexed**: iUSD (ReceiptToken) for Transfer events, siUSD (ERC-4626 vault) for Deposit/Withdraw events
- **Start block 23000000**: First iUSD activity appeared around this block (late July 2025)
- **Transfer classification**: Mints (from=0x0), burns (to=0x0), regular transfers — classified at insert time for efficient dashboard queries
- **VaultProfit/VaultLoss events exist in ABI but had 0 occurrences** in the indexed range — yield distribution may happen differently

## Issues resolved

- Portal Stream API format: must use `type: 'evm'` with `logs: [{ address: [...] }]`, not `type: 'logs'`
- Portal cross-ref chunking: large block ranges (10k+) return truncated results; chunking at 2k blocks fixes this
- Port conflict: had to stop previous example's ClickHouse before starting new one

## Data summary

- **70,728** iUSD transfer events (8,513 mints / 5,315 burns / 56,900 transfers)
- **7,173** siUSD vault events (deposits + withdrawals)
- **8 months** of data: July 2025 to March 2026
- Cumulative net flow shows steady accumulation (~3,200 net mints)
