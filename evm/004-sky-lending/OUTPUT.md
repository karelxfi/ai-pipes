# Output — Sky Lending (MakerDAO) Vault Liquidation Monitor

## What happened

Scaffolded indexer using Pipes CLI with the Dog contract address (`0x135954d155898D42C90D2a57824C690e0c7BEf1B`) and Bark event. The CLI correctly auto-detected the full ABI from the chain, including all events (Bark, Cage, Deny, Digs, File variants, Rely) and functions. We only index the Bark event.

## Key decisions

1. **Bark event has 3 indexed params** — `ilk`, `urn`, and `id` are all indexed (stored in topics). The non-indexed fields `ink`, `art`, `due`, `clip` are in the event data. The CLI-generated typegen file correctly reflects this.

2. **bytes32 ilk decoding** — The dashboard decodes bytes32 hex values to human-readable ASCII strings (e.g., `0x4554482d41...` becomes "ETH-A") by parsing hex byte pairs to chars and trimming null bytes.

3. **due field precision** — The `due` field uses "rad" precision (45 decimals) in MakerDAO. Division by 1e45 in ClickHouse SQL converts to DAI value. JavaScript's float64 handles this adequately for dashboard display after ClickHouse does the division.

4. **Cumulative debt chart** — Shows running total of debt at risk over time, giving a sense of total protocol stress from liquidations since Liquidations 2.0 launch.

5. **Database name** — Uses `sky_lending` as dedicated database to avoid table conflicts with other indexers.

## Issues resolved

- CLI generated docker-compose without persistent volume or CORS config — fixed manually.
- CLI used default `pipes` database name — changed to `sky_lending`.
- The `id` field in the Bark event is indexed on-chain (3 indexed params total), which the CLI correctly detected from the deployed contract bytecode.
