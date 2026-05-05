# QuarterlyBonus → Scaffold-ETH 2 Migration Plan

## Why this is the right move

Your current app is Scaffold-ETH v1-era (CRA + React 17 + older wallet stack). Scaffold-ETH 2 gives:
- Next.js + TypeScript app structure
- wagmi + viem contract hooks
- modern wallet UX (RainbowKit)
- cleaner path to production deployment

## Target architecture

- Smart contracts: keep in `packages/hardhat`
- Frontend: add `packages/nextjs` (SE2-style)
- Chain target: ThunderCore mainnet/testnet (`thunder`, `testthunder`)

## Proposed phases

### Phase 1 — Bootstrap SE2 frontend in this repo
1. Add `packages/nextjs` from scaffold-eth-2 template.
2. Keep existing `packages/react-app` temporarily for rollback.
3. Wire frontend to current contract artifacts.

### Phase 2 — ThunderCore network wiring
1. Add ThunderCore networks to Next.js scaffold config.
2. Ensure chain IDs are mapped correctly:
   - testthunder: `18`
   - thunder: `108`
3. Verify wallet network switching + RPC connectivity.

### Phase 3 — MVP production UI
Build these screens first:
1. **Game Dashboard**
   - Pot
   - Quarterly bonus pool
   - Employee count
   - User points / redeemable
2. **Actions panel**
   - Buy In
   - Redeem
   - Compound
3. **Transparency panel**
   - Contract address
   - Fee breakdown
   - Round timing / payout status

### Phase 4 — Production hardening
1. Add E2E tests (Playwright) for critical flows.
2. Add Sentry.
3. Add analytics (Plausible/PostHog).
4. Add safe transaction feedback + error parsing.

## Visual/UI libraries (recommended)

- Core UI: Tailwind + DaisyUI (native SE2 style)
- Animations: Framer Motion
- Charts: Recharts
- Optional game-like effects: PixiJS (for subtle particles/celebration only)

## Notes

- Do **not** cut over immediately. Keep old frontend running until parity checks pass.
- Contract interactions should use SE2 hooks (`useScaffoldReadContract`, `useScaffoldWriteContract`).
- Prioritize clarity and trust over flashy visuals for financial actions.
