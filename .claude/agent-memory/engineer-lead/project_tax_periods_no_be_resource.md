---
name: tax-periods-no-be-resource-v1
description: No tax-periods BE endpoint as of 2026-05-12; FE derives the period selector window client-side from Luxon, swap to real endpoint in v2.
metadata:
  type: project
---

There is no `/accounting/tax-periods` or `/accounting/periods` endpoint in the FE codebase as of 2026-05-12, and `listJournals` is page/limit/search-only (B4: `reference_type` filter lands v2). B5 mentions `tax-periods` as a future ACCOUNTANT write surface but the resource is not yet implemented.

**v1 fallback decision:** Period selector at `/finance/tax` uses a 12-month rolling window derived client-side via Luxon. Hook: `src/features/accounting/presentations/hooks/use-list-tax-periods.ts` returns `{ periods: string[], currentPeriod: string }` as `YYYY-MM`. No SWR — pure derivation. Constant `TAX_PERIOD_WINDOW_MONTHS = 12` lives in `src/features/accounting/domain/constants/tax-periods.ts`.

**Why client-side:** "No new BE asks" directive for v1. Deriving from journal pagination is brittle (no date filter, full walk required). Rolling window is stable, predictable, zero BE round-trips, and new operators still see a populated selector.

**How to apply:** When v2 tax-periods resource lands, swap the hook implementation only — `PeriodSelector` props stay the same. Period objects will gain `{ period, status: "open"|"settled", settledAt }`. v1 settle-status chip ("Belum disetel"/"Sudah disetel") is derived per-period on selection via `getAccountBalance(2210)` — confirm balance-by-period support during P3, not now. Future-proofs FR-4 (period-driven IA so PPN columns drop in without redesign).
