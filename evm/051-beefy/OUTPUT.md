# Beefy — Yield Aggregator Pulse

## What happened

Built a protocol-wide indexer tracking ALL 89 active Beefy vaults on Ethereum plus the BIFI governance token. Fetched vault addresses from the Beefy API (`api.beefy.finance/vaults/ethereum`), filtered for active status, and passed all 89 addresses to a single evmDecoder alongside BIFI token tracking.

## Key decisions

1. **Angle: Protocol-wide aggregate activity** — Rather than picking one vault, indexed ALL active vaults to show the full picture of Beefy on Ethereum. Individual vaults have low activity (0-7 events/week each) but aggregated across 89 vaults the data is substantial.

2. **Vault address discovery** — Used the Beefy API to dynamically fetch all active vault addresses and saved them as `vaults.json`. Each vault is a BeefyVaultV7 ERC-4626 contract where Transfer from zero = deposit (mooToken mint) and Transfer to zero = withdrawal (mooToken burn).

3. **Two decoders** — Separate decoders for vault mooTokens (89 addresses) and BIFI governance token (1 address), both tracking Transfer events but classified differently.

4. **Vault ID mapping** — Built a lookup from contract address to Beefy vault ID (e.g., "morpho-steakhouse-weth", "curve-usds-studs") for human-readable dashboard labels.

## Results

- 80,606 rows indexed over 85 days (Dec 31, 2025 → Mar 26, 2026)
- 86 distinct vaults with activity out of 89 registered
- 5,916 vault deposits, 4,358 vault withdraws, 58,211 BIFI transfers
- Validation: 18/18 checks passed, Portal cross-ref exact match (0.0% diff)
