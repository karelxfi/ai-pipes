# Output — mETH Protocol Staking Flow

## Angle
Track mETH/ETH exchange rate evolution and staking inflows/outflows from the Staking contract on Ethereum. The implicit exchange rate is derived from each Staked event's ethAmount/mETHAmount ratio.

## Key Decisions
1. **Used implementation ABI** — Staking contract is a TransparentUpgradeableProxy. Implementation at `0x01a360392c74b5b8bf4973f438ff3983507a06a2`.
2. **Four event types** — Staked, UnstakeRequested, UnstakeRequestClaimed, ReturnsReceived. Returns events track protocol rewards flowing back.
3. **Exchange rate from events** — Rather than querying a view function, we derive the rate from each Staked event's ETH/mETH ratio. This gives a per-transaction rate history.

## Issues Encountered
- Wrong `@subsquid/evm-abi` version (`^1.0.0` doesn't exist, correct is `^0.3.1`)
- Needed `@subsquid/evm-codec` as peer dependency

## Results
- 36,834 events indexed
- 25,766 stakes, 5,207 unstake requests, 4,699 claims, 1,162 returns
- 18,000 unique stakers
- 13 months of data (Dec 2023 → Jan 2025)
- Exchange rate grew from ~0.99 to ~1.04 ETH/mETH
