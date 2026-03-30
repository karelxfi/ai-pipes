# Output — Aave v4 Launch Monitor

## Angle
**Hub & Spoke Liquidity Flows** — tracking the first hours of Aave v4's new architecture on Ethereum mainnet. The dashboard shows how liquidity distributes across 3 Hubs and 11 Spokes, which spokes get early traction, and supply vs borrow dynamics during the launch window.

## Key Decisions

1. **Two decoders, one stream**: Used separate `evmDecoder` instances for Hub events (Add/Remove/Draw/Restore from 3 hub contracts) and Spoke events (Supply/Withdraw/Borrow/Repay/LiquidationCall from 11 spoke contracts), both piped through a single `evmPortalStream`.

2. **Implementation ABIs, not proxy ABIs**: All Aave v4 contracts are TransparentUpgradeableProxy. Used the Hub implementation (`0xfe89...`) and Spoke implementation (`0xABd0...`) addresses with evm-typegen. Both were verified on Etherscan within a week of deployment.

3. **Start block adjusted for activation**: Contracts deployed at block 24720891 (March 23) but protocol activated at block ~24770600 (March 30). Starting from deployment would scan 50K empty blocks. Adjusted to 24770600 to go straight to the action.

4. **enrichEvents extended with `contract` field**: The standard `enrichEvents` helper doesn't include which contract emitted the event. Added `contract: v.contract` to identify which Hub/Spoke each event came from.

5. **Three tables, not one**: Hub flows and spoke events have different schemas. Used `hub_flows` (event_type + hub + asset_id + spoke), `spoke_events` (event_type + spoke + reserve_id + caller + user), and `liquidations` (full liquidation params). Coalesced varying field names (shares/drawnShares, amount/drawnAmount) with `??` operator.

## Issues Resolved

- **Portal 503s near chain head**: The Portal stream endpoint had persistent 503 "No available workers" errors for blocks near the chain head (~24743887+). The indexer's built-in retry with exponential backoff eventually gets through, but initial sync was slow. Restarting from a later block (24770600) bypassed the problematic range.

- **Portal query endpoint vs stream lag**: The Portal query endpoint (used in validate.ts) lags behind the stream API (used by the indexer). Cross-reference validation needed a narrow block range (100 blocks from start) to avoid false mismatches.

## Results
- 145 spoke events (94 Supply, 25 Borrow, 16 Withdraw, 10 Repay)
- 116 hub flows (73 Add, 21 Draw, 11 Remove, 9 Restore)
- 0 liquidations (expected — protocol just launched)
- 51 unique users across 9 active spokes
- MAIN spoke dominates (99 events), followed by BLUECHIP (20) and FOREX (11)
