# Hyperliquid Oil Crisis Tracker — Design Spec

## Angle

"Geopolitical trading on a DEX" — tracking oil (WTI), gold, and silver perpetual futures on Hyperliquid during the Iran shock and beyond. Oil leads the narrative, precious metals provide safe-haven context.

This is indexer `006` in the Hyperliquid series. Existing indexers cover crypto majors (001), whales (002), PnL (003), meme coins (004), and liquidations (005). None touch RWA/commodities — the biggest Hyperliquid story of March 2026.

## Context

- WTI crude oil perpetuals (`xyz:CL`) hit [$1.7B daily volume](https://www.ainvest.com/news/hyperliquid-oil-volume-1-7b-daily-365m-liquidations-308m-hype-unlock-2603/) on Hyperliquid
- [Iran crisis](https://www.coindesk.com/markets/2026/03/09/oil-shorts-on-hyperliquid-get-wiped-out-as-crude-surges-30-on-iran-escalation-triggering-usd40-million-in-liquidations) drove $40M+ in oil liquidations
- [$3.64B whale deadlock](https://www.coinspeaker.com/hyperliquid-whale-deadlock-liquidations/) across the platform
- Gold and silver trading as safe-haven plays alongside oil volatility

## Data Source

**Portal dataset:** `hyperliquid-fills`

**Query strategy:** Query all coins with empty filter `{}`, then filter in the `.pipe()` transform for commodity coins only.

**Target coins:**

| Coin Symbol | Asset Class | Description |
|---|---|---|
| `xyz:CL` | OIL | WTI crude oil |
| `xyz:GOLD` | GOLD | Gold (USDC-settled) |
| `cash:GOLD` | GOLD | Gold (USDT0-settled) |
| `xyz:SILVER` | SILVER | Silver (USDC-settled) |
| `cash:SILVER` | SILVER | Silver (USDT0-settled) |

**Filter regex:** `/^(xyz:(CL|GOLD|SILVER)|cash:(GOLD|SILVER))$/`

**Note:** Both `xyz:` and `cash:` prefixes exist for gold/silver. They represent the same underlying asset but with different settlement tokens (USDC vs USDT0). Both must be captured.

## Schema

```sql
CREATE TABLE IF NOT EXISTS hl_oil_crisis.fills (
    block_number UInt64,
    timestamp DateTime64(3, 'UTC'),
    user String,
    coin LowCardinality(String),        -- xyz:CL, xyz:GOLD, cash:GOLD, etc.
    asset_class LowCardinality(String), -- OIL, GOLD, SILVER
    px Float64,
    sz Float64,
    side LowCardinality(String),        -- Buy, Sell
    dir LowCardinality(String),         -- Open Long, Close Short, etc.
    closed_pnl Float64,
    fee Float64,
    notional Float64,                   -- px * sz (derived)
    sign Int8
) ENGINE = CollapsingMergeTree(sign)
ORDER BY (asset_class, block_number)
PARTITION BY toYYYYMM(timestamp)
```

**Design decisions:**
- `asset_class` normalizes `xyz:CL` → `OIL`, `xyz:GOLD`/`cash:GOLD` → `GOLD`, `xyz:SILVER`/`cash:SILVER` → `SILVER` for simpler dashboard queries
- `LowCardinality(String)` for coin/asset_class/side/dir — small cardinality, saves memory
- Plain `String` for user — high cardinality (many unique wallet addresses)
- ORDER BY `(asset_class, block_number)` — most queries will filter by asset first
- PARTITION BY month — standard for time-series data

## Start Block

Target: early February 2026, to capture the full "Iran shock" buildup (late Feb) through the March volume explosion. This gives ~2 months of data showing the before/during/after pattern.

Determine the exact block number at runtime via Portal:
```typescript
// Query Portal for block at 2026-02-01T00:00:00Z (Unix: 1738368000)
// portal_block_at_timestamp('hyperliquid-fills', 1738368000)
// Fallback: use approximate block ~920000000
const START_BLOCK = 920000000  // ~Feb 1, 2026; refine via Portal query
```

## Indexer Implementation

```typescript
// Pattern: query all coins, filter for commodities in pipe
const COMMODITY_COINS = /^(xyz:(CL|GOLD|SILVER)|cash:(GOLD|SILVER))$/

function assetClass(coin: string): string {
  if (coin === 'xyz:CL') return 'OIL'
  if (coin.endsWith('GOLD')) return 'GOLD'
  if (coin.endsWith('SILVER')) return 'SILVER'
  return 'UNKNOWN'
}

const query = new HyperliquidFillsQueryBuilder()
  .addRange({ from: START_BLOCK })
  .addFields({
    block: { number: true, timestamp: true },
    fill: {
      user: true, coin: true, px: true, sz: true,
      side: true, dir: true, closedPnl: true, fee: true
    }
  })
  .addFill({ range: { from: START_BLOCK }, request: {} })

await hyperliquidFillsPortalSource({
  id: 'hl-oil-crisis',
  portal: 'https://portal.sqd.dev/datasets/hyperliquid-fills',
  outputs: query
})
.pipe((blocks) => {
  const fills = blocks.flatMap((block) =>
    block.fills
      .filter(f => COMMODITY_COINS.test(f.coin))
      .map(fill => ({
        block_number: block.header.number,
        timestamp: new Date(block.header.timestamp).toISOString(),
        user: fill.user,
        coin: fill.coin,
        asset_class: assetClass(fill.coin),
        px: fill.px,
        sz: fill.sz,
        side: fill.side === 'B' ? 'Buy' : 'Sell',
        dir: fill.dir,
        closed_pnl: fill.closedPnl,
        fee: fill.fee,
        notional: fill.px * fill.sz,
        sign: 1,
      }))
  )
  return { fills }
})
.pipeTo(clickhouseTarget({ ... }))
```

## Dashboard Design

**Viewport:** 1200x675px (X card ratio)
**Style:** Bloomberg terminal — pure black `#000`, 1px borders, monospace, no gradients

### Header
- Title: `HYPERLIQUID OIL CRISIS TRACKER`
- Subtitle: `Geopolitical trading on a DEX — WTI crude, gold & silver perpetual futures`
- 4 stat cards:
  1. Total fills count
  2. Total notional volume (formatted as $XXM or $XXB)
  3. Unique traders
  4. Date range (e.g., "2026-02-01 → 2026-03-23")

### Panel 1: Daily Volume by Asset (stacked bar chart)
- X-axis: date
- Y-axis: daily notional volume in USD
- Stacked bars: OIL (royal blue `#2B4F7E`), GOLD (amber `#D4A017`), SILVER (steel `#8B8B8B`)
- Shows the volume explosion during Iran crisis weeks

### Panel 2: Oil Price Tracker (line chart)
- X-axis: date
- Y-axis: average fill price of `xyz:CL`
- Single line, royal blue `#2B4F7E`, subtle area fill
- Shows the ~$89 → $115 spike and correction
- Query: `SELECT toDate(timestamp) as d, avg(px) FROM fills WHERE asset_class = 'OIL' GROUP BY d ORDER BY d`

### Panel 3: Long/Short Imbalance (bar chart)
- X-axis: date
- Y-axis: net directional bias (count of "Open Long" minus count of "Open Short")
- Positive bars (teal `#3D7A6B`) = net long, negative bars (burgundy `#8B3A3A`) = net short
- Filtered to OIL only for clarity
- Reveals sentiment shifts: were traders betting on oil rising or falling?
- Query: `SELECT toDate(timestamp) as d, countIf(dir = 'Open Long') - countIf(dir = 'Open Short') as net_direction FROM hl_oil_crisis.fills WHERE asset_class = 'OIL' GROUP BY d ORDER BY d`

### Panel 4: Top Oil Traders (horizontal bar chart)
- Top 10 traders on `xyz:CL` by total notional volume
- Horizontal bars, royal blue `#2B4F7E`
- Labels: truncated wallet addresses `0xABCD..EF12`
- Right-aligned notional values
- Query: `SELECT user, sum(notional) as vol FROM hl_oil_crisis.fills WHERE coin = 'xyz:CL' GROUP BY user ORDER BY vol DESC LIMIT 10`

### Footer
`Built with ai-pipes + SQD Pipes SDK | github.com/karelxfi | x.com/karelxfi`

### Color Palette
```
OIL:     #2B4F7E (royal blue — primary, dominant)
GOLD:    #D4A017 (amber gold)
SILVER:  #8B8B8B (steel gray)
Net long:  #3D7A6B (muted teal)
Net short: #8B3A3A (muted burgundy)
```

## Validation (validate.ts)

### Phase 1: Structural Checks
- Table exists, row count > 0
- Schema has all expected columns
- `asset_class` values are exactly `{OIL, GOLD, SILVER}` (no UNKNOWN)
- All `coin` values match the filter regex `/^(xyz:(CL|GOLD|SILVER)|cash:(GOLD|SILVER))$/`
- Timestamps in expected range (Feb-Mar 2026)
- No negative notional values
- No zero-price fills (`px > 0`)

### Phase 2: Portal Cross-Reference
- Use `portal_query_hyperliquid_fills` with `coin: ['xyz:CL']` for a 1000-block sample range from the middle of the indexed data
- Compare fill count from Portal vs ClickHouse `SELECT count() FROM hl_oil_crisis.fills WHERE coin = 'xyz:CL' AND block_number BETWEEN X AND Y`
- Tolerance: 5% (sync timing differences)
- If divergence > 5%, the coin filter regex or pipe transform has a bug

### Phase 3: Transaction Spot-Checks
- Pick 2-3 `xyz:CL` fills from ClickHouse: `SELECT block_number, user, px, sz, side, dir FROM hl_oil_crisis.fills WHERE coin = 'xyz:CL' ORDER BY notional DESC LIMIT 3`
- Query Portal for those specific blocks: `portal_query_hyperliquid_fills({ coin: ['xyz:CL'], from_block: N, to_block: N+1 })`
- Verify exact match on: `user`, `px`, `sz`, `side` (B/A → Buy/Sell), `dir`

## Directory Structure

```
hyperliquid/006-oil-crisis/
├── src/
│   └── index.ts          # Indexer
├── dashboard/
│   ├── index.html        # Bloomberg-style dashboard
│   └── screenshot.png    # Captured with real data
├── validate.ts           # Structural + truth verification
├── docker-compose.yml    # ClickHouse with persistent volume
├── clickhouse-cors.xml   # CORS headers
├── package.json          # Pinned deps
├── tsconfig.json
├── .env                  # ClickHouse credentials
├── contracts.json        # N/A for Hyperliquid (no on-chain contracts)
├── PROMPT.md             # Verbatim prompt
├── OUTPUT.md             # Narrative
├── IMPROVEMENTS.md       # Feedback
├── META.json             # Metadata
└── README.md             # With screenshot, verification, run instructions
```

## protocols.json Update

Add new entry after the existing 5 Hyperliquid indexers:

```json
{
  "name": "Hyperliquid Oil Crisis",
  "slug": "hyperliquid-oil-crisis",
  "category": "Derivatives",
  "tvl": 4500000000,
  "vm": "hyperliquid",
  "chains": ["Hyperliquid"],
  "angle": "Oil crisis tracker — WTI crude, gold & silver perps during Iran shock",
  "directory": "hyperliquid/006-oil-crisis",
  "status": "pending"
}
```
