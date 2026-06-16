---
name: tb-gl-contract-2026-06-16
description: LNS-375 verified live BE Trial-Balance + GL + TB-drill report contracts — exact field shapes, flat-vs-nested, counterparts placement, cap flags
metadata:
  type: project
---

Verified verbatim from live OpenAPI (`https://dev-api.loonas.id/openapi.json`, Loonas API 1.0.0 / OpenAPI 3.0.3) on 2026-06-16 for LNS-375 Phase-2 feasibility, via curl+python raw parse (WebFetch truncates — see [[openapi-webfetch-truncation]]).

**Why:** PM could not confirm deep shapes (WebFetch truncated before /accounting/reports/*). These three contracts gate LNS-375's typed entities (today `Record<string,any>` passthrough). The LNS-365 compute plumbing (getTrialBalance/getGeneralLedger) already exists end-to-end but returns untyped passthrough; the TB-drill is net-new.

**How to apply:** When writing LNS-375 typed models/entities, mirror these EXACT keys. Use composite `${account_code}-${index}` for any list id derived from account_code (codes not unique across groups; same Rule-16 fix as Neraca). Drill `id` IS a real uuid (use it directly).

### GET /accounting/reports/trial-balance (opId getTrialBalance) — GROUP report, NESTED
Params: `as_of`* (query, regex ^\d{4}-\d{2}-\d{2}$), `include_zero` (query bool, default false), `api-version` header default v1. Response `{ data: TrialBalance }`.
- `meta`: tenant_id(uuid), fiscal_year_start(date), as_of_date(date), include_zero(bool), generated_at(date-time).
- `groups[]` = TrialBalanceGroup: group enum(asset|liability|equity|revenue|expense), label(string), display_order(int), accounts[], group_subtotal{debit_total,credit_total,net_position}.
- `groups[].accounts[]` = TrialBalanceRow: account_code, account_name, account_type enum(asset|contra_asset|liability|equity|contra_equity|revenue|contra_revenue|expense|contra_expense|cogs), natural_side enum(debit|credit), opening_debit, opening_credit, period_debit, period_credit, closing_debit, closing_credit, is_abnormal_balance(bool). NOTE: no single "balance" field — six debit/credit columns.
- `totals`: opening_debit_total, opening_credit_total, period_debit_total, period_credit_total, closing_debit_total, closing_credit_total.
- `_imbalance`: debit_total, credit_total, delta, delta_side enum(debit|credit|balanced), is_balanced(bool). RICHER than Neraca's _imbalance; mapImbalance/NormalizedImbalance only needs {is_balanced, delta} so lossy-compatible.

**DRILL UUID GAP (LNS-375 fix-loop, runtime-breaking):** `TrialBalanceRow` (the GROUP-report account row) carries NO uuid — only `account_code` (+name/type/side/six-figures/is_abnormal_balance). But the drill path param `{account_id}` is a genuine `format:uuid`, desc "UUID of the CoA account to drill into" (identical to GL). So a TB row click has NO uuid to put in the drill path. RESOLUTION (no BE relay): resolve `account_code → CoA uuid` at drill-open via `useListLedgerAccounts({ search: account_code })` then EXACT-match `a.code === account_code` (search is contains-match; 1100 vs 11000 collision) → `a.id`, gate the drill fetch on the resolved id. Do NOT build a full `Map<code,id>` from the accounts list: `listCoaAccounts` `limit` is spec-capped at 100 (the existing combobox passes limit:500 which BE clamps — pre-existing latent bug, don't replicate). The TB row entity `id` stays the composite `${account_code}-${index}` React key; pass `accountCode` (not `id`) to the drill panel.

### GET /accounting/reports/trial-balance/{account_id}/lines (opId listTrialBalanceAccountLines) — DRILL, FLAT + paginated. NET-NEW FE method.
Params: `account_id`* (path uuid = CoA account id), `from`(query, date regex, NOT required in schema), `to`(query, date regex, NOT required), `page`(query int min1), `limit`(query int min1 default 50), api-version header. Response `{ data: TrialBalanceLineRow[], counterparts: TrialBalanceLineRow[], meta: PaginationMeta }`.
- `data[]` = TrialBalanceLineRow: id(uuid), journal_entry_id(uuid), date(date), memo(string|null), reference_type(string|null), reference_id(string|null), account_code, account_name, debit(number), credit(number). NO running_balance on TB-drill rows.
- `counterparts[]`: SAME TrialBalanceLineRow shape, TOP-LEVEL sibling array (not per-line). Keyed by journal_entry_id to join to a drill row.
- `meta` = PaginationMeta: page, limit, total, total_pages (snake) → maps to core PaginationMeta {page,limit,total,totalPages}.

### GET /accounting/reports/general-ledger/{account_id} (opId getGeneralLedger) — paginated, NESTED summary. Plumbing EXISTS, data untyped.
Params: `account_id`* (path uuid = CoA id), `from`*(query date), `to`*(query date), `page`(int min1), `limit`(int min1 max100 default50), api-version header. Response GeneralLedgerResponse `{ data: GeneralLedgerData, meta: PaginationMeta }`.
- `data.meta`: tenant_id(uuid), account_id(uuid), account_code, account_name, account_type(same 10-enum), from(date), to(date), generated_at(date-time), truncated(bool), line_cap(int). NOTE truncated/line_cap = server-side line cap → render a "results truncated" notice.
- `data.summary`: opening_debit, opening_credit, opening_balance, period_debit_total, period_credit_total, closing_debit, closing_credit, closing_balance, natural_side enum(debit|credit). PRD's "Saldo Awal/Mutasi/Saldo Akhir" maps: Saldo Awal=opening_balance, Saldo Akhir=closing_balance, Mutasi=period_debit_total/period_credit_total (TWO numbers, not one "movement"). No scalar "movement"/"mutasi" field — derive or show debit+credit totals.
- `data.lines[]` = GeneralLedgerLine: id(uuid), journal_entry_id(uuid), date, memo(string|null), reference_type(string|null), reference_id(string|null), reference_label(string|null), account_code, account_name, debit, credit, running_balance(number), entry_type enum(standard|opening_balance|closing), posted_by{kind enum(user|system), label}. Running balance field = `running_balance`.
- `data.counterparts[]` = GeneralLedgerCounterpart: id(uuid), journal_entry_id(uuid), account_code, account_name, debit, credit. TOP-LEVEL sibling array (NOT per-line) — join to a line via journal_entry_id. Renders as expandable detail or separate column, NOT a field inside each line row.

Errors all three: 400/403 → Error{code,message}. No 404, no documented empty-shape variant (empty-state = BE behavior, not schema-derivable).

E-3 (TB drill `from`): schema marks `from`/`to` BOTH optional with NO documented default → the default window is a BE business rule not in the schema. FLAG to BE: when `from` omitted, does BE default to fiscal-year-start, beginning-of-time, or echo as_of? FE plan should send `to=as_of` and an explicit `from` once BE confirms.
