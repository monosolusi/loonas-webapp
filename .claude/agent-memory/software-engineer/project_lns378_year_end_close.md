---
name: project_lns378_year_end_close
description: LNS-378 year-end close + retained earnings rollover implementation; key decisions and risk mitigations
metadata:
  type: project
---

LNS-378 year-end close + retained earnings rollover shipped 2026-06-25 (in progress, not yet PRed).

Key decisions:
- Retained-earnings account is code `3200` ("Saldo Laba Ditahan"), preselected via `useMemo(() => accounts.find(a => a.code === "3200") ?? null, [accounts])` in `close-year-dialog.tsx`.
- `confirmationToken` for reopen-year = raw `closingJournalCreatedAt` string verbatim — never re-derived via DateTime (R2).
- GET year summary returns `close_journal_id` (for display); POST close-year response returns `closing_journal_id` (for result) — different keys, correctly wired.
- `closingJournalCreatedAt` defaults to `null` (never `""`); `canUnlock` getter returns false when null.
- Use cases define own param classes AND own result types (`CloseYearUseCaseResult`, `ReopenYearUseCaseResult`). These are exported from the usecase file and imported by hooks. The repo interface keeps its own `CloseYearResult`/`ReopenYearResult` (data-layer contract only); the usecase maps repo result → usecase result with an explicit `DataSuccess` constructor. Hooks must NEVER import result types from `domain/repositories` — always from the usecase file.
- `useRetainedEarningsAccount` extracted to `presentations/hooks/use-retained-earnings-account.ts` (not co-located in a component file).
- Post-reopen reversal journal id (`reversalJournalId` from mutation result) stored as `reopenedReversalJournalId` on provider; shown as transient `YearEndJournalReference` strip (label "Jurnal pembalik:") in `year-end-panel.tsx` while year is open. `YearEndJournalReference` has optional `label` prop; renders without a date when `closingJournalCreatedAt` is null.
- Year-end state + actions added to existing `PeriodsProvider` (not a new provider).
- Inline close/reopen year error uses same banner pattern as period dialogs (warning for close, error for reopen).
- 403 on reopen-year → toast "Hanya admin yang dapat membuka kembali tahun." (graceful degrade, no role gate).
- Year summary SWR key gated null until `selectedYear != null` (always truthy since it defaults to current year).
- Both LIST_ACCOUNTING_PERIODS and GET_ACCOUNTING_YEAR_SUMMARY are revalidated after close/reopen year mutations.

**Why:** R1–R6 risk list in EL brief; critical to not confuse the two journal-id keys or token-pass-through.

**How to apply:** When touching year-end close flows, re-check the key names and confirm confirmationToken is passed verbatim from the SWR-cached entity field (not re-serialized).
