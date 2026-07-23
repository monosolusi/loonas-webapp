---
name: project-finance-nav-ia
description: Accounting FE nav home is the "Keuangan" NavigationGroup (feature-gated on accounting); current children Buku Besar / Jurnal Umum / Biaya Tetap
metadata:
  type: project
---

The accounting/finance FE nav lives in `src/app/(authenticated)/_components/finance-nav-group.tsx` as a `NavigationGroup` labelled **"Keuangan"**, rendered only when `account.hasFeature("accounting")` (so the whole accounting surface is feature-gated client-side via `useGetCurrentAccount`).

Current children (2026-06-14):
- `/finance/ledger` → "Buku Besar" (General Ledger)
- `/finance/journals` → "Jurnal Umum" (Journals)
- `/finance/fixed-costs` → "Biaya Tetap" (Fixed Costs)

New accounting report/period/CoA/opening-balance surfaces extend THIS group (add `NavigationChildItem` + a `matchPrefixes` entry). Tax-posture settings belong under `/settings`. Reusable pieces already present: `finance/_components/date-range-picker.tsx`, `finance/_components/summary-card.tsx`, and `features/accounting/.../ledger-account-combobox.tsx`. New `(authenticated)/` routes also need a `ROUTE_MAP` entry in `_components/header-title.tsx` or the chrome title falls back to "Dashboard".

**Why:** grounds where new accounting FE surfaces hang in the IA and which existing primitives to reuse. **How to apply:** reference this nav group + reuse list in any new accounting FE ticket's scope section. See [[project-accounting-be-done-fe-gap]].
