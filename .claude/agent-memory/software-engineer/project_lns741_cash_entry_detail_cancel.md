---
name: project_lns741_cash_entry_detail_cancel
description: LNS-741 cash-entry detail + cancel-by-reversal route — two findings worth carrying forward
metadata:
  type: project
---

Shipped 2026-08-27 on `feat/cash-entry-detail-cancel` (base `release/kas-masuk-kas-keluar`): the
`/accounting/cash-entries/[id]` route (page, provider, 7 components, 4 `_utils` + tests) plus the
planned move of `shouldRotateIdempotencyKey` to `src/core/helpers/idempotency-rotation.ts`.

**The plan's "only importer" claim for a helper being moved was stale — grep before trusting it.**
The approved plan said `pos-provider.tsx` was the only importer of the invoice-scoped
`idempotency-rotation` helper being relocated to core. `grep -rl` found a second real importer,
`src/features/inventory/presentations/components/stock-adjustment-dialog.tsx`. The task's own scope
item 4 ("any other file that imports idempotency-rotation — import path ONLY, grep first") already
covered this, so it wasn't a scope violation — but it would have been a broken build if I'd trusted
the plan's headcount instead of grepping. Same defect class as [[feedback_verify_investigate_premise_before_acting]].

**A Luxon `DateTime.fromISO(iso).toFormat(...)` with no `.setZone()` renders in the SYSTEM zone, not
the ISO string's embedded offset** — confirmed by running the suite locally (system zone
Asia/Singapore, +08:00) against a `+07:00` fixture: the un-setZone'd `formatTimestamp` returned
`10:15`, not the naively-expected `09:15`. This matches `journal-detail-info-card.tsx`'s
`createdAtDisplay` precedent (also no `.setZone()`), so the *production* behavior is correct and
consistent with the existing codebase — but any **test** asserting an exact `HH:mm` string against
such a formatter is environment-dependent and will flake across machines/CI runners with different
system zones. Fix: pin `Settings.defaultZone = "Asia/Jakarta"` (from `luxon`) at the top of the test
file, not in the production code — this doesn't change the function's real behavior, only makes the
*test's* expectation deterministic. Any future `_utils/*.test.ts` asserting formatted-time output
from a no-`.setZone()` Luxon call should do the same.
