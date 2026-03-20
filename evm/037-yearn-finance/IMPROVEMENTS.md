# Improvements — Yearn Finance V2

## What worked well
- Topic0-only filtering (no `contracts` array) is a powerful pattern for protocols with many deployed contracts
- New SDK `outputs` pattern is cleaner than old `pipeComposite`
- Dashboard template with ECharts produces good results quickly

## CLAUDE.md improvements needed
- Document topic0-only filtering as a first-class pattern for multi-contract protocols
- Add note that `contracts` is optional in `evmDecoder` — useful for protocols deploying via factories

## Agent-skills improvements
- The `pipes-new-indexer` skill should mention topic0-only filtering as an option when a protocol has many contracts

## Skills patches applied
No skill patches needed — the updated skills from the SDK migration worked correctly.
