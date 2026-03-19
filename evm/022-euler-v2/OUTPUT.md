# Output — Euler V2

## Angle
Track the modular vault ecosystem growth via EVC-mediated interactions and factory vault creation on Euler V2.

## Key Decisions
1. **EVC + Factory approach** — Since Euler V2 uses a factory pattern (each vault is its own contract), we can't subscribe to all vault addresses dynamically. Instead, we index the EVC (mediator for all vault operations) and the Factory (vault creation). This captures all ecosystem activity through two static addresses.
2. **Three EVC event types** — CallWithContext (every vault operation), VaultStatusCheck (solvency), AccountStatusCheck (user health). These give a complete picture of protocol usage.
3. **477 vaults discovered** — The factory has created 477 vault proxies in ~1 year, showing healthy ecosystem growth.

## Issues Encountered
- No issues — clean generation. The EVC approach avoids the factory pattern complexity entirely.

## Results
- 240,283 events: 104K calls, 102K vault checks, 33.5K account checks, 477 vault creations
- 446 unique active vaults
- 11.4K unique callers
- 12 months of data (Aug 2024 → Aug 2025)
