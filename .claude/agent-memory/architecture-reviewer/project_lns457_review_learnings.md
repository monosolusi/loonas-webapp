---
name: lns457-review-learnings
description: LNS-457 (PERIOD_HAS_FAILED_POSTINGS 422 handling) review — cross-feature reuse precedent, single-consumer provider state precedent, and where diff scope actually lived (working tree, not committed).
metadata:
  type: project
---

Reviewed `feat/lns-457-handle-period-has-failed-postings` (2026-07-17). Notable, reusable-in-future-reviews
findings:

1. **`git diff origin/dev...HEAD` / `dev...HEAD` was empty** even though the branch clearly had the LNS-457
   work — the changes were all uncommitted working-tree edits (`git status --short` showed them, diff
   against `dev` did not, since nothing was committed yet). Lesson: when a name-only diff against the base
   branch comes back empty on a feature branch that's supposed to have changes, check `git status --short`
   before concluding "nothing to review" — the work may simply not be committed yet.

2. **Cross-feature reuse of `features/accounting/*` from page-level providers in OTHER features is
   established precedent, not a new pattern to flag.** `fixed-cost-entries-provider.tsx` (a `fixed-cost`
   page provider) already imports `AccountingPeriodEntity`, `useListPeriods`, `useClosePeriod`, and
   `ACCOUNTING_SWR_KEYS` from `features/accounting/presentations/*` — because closing a period is
   fundamentally an accounting-domain concern even when triggered from the fixed-costs page. So placing a
   NEW shared helper (`close-period-error.ts`) and component (`close-period-escalation-hint.tsx`) under
   `features/accounting/presentations/` for reuse by both `/finance/periods` and `/finance/fixed-costs` is
   consistent with this precedent — don't flag as a layering concern.

3. **Single-consumer provider state (`closePeriodError`) already existed pre-diff in both
   `periods-provider.tsx` and `fixed-cost-entries-provider.tsx`**, each consumed by exactly one dialog
   component. Adding `closePeriodFailureCount` next to it (also single-consumer) mirrors that existing
   choice rather than introducing a fresh violation. Real constraint discovered: moving the counter to
   component-local state isn't a clean win, because the increment/reset decision depends on inspecting the
   raw `ServerError.code` inside the provider's mutation catch block — the component only ever sees the
   already-resolved string message and the boolean return of `handleClosePeriod`. Flag as Minor at most,
   not Major, when this shape recurs (action handler + its result-state naturally co-locate in the
   provider that owns the mutation).

4. See [[feedback_centralize_predicate_with_message_helper]] for the specific duplicated-guard finding
   from this review.

5. `http-request.ts` double-nests `details` for any error code that survives `ErrorCodes.find(data.code)`
   matching (`throw new ServerError(ErrorCode, { ...msg, details: data.details })` inside a constructor that
   does `this.details = Object.assign({}, {code,message}, details)` — so `err.details.details.<field>` is
   correct, not a bug, for any handler reading structured 422 detail payloads). Confirmed accurate via
   `src/core/helpers/http-request.ts:72-76`. Worth checking this same double-nesting anytime a future review
   touches a helper that reads `err.details`.
