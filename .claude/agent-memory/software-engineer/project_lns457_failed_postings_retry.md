---
name: project_lns457_failed_postings_retry
description: LNS-457 PERIOD_HAS_FAILED_POSTINGS 422 handling + escalation-hint pattern across both close-period entry points
metadata:
  type: project
---

LNS-457 shipped 2026-07-17 (branch `feat/lns-457-handle-period-has-failed-postings`, not yet PRed): distinct 422 handling for `PERIOD_HAS_FAILED_POSTINGS` on both `/finance/periods` and `/finance/fixed-costs` close-period dialogs, plus a consecutive-failure escalation hint. No BE work — pure FE 422-discrimination + copy.

Key decisions:
- Registered `ErrorCodes.PERIOD_HAS_FAILED_POSTINGS` (httpCode 422) in `src/core/resources/server-error.ts` — count-less fallback copy lives on `.message`.
- One shared helper, `resolveClosePeriodErrorMessage(err)` in `src/features/accounting/presentations/helpers/close-period-error.ts`, curates copy for ALL THREE close-period 422 codes (`PERIOD_HAS_FAILED_POSTINGS` with count interpolation, `PPH_FINAL_NOT_POSTED` verbatim, default `PERIOD_NOT_DRAINED`). Both providers call this helper instead of branching inline — this is also what stopped fixed-costs' provider from leaking raw BE `err.message` on 422 (it previously did `setClosePeriodError(err.message)` for every 422, PM-approved fix to route through the same curated helper as periods).
- Failed-postings count reads from `err.details?.details?.failed_count` (double-nested — see `[[project_server_error_nested_details_access]]`/EL's note) with a `typeof === "number" && Number.isFinite && >= 1` guard before interpolating; anything else falls back to the registered `.message`.
- New shared props-less component `ClosePeriodEscalationHint` (`src/features/accounting/presentations/components/close-period-escalation-hint.tsx`) — modeled on `AccumulatedDeficitBlock`'s WhatsApp button behavior but recolored to `text-warning-500` (not `text-error-500`), using `LOONAS_WHATSAPP_URL` from `@/core/utilities/contact` (currently `""` — button renders `disabled`).
- Escalation counter (`closePeriodFailureCount`) is in-memory `useState` per provider, incremented ONLY on consecutive `PERIOD_HAS_FAILED_POSTINGS` 422s, reset to 0 on: success, dialog open, dialog dismiss, any other error code/status. Hint shows at `>= 2`. Never gates the retry button — retry is just re-clicking the existing "Tutup periode" button, which mints a fresh `crypto.randomUUID()` idempotency key per click (left those lines untouched on purpose).
- Both dialogs wrap the error callout in an ALWAYS-MOUNTED `<div role="status" aria-live="polite" aria-atomic="false">` (not conditionally rendered) so screen readers announce message changes across retries; `key={closePeriodFailureCount}` on the inner callout div forces re-announcement even when the message text is identical across attempts.

**Why:** EL plan called out two traps from a prior near-miss: (1) shallow `err.details.failed_count` silently renders count-less copy and passes tsc/lint — must read via the shared helper only; (2) hoisting/memoizing the idempotency key would make BE serve a cached 4xx and break retry.

**How to apply:** Any future close-period 422 or copy change should go through `resolveClosePeriodErrorMessage` — do not re-inline the branching in a provider. If a third close-period entry point is ever added, wire it through the same helper + `ClosePeriodEscalationHint`, and keep the idempotency-key mint inside the per-call handler, never hoisted.
