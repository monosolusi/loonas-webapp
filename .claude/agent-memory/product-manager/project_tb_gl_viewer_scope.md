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

**Contract — CONFIRMED by EL raw-spec parse + re-validated at acceptance (PR #76, zero drift):** WebFetch truncated before `/accounting/reports/*` (same as LNS-373 Neraca), so EL parsed the raw spec. Final shapes:
- **TB** = nested `groups[] → accounts[]`. Each account row carries SIX figures (`opening_/period_/closing_debit|credit`) — there is NO single "balance" column. Plus `account_code/name`, `account_type` (10-enum), `natural_side`, `is_abnormal_balance`. Group: `group` (5-enum), `label`, `display_order`, `group_subtotal{debit_total,credit_total,net_position}`. Root `totals` (six `*_total`) + `_imbalance{is_balanced,delta,delta_side}`. `meta.fiscal_year_start` is load-bearing (see drill below).
- **GL summary is FOUR cards, no scalar "Mutasi"**: Saldo Awal (`opening_balance`) / Mutasi Debit (`period_debit_total`) / Mutasi Kredit (`period_credit_total`) / Saldo Akhir (`closing_balance`). GL `lines[]` carry `running_balance`; `meta.truncated`+`line_cap` drive a truncation notice.
- **counterparts (both GL + TB-drill) are TOP-LEVEL arrays joined by `journal_entry_id`** — not a per-line field. `running_balance` is GL-only; TB-drill lines have none.
- **TB-drill `{account_id}` resolution:** TB rows carry NO uuid, but the drill path needs a CoA uuid → resolve `account_code → uuid` at drill-open via `listCoaAccounts({search})` exact-code match (the list `limit` caps at 100, so do NOT prebuild a full code→id map). Drill window is FE-controlled: `from = meta.fiscal_year_start`, `to = as_of` (FY-to-date) — never omitted, no BE dependency.

**Drill `{account_id}` = ledger-account ENTITY id (CoA account being viewed), NOT a tenant id** — legitimate path param, does not violate JWT-only tenant resolution ([[jwt-only-tenant-resolution]]). Read-only GETs → no idempotency/double-submit guards needed (unlike money-movement endpoints).

Vocab: TB = "Neraca Saldo", GL = "Buku Besar"; Debit/Kredit, Saldo Awal/Mutasi/Saldo Akhir. See [[project-report-shell-contract]], [[project-neraca-contract]], [[project-finance-nav-ia]], [[reference-linear-accounting-fe-batch]].
