# Dashboard Template

Base HTML template for ai-pipes example dashboards.

## Usage

Copy `index.html` into your example's `dashboard/` directory and customize:

1. Update the header (protocol name, angle)
2. Write ClickHouse queries for your indexed data
3. Create charts using the `createChart()` helper
4. Adjust chart grid (remove unused containers, change layout)

## Design Constraints

- Dark theme (do not change base colors)
- 1200x675 viewport (optimized for X card screenshots)
- Self-contained: CDN dependencies only, no imports from this directory
- Subtle watermark in footer
