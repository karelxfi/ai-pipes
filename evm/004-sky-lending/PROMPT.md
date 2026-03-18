Generate an indexer for Sky Lending (MakerDAO) on Ethereum.

**Angle: Vault Liquidation Monitor** — Track liquidation events (Bark) from the Dog contract to monitor which collateral types get liquidated most, liquidation frequency, and debt at risk.

**Dog contract (Liquidations 2.0):** `0x135954d155898D42C90D2a57824C690e0c7BEf1B`

**Key event — Bark (liquidation trigger):**
- ilk (bytes32, indexed) = collateral type identifier (e.g., "ETH-A", "WBTC-A")
- urn (address, indexed) = vault address being liquidated
- ink (uint256) = collateral seized (in wad, 18 decimals)
- art (uint256) = normalized debt (in wad, 18 decimals)
- due (uint256) = total debt including penalty (in rad, 45 decimals)
- clip (address) = clipper auction contract
- id (uint256, indexed) = auction ID

**Start from block 12317000** (April 2021, when Liquidation 2.0 / Dog was deployed).

**Dashboard (4 charts):**
1. Liquidations Per Month — bar chart
2. Top Collateral Types Liquidated — horizontal bar chart with decoded bytes32 ilk names
3. Debt at Risk (due) — cumulative area chart, due divided by 1e45 for DAI value
4. Unique Vaults Liquidated Per Month — bar chart

Summary stats: total liquidations, unique vaults hit, collateral types, period.

Database: `sky_lending`, table: `dog_bark`.
