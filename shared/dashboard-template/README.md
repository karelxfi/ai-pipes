# Dashboard Template

Base HTML template for ai-pipes example dashboards using Apache ECharts.

## Usage

Copy `index.html` into your example's `dashboard/` directory and customize:

1. Update the header (protocol name, angle)
2. Update `DB` variable to your ClickHouse database name
3. Add summary stats to the header
4. Write ClickHouse queries and create charts using ECharts

## Chart Type Guide

| Data Type | Chart | Example |
|-----------|-------|---------|
| Counts over time | Vertical bar with gradient | Liquidations per day |
| Rankings | Horizontal bar | Top assets by count |
| Composition | Treemap | Debt token breakdown |
| Continuous values | Area/line chart | TVL over time |

**NEVER use pie or donut charts.** Use treemaps for proportional data.

## Design Constraints

- Dark theme (background `#0d1117`, panels `#161b22`)
- 1200x675 viewport (optimized for X card screenshots)
- Self-contained: CDN dependencies only, no imports from this directory
- Apache ECharts from `cdn.jsdelivr.net` (NOT TradingView Lightweight Charts)
- Footer: `Built with ai-pipes + SQD Pipes SDK | github.com/karelxfi | x.com/karelxfi`
- Set `window.__DASHBOARD_READY__ = true` when data loads (for screenshot capture)
- Always include legends on categorical charts
- Use counts not raw token amounts (decimal mismatch across tokens)
