# Improvements

## CLAUDE.md

- The Portal Stream API section should document the required `"type": "evm"` field. The validate.ts template pattern doesn't include it and all cross-reference queries silently fail.
- The validate.ts template should use smaller sample ranges (10k blocks) for Portal cross-reference instead of trying to count the full block range, which doesn't work well with the streaming API's pagination.

## generate-indexer command

- No issues encountered with scaffolding.

## Templates

- The enrichEvents utility works well and was reused without modification.

## Agent skills

- Portal query skills should mention that the Stream API endpoint (`/stream`) requires `"type": "evm"` in the POST body — this is distinct from the MCP tool interface which handles it automatically.
- Validation patterns could benefit from a sample-based cross-reference approach rather than full-range counting.
