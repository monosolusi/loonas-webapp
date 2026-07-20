---
name: accounting-lns96-fe-batch
description: LNS-96 Non-PKP UMKM accounting FE feature-completeness batch — shipped BE contracts, FE foundation already partially exists, key contract gotchas
metadata:
  type: project
---

Epic LNS-96 "Non-PKP UMKM Accounting Feature-Completeness" (CPO-locked). BE already shipped for all in-scope items; this batch is FE presentation only.

**Why:** CPO scoped a feature-completeness push for the non-PKP UMKM accounting suite; BE is done, FE lags.

**How to apply:** When planning any accounting FE work, check what already exists before scaffolding — the read layer is more built-out than it looks.

Key grounding facts (verified against openapi.json 2026-06-14):

- **Shared CoA read layer ALREADY EXISTS.** `LedgerAccountServiceImpl.list` calls `GET /accounting/accounts` (the CoA accounts endpoint, NOT a separate ledger endpoint). `use-list-ledger-accounts` + `LedgerAccountCombobox` already consume it. CoA list/read does NOT need building — only CoA *write* (create/update/delete) is net-new. The combobox is the reusable account picker for journal/opening-balance/year-end pickers.
- **Journal CRUD router split is real and asymmetric.** `/accounting/journals` (legacy) = list + post only. `/accounts/{accountId}/journals` = FULL CRUD: list/create/get/update/reverse. The richer router needs `accountId` in path — but FE never holds account id (resolved from JWT orgId server-side). FLAG: how does FE supply `{accountId}` for create/reverse/get? Likely BE accepts a sentinel or it's the org id surfaced somewhere — must ask BE. Existing `JournalServiceImpl.list` uses the legacy `/accounting/journals`.
- **Journal line shape = `{account_id, debit, credit}` integers** (exactly one of debit/credit > 0), NOT amount+side. Same shape for opening-balance lines (but opening-balance uses `number` not `integer`, and restricts to balance-sheet accounts; rejects header/retained-earnings 3300/income-statement).
- **createJournal/reverseJournal return `{data, warnings[]}`** and accept `acknowledged_warning_codes[]` — a two-phase warn/acknowledge flow. Reverse also requires `change_reason_category*` + `change_reason_detail*`.
- **laba-rugi is POST not GET** (body {from,to,compare_from,compare_to}); all other reports are GET. SWR keys must serialize the POST body into the key for laba-rugi.
- **Report responses are deeply nested bespoke trees** — each (Neraca/LabaRugiReport/ArusKas/TrialBalance/GeneralLedgerData/CalkResponse) has its own meta + sections/groups/notes + `_imbalance` block. No shared report DTO; each viewer is its own presentational tree. Shared parts are only: date-range control, report shell/export, `_imbalance` banner, `{data}` unwrap.
- **No GET /accounting/account-settings (current).** Only PATCH (update) + GET .../audit (history). FE has no canonical read of current tax posture from this resource — see prior memo `project_accounting_coa_readonly` / settings reads via useGetAccountingSettings if that exists, else FLAG to BE.
- **period close requires `Idempotency-Key` header (required).** close-year body {year, retained_earnings_account_id}; reopen-year needs {year, confirmation_token*, reason*} — token implies a fetch-token-then-confirm two-step.
- **pph-final-settle**: body cash_account is an OBJECT `{id}` (asset acct 1100-1199), amount, journal_date, memo. Money movement → JournalEntry.
- **opening-balance 422 NORMAL_BALANCE_HINT**: brief says structured hint {lines:[{account_id,entered_side,corrected_side}]} but spec only types it as generic Error{code,message}. FLAG: confirm the 422 detail shape with BE — the structured-hint UX depends on it.

SWR keys file currently only has 3 keys (LIST_LEDGER_ACCOUNTS, LIST_COA_MAPPING_ENTITY_TYPES, LIST_COA_MAPPINGS) — every new surface adds keys here.
