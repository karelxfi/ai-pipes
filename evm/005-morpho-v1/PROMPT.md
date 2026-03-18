Generate an indexer for Morpho Blue on Ethereum.

**Angle: Market Activity & Lending Dynamics** — Track Supply, Borrow, and Liquidate events to show how lending markets grow, which pairs are most active, and when liquidations happen.

**Morpho Blue** — Permissionless isolated lending markets. Each market is defined by (loanToken, collateralToken, oracle, irm, lltv). Immutable singleton contract, NOT a proxy.

**Contract:** `0xBBBBBbbBBb9cc5e90e3b3Af64bDAF62C37EEFFCb`

**Events to index (from EventsLib.sol):**

1. `Supply(Id indexed id, address indexed caller, address indexed onBehalf, uint256 assets, uint256 shares)`
2. `Borrow(Id indexed id, address caller, address indexed onBehalf, address indexed receiver, uint256 assets, uint256 shares)`
3. `Liquidate(Id indexed id, address indexed caller, address indexed borrower, uint256 repaidAssets, uint256 repaidShares, uint256 seizedAssets, uint256 badDebtAssets, uint256 badDebtShares)`

**Start from block 18883124** (January 2024, Morpho Blue deployment).

**Dashboard (4 charts):**
1. Supply vs Borrow Activity Over Time — dual stacked area chart (green for supply, orange for borrow), weekly event counts, DefiLlama-style gradient fills
2. Top Markets by Activity — horizontal stacked bar chart showing most active market IDs (first 8 chars), supply in green, borrow in orange
3. Liquidation Timeline — bar chart with red gradient for liquidations, purple for bad debt events (badDebtAssets > 0)
4. Protocol Pulse — Weekly Active Users — area chart showing unique addresses per week

Summary stats: total events, active markets, unique users, period.

Database: `morpho_blue`, tables: `morpho_blue_supply`, `morpho_blue_borrow`, `morpho_blue_liquidate`.
