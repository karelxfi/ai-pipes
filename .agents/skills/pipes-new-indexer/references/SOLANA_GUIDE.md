# Solana Indexer Guide

## Scan Speed Reality

Solana has ~0.4s slot times = 2.5 slots/second. Scanning 100M slots takes hours regardless of filter specificity. Plan accordingly:

- **From slot 405M to current (~408M):** ~3M slots, ETA 2-4 hours per indexer
- **From slot 370M:** ~38M slots, ETA 10-20 hours
- **Multiple concurrent indexers:** Portal rate-limits at 5+ concurrent requests, ETAs 2-3x longer
- **Node v25 crashes:** zstd decompression bugs cause periodic crashes. The Pipes SDK resumes automatically on restart.

**Rule of thumb:** Start from slot 405M for quick testing, 370M for 6-month coverage, 330M for full year.

## Instruction Discriminators

### Anchor Programs (d8)
Most DeFi protocols use Anchor. Discriminator = first 8 bytes of SHA-256 hash of `global:<instruction_name>`.

```bash
node -e "const c=require('crypto'); ['deposit','withdraw','liquidate'].forEach(n => {
  const h = c.createHash('sha256').update('global:'+n).digest();
  console.log(n + ': 0x' + h.slice(0,8).toString('hex'));
})"
```

**Key gotcha:** Different programs can have the same d8 for the same instruction name (e.g., both Marinade and Kamino have `deposit: 0xf223c68952e1f2b6` because they hash `global:deposit` identically). Always filter by programId.

Known d8 discriminators:
| Program | Instruction | d8 |
|---------|-------------|-----|
| Drift v2 | fill_perp_order | `0x0dbcf86786d96af0` |
| Drift v2 | place_perp_order | `0x45a15dca787e4cb9` |
| Drift v2 | liquidate_perp | `0x4b2377f7bf128b02` |
| Marinade | deposit | `0xf223c68952e1f2b6` |
| Marinade | liquid_unstake | `0x1e1e77f0bfe30c10` |
| Kamino | invest | `0x0df5b467feb67904` |
| Kamino | rebalance | `0x6c9e4d09d234583e` |

### SPL Programs (d1)
SPL Stake Pool and SPL Token use single-byte enum discriminators.

**SPL Token key d1 values:**
- `0x07` MintTo, `0x08` Burn, `0x0e` MintToChecked, `0x0f` BurnChecked

**SPL Stake Pool key d1 values:**
- `0x09` DepositStake, `0x0a` WithdrawStake, `0x0e` DepositSol, `0x10` WithdrawSol

## LST Tracking Pattern: Token Mint/Burn

For liquid staking tokens (jupSOL, dSOL, mSOL), tracking SPL Stake Pool instructions directly is often impractical:
1. Operations route through wrapper programs (Sanctum, Jupiter aggregator)
2. The stake pool account filter (a0) results in very sparse matches = slow scan
3. Multiple stake pool program deployments exist (SPL, Sanctum SPL 1/2)

**Better approach:** Track the LST token's MintTo/Burn via SPL Token program:
- Every deposit → MintTo/MintToChecked with a0 = LST mint address
- Every withdrawal → Burn/BurnChecked with a1 = LST mint address

```typescript
const query = new SolanaQueryBuilder()
  .addInstruction({
    request: {
      programId: ['TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'],
      d1: ['0x07', '0x0e'],  // MintTo, MintToChecked
      a0: [LST_MINT_ADDRESS],
      isCommitted: true,
      transaction: true,
    },
  })
  .addInstruction({
    request: {
      programId: ['TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA'],
      d1: ['0x08', '0x0f'],  // Burn, BurnChecked
      a1: [LST_MINT_ADDRESS],  // note: a1 not a0 for burn!
      isCommitted: true,
      transaction: true,
    },
  })
```

**Account layout for SPL Token:**
- MintTo: a0=mint, a1=destination, a2=authority
- Burn: a0=source, a1=mint, a2=authority

## Known Solana Program IDs

| Protocol | Program ID | Type |
|----------|-----------|------|
| Drift v2 | `dRiftyHA39MWEi3m9aunc5MzRF1JYuBsbn6VPcn33UH` | Anchor |
| Marinade | `MarBmsSgKXdrN1egZf5sqe1TMai9K1rChYNDJgjq7aD` | Anchor |
| Kamino CLMM | `6LtLpnUFNByNXLyCoK9wA2MykKAmQNZKBdY8s47dehDc` | Anchor |
| Kamino Lending | `KLend2g3cP87ber41GFZrh2UnUjJOWnAGv5D89geMb5` | Anchor |
| SPL Token | `TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA` | Native |
| SPL Stake Pool | `SPoo1Ku8WFXoNDMHPsrGSTSG1Y47rzgn41SLUNakuHy` | Native |
| Sanctum SPL 1 | `SP12tWFxD9oJsVWNavTTBZvMbA6gkAmxtVgxdqvyvhY` | Native |
| Jito Tip Distribution | `4R3gSG8BpU4t19KYj8CfnbtRpnT8gtk4dvTHxVRwc2r7` | Anchor |

## Known LST Mints

| LST | Mint Address |
|-----|-------------|
| jupSOL | `jupSoLaHXQiZZTSfEWMTRRgpnyFm8f6sZdosWBjx93v` |
| dSOL | `Dso1bDeDjCQxTrWHqUUi63oBvV7Mdm6WaobLbQ7gnPQ` |
| mSOL | `mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So` |
| jitoSOL | `J1toso1uCk3RLmjorhTtrVwY9HJ7X8V9yYac6Y7kGCPn` |
| bSOL | `bSo13r4TkiE4KumL71LsHTPpL2euBYLFx6h9HP3piy1` |

## Concurrent Indexer Rate Limiting

Running 3+ Solana indexers simultaneously causes Portal 429 errors. The Pipes SDK handles this with automatic retry/backoff, but ETAs increase 2-3x. Strategies:
- Run no more than 2-3 concurrent Solana indexers
- Start from more recent slots (405M+) for faster iteration
- Let indexers run overnight for full historical coverage
