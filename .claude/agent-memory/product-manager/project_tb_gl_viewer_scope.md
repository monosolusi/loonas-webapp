---
name: tb-gl-viewer-scope
description: LNS-375 TB + GL report viewers — what report module-layer plumbing already exists vs is missing (drill is net-new); endpoints + typed-shape gap
metadata:
  type: project
---

LNS-375 ("FE: Trial Balance + General Ledger viewers with drill-down + pagination", High, Feature, In Progress 2026-06-16). Blocked-by LNS-365 (shell) + LNS-373 (hub) — both Done. FE-only (no fe-requested-be); TB/GL compute + drill endpoints BE-shipped.

**Already scaffolded by LNS-365 (do NOT re-create):**
- TB compute: `GetTrialBalanceReportUseCase`, `getTrialBalance` repo+source → `GET /accounting/reports/trial-balance` (query `as_of` req, `include_zero` opt), hook `use-get-trial-balance-report.ts`, SWR key `GET_TRIAL_BALANCE_REPORT`.
- GL compute: `GetGeneralLedgerReportUseCase`, `getGeneralLedger` repo+source → `GET /accounting/reports/general-ledger/{accountId}` (query `from`,`to` req, `page`,`limit` opt; returns `{data, meta}`), hook `use-get-general-ledger-report.ts`, SWR key `GET_GENERAL_LEDGER_REPORT` (pagination-aware).
- Shell `ReportShell` + `ReportsTabStrip` (TB tab id `trial-balance`, GL tab id `buku-besar` — BOTH present but `disabled:true` + "Segera hadir"), pagination primitives, `LedgerAccountCombobox`.

**MISSING — net-new FE work this ticket owns:**
- **TB drill `listTrialBalanceLines`** (`GET /accounting/reports/trial-balance/{account_id}/lines`, query from/to/page/limit) — NO usecase/repo/source/hook/SWR key exists anywhere. Net-new, pagination-aware. The ticket lists the endpoint as "consumed" but the plumbing was never built.
- **Typed entities** — TB + GL report data is still `Record<string,any>` passthrough (shell left it untyped). Define `TrialBalanceReportEntity` + `GeneralLedgerReportEntity` + `TrialBalanceLineEntity` (+ models), LNS-373 Neraca-entity pattern.
- **Providers/impls/viewers** (NeracaProvider/NeracaImpl/NeracaViewer precedent at `/finance/reports/`), and **enable both tabs in `reports-tab-strip.tsx`** + wire `onTabChange`.

**Contract caveat:** deep field shapes (TB `groups[]`/`totals`/`_imbalance`, TB-lines drill, GL `summary`/`lines[]`/`counterparts[]`) UNCONFIRMED — WebFetch truncated before `/accounting/reports/*` (same as LNS-373 Neraca). Delegated to EL raw-spec parse, NOT assumed. Ticket asserts TB = `{meta, groups[], totals, _imbalance}` — verify (Neraca precedent was 3-level nested, not the first-assumed flat shape).

**Drill `{account_id}` = ledger-account ENTITY id (CoA account being viewed), NOT a tenant id** — legitimate path param, does not violate JWT-only tenant resolution ([[jwt-only-tenant-resolution]]). Read-only GETs → no idempotency/double-submit guards needed (unlike money-movement endpoints).

Vocab: TB = "Neraca Saldo", GL = "Buku Besar"; Debit/Kredit, Saldo Awal/Mutasi/Saldo Akhir. See [[project-report-shell-contract]], [[project-neraca-contract]], [[project-finance-nav-ia]], [[reference-linear-accounting-fe-batch]].
