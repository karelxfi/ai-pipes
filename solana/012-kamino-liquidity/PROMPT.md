Create a complete Solana indexer for Kamino Liquidity at /Users/kb/dev/playground/ai-pipes/solana/012-kamino-liquidity/

First, research the Kamino Liquidity program:
1. Check /Users/kb/dev/personal/contracts-registry-llm/data/sources/protocols/kamino-liquidity/kamino-liquidity.json
2. The Kamino CLMM/liquidity program ID is likely `6LtLpnUFNByNXLyCoK9wA2MykKAmQNZKBdY8s47dehDc` (kliquidity). Verify by querying Portal:
   - Use portal_query_solana_instructions with program_id `6LtLpnUFNByNXLyCoK9wA2MykKAmQNZKBdY8s47dehDc` and timeframe=1h, limit=3
   - If that returns 0 results, try `KLend2g3cP87ber41GFZrh2UnUjJOWnAGv5D89geMb5` or search for "Kamino" related programs

3. Once you find the active program, compute Anchor d8 discriminators for key instructions:
```javascript
node -e "const c=require('crypto');['deposit','withdraw','open_position','close_position','collect_fees','invest','rebalance','swap'].forEach(n=>{const h=c.createHash('sha256').update('global:'+n).digest();console.log(n+': 0x'+h.slice(0,8).toString('hex'))})"
```

The angle: "Kamino CLMM activity — deposits, withdrawals, rebalances, fee collection"

Use FROM_SLOT = 405_000_000 for recent data.

Follow the same patterns as other indexers:
1. Read /Users/kb/dev/playground/ai-pipes/solana/009-drift-trade/src/index.ts as template
2. Read /Users/kb/dev/playground/ai-pipes/solana/009-drift-trade/dashboard/index.html for dashboard
3. Read /Users/kb/dev/playground/ai-pipes/solana/009-drift-trade/validate.ts for validation

Create ALL files: package.json, .env (database: kamino_liquidity), docker-compose.yml, clickhouse-cors.xml, tsconfig.json, migrations/, src/index.ts, dashboard/index.html, validate.ts, PROMPT.md, META.json, contracts.json

Then start: create database, npm install, run indexer, check data after 30 seconds.
