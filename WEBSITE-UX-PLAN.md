# QuarterlyBonus Website & Interface Plan (Production Direction)

## Product goals
- Make bonus mechanics understandable in under 30 seconds.
- Let users complete critical flows fast: connect wallet, check eligibility, buy-in, redeem/compound.
- Build trust with transparent on-chain state and transaction history.

## Information architecture
1. **Landing / Overview**
   - Value proposition, key metrics, network status (ThunderCore), and CTA.
2. **Dashboard**
   - User state: eligibility, accrued bonus, buy-in status, last redeem, next redeem window.
3. **Actions panel**
   - Primary actions: `Buy In`, `Redeem`, `Compound` with clear preconditions.
4. **Protocol insights**
   - Contract treasury, payout rate, total participants, recent redemptions.
5. **Support / Docs**
   - Risk disclosures, FAQ, and a concise “How bonus works” explainer.

## Recommended visual/UX stack
- **Framework**: Next.js (already in place via Scaffold-ETH 2).
- **Wallet + chain UX**: `wagmi`, `viem`, `rainbowkit`.
- **Styling**: `tailwindcss` + `daisyUI` (already present).
- **Data fetching/cache**: `@tanstack/react-query`.
- **Charts/visual analytics**: `recharts` (lightweight, React-native patterns) or `nivo` (richer visuals).
- **Micro-interactions**: `framer-motion` for transitions and status feedback.
- **Icons**: `@heroicons/react`.
- **Toasts/notifications**: `react-hot-toast`.

## Design language proposal
- Theme: dark-first "financial command center" look.
- Color semantics:
  - Positive accrual: emerald.
  - Warnings/eligibility blockers: amber.
  - Failed tx/error: rose/red.
  - Network state: electric blue accent for ThunderCore branding.
- Typography:
  - Inter for UI readability.
  - JetBrains Mono for on-chain values/addresses.

## Core UI components to implement next
- `BonusStatCard` (metric + delta + tooltip)
- `ActionGuardButton` (handles disabled reasons and preflight checks)
- `TxTimeline` (pending/mined/failed)
- `EligibilityBadge` (active/inactive with reason)
- `TreasuryHealthPanel` (treasury, payout exposure, participant counts)

## Production readiness checklist (frontend)
- [ ] All action buttons have deterministic disabled states and reason text.
- [ ] Every transaction has optimistic + confirmed + failed UI states.
- [ ] Error messages are human-readable (not raw RPC traces).
- [ ] Wallet/network mismatch prompts are explicit and actionable.
- [ ] Contract reads are cached + invalidated on successful writes.
- [ ] Mobile layout validated at 360px width.
- [ ] Lighthouse: Performance >= 85, Accessibility >= 90.

## Suggested next implementation phase
1. Wire contract reads to dashboard cards.
2. Implement guarded write actions with transaction state machine.
3. Add analytics charts for accrual/redeem trends.
4. Ship responsive polish + accessibility pass.
