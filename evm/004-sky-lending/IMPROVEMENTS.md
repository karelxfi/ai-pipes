# Improvements — Sky Lending (MakerDAO)

## CLI / Templates

1. **docker-compose missing volumes and CORS** — The CLI-generated docker-compose.yml still lacks persistent ClickHouse volumes and the CORS XML mount. Every single example requires manually adding these. The template should include them by default.

2. **Default database name** — CLI defaults to `pipes` as database name. Should use a slugified version of the project name (e.g., `sky_lending` for `004-sky-lending`).

3. **bytes32 fields** — The CLI generates `FixedString(66)` for bytes32 fields, which is correct for storing the hex representation. However, the migration template could add a comment noting this is hex-encoded bytes32 for clarity.

## CLAUDE.md

1. **bytes32 decoding pattern** — Add a standard JavaScript snippet for decoding bytes32 to ASCII strings in the dashboard section, since this is common for protocols like MakerDAO that use bytes32 identifiers.

2. **Large number handling** — Document the "rad" (45 decimals) and "wad" (18 decimals) and "ray" (27 decimals) conventions used by MakerDAO, as they may appear in other protocols too.

## Agent Skills

No issues encountered with agent skills on this example.
