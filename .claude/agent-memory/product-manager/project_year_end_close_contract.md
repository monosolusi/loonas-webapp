---
name: year-end-close-contract
description: LNS-378 year-end close/reopen-year contract — RE acct=3200 (NOT 3300); confirmation_token = year-summary closing_journal_created_at (verbatim raw string); 8 new error codes; year-summary shape NET-NEW; GET close_journal_id vs POST closing_journal_id key-trap; inline placement, 403-degrade admin gate
metadata:
  type: project
---

LNS-378 FE year-end close + retained-earnings rollover + admin reopen-year. Built on shipped LNS-377/LNS-405 periods infra. BE shipped (LNS-108); blockers LNS-377 + LNS-368 both Done.

**Why:** Highest-stakes destructive flow in the accounting batch — books-locking annual close. Token-source ambiguity was the half-blocker (LNS-368 Q2), now resolved.

**How to apply:** ground any year-end PRD/AC on these contract facts, not the ticket body (ticket has stale "blocked on LNS-368" lines + a `LedgerAccountptionCombobox` typo → real component is `LedgerAccountCombobox`).

**3 endpoints (verified via LNS-368 BE comment citing BE file:line — NOT from live spec; summarizer truncates before year-end paths):**
- `POST /accounting/periods/close-year` {year*, retained_earnings_account_id (**BE-OPTIONAL**)} → {`closing_journal_id`, periods[]}. Idempotency-Key required.
- `GET /accounting/periods/year/{year}` → {year, periods[], `close_journal_id`(uuid NULLABLE), `closing_journal_created_at`(date-time NULLABLE = token source), locked(bool)}. **NET-NEW typed shape, NOT AccountingPeriodEntity** (wraps periods[] + journal refs; nested periods[] DO reuse AccountingPeriodEntity). **KEY TRAP: GET returns `close_journal_id`; POST close-year returns `closing_journal_id` — DIFFERENT keys, don't conflate.** Field names EL-verified Phase-2.
- `POST /accounting/periods/reopen-year` {year*, confirmation_token*, reason*(min10)} → {reversal_journal_id, periods[]}. Admin-only (role ACCOUNTING_YEAR_UNLOCK). Idempotency-Key required.

**confirmation_token (the LNS-368 Q2 answer):** = the closing journal's `created_at`, returned by GET year/{year} as `closing_journal_created_at`. FE flow: GET year-summary FIRST → read field → pass back **VERBATIM as the RAW STRING** to reopen-year (BE matches BYTE-FOR-BYTE — **never parse/reformat through Luxon**; it's a stale-write guard). Mismatch → `YEAR_UNLOCK_TOKEN_MISMATCH` (422). reason <10 → `PERIOD_REOPEN_REASON_REQUIRED` (400).

**8 ErrorCodes to register (none exist in server-error.ts; Bahasa copy):** `MONTHLY_PERIODS_NOT_CLOSED`(409, open-months precondition), `YEAR_ALREADY_CLOSED`(409), `YEAR_NOT_CLOSED`(409), `YEAR_UNLOCK_TOKEN_MISMATCH`(422), `YEAR_CLOSE_BOUNDARY_INVALID`(422), `RETAINED_EARNINGS_ACCOUNT_INVALID`(422), `PERIOD_REOPEN_REASON_REQUIRED`(400), `FEATURE_NOT_AVAILABLE`(403).

**Admin gate for reopen-year (RESOLVED Phase-2):** NO capability flag on the year contract → use **403-graceful-degrade** (show reopen optimistically, degrade on 403 FORBIDDEN, precedent `periods-provider.tsx:163`). Do NOT invent a primitive, do NOT re-block. See [[periods-close-infra]], [[lns405-capability-adoption]].

**Placement (RESOLVED Phase-2):** INLINE on `/finance/periods` under existing PeriodsProvider (sibling dialogs + header action) — NO new route, NO ROUTE_MAP/nav change.

**Retained-earnings account = code 3200 "Saldo Laba Ditahan" (NOT 3300 — 3300 is a different excluded code).** EL-verified vs shipped `wizard-balances-step.tsx:50`/`compute-retained-earnings-line.ts`. `retained_earnings_account_id` BE-OPTIONAL → FE preselects 3200 best-effort (`useListLedgerAccounts limit 500`); if absent leave combobox empty, BE resolves, map 422 `RETAINED_EARNINGS_ACCOUNT_INVALID`. Closing/reversal journal id links to detail via LNS-372. Reuse `LedgerAccountCombobox` (props-based, excludeIds) + reason-textarea precedent `reopen-period-dialog.tsx`.

**UID final:** AnnualPeriodRow variant in PeriodsTable; close-year = weighty LoonasDialog(md) + checkbox-ack gating DangerButton (Danger, vs monthly's Primary); reopen = "Buka kembali →" text-link below closed annual row (absent for non-admins); journal-ref = single-line mono-id strip linking /finance/journals/{id} (mirrors LNS-405 PeriodAdvisory sub-row). status enum grew to ['open','closed','locked']; isClosed already treats locked as closed. Atomicity: refetch year-summary after close/reopen (don't trust mutation response alone); surface `reopened_count` if present.
