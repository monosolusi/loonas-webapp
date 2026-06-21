---
name: opening-balance-contract-2026-06-19
description: LNS-344 verified — opening-balance submit/get contract, 422 error codes (incl NORMAL_BALANCE_HINT details only in prose not schema), CoaAccount.type carries equity, FE HttpRequest drops error.details
metadata:
  type: project
---

LNS-344 feasibility pass (2026-06-19) verified against live `https://dev-api.loonas.id/openapi.json`.

**POST /accounting/opening-balance** (`postOpeningBalance`) — net-new FE work; no opening-balance submit code exists in FE today (only GL/TB report models reference "opening").
- Request: `{ as_of: string, lines: [{ account_id, debit, credit }] }`. Idempotency-Key header required (400 `IDEMPOTENCY_KEY_REQUIRED` if missing).
- 201 returns `JournalEntry` (lines[] carry `account_id`, `account_code`, `account_name`, debit, credit).
- 409: `OPENING_BALANCE_EXISTS`, `OPENING_BALANCE_BLOCKED` (details.earliest_posted_date).
- 422 codes: `OPENING_BALANCE_UNBALANCED` (debit_total/credit_total/delta), `OPENING_BALANCE_ACCOUNT_NOT_FOUND` (account_id), `OPENING_BALANCE_HEADER_ACCOUNT` (account_id/account_code), `OPENING_BALANCE_RETAINED_EARNINGS` (3300 blocked → use 3200; account_id/account_code/hint), `OPENING_BALANCE_NONBALANCE_ACCOUNT` (account_id + **account_type**), `NORMAL_BALANCE_HINT` (details.lines[]: {account_id, entered_side, corrected_side}).

**CRITICAL: 422 details are NOT in a typed schema.** All 422 responses `$ref` the bare `Error` = `{code, message}` only. The `lines[]`/`entered_side`/`corrected_side`/`account_type` structure lives ONLY in the response `description` prose. The shape is the BE-committed contract but is not machine-validated.

**FE plumbing gap (independent of BE):** `HttpRequest` (src/core/helpers/http-request.ts ~line 67-73) reads only `data.code` + `data.message` from error bodies and **discards `details` entirely**. `ServerError` DOES have a `details: Record<string,any>` slot (constructor merges it) but HttpRequest never passes the raw `details`. To use ANY 422 details (deficit branch, unbalanced totals, blocked date) FE must first widen HttpRequest's error path to forward `data.details` into the thrown ServerError. This is the load-bearing enabler for LNS-344 Item B.

**CoaAccount (GET /accounting/accounts):** returns `{id, code, name, type, parent:{id}, created_at, updated_at}`. `type` enum = asset, contra_asset, liability, equity, contra_equity, revenue, contra_revenue, expense, contra_expense, cogs (10 values). No `natural_side` field on CoaAccount (natural side derivable from type). FE `useListLedgerAccounts` already maps `type` → `LedgerAccountEntity.type`. So `account_id → type` lookup (equity detection for Item B deficit branch) IS client-derivable. NOTE drift: FE model reads `data["parent_id"]` but spec nests `parent.id` (pre-existing, separate).

**Laba Rugi (POST /accounting/reports/laba-rugi):** `LabaRugiReport.meta` = {account_id, currency, from, to, compare_from, compare_to, generated_at}. **No migration/cutover/first-FY marker.** Item-A migration signal must be derived elsewhere: GET /accounting/opening-balance returns the posted JournalEntry whose lines[] carry `account_code` — presence of a line with `account_code === "3200"` (Saldo Laba Ditahan Periode Sebelumnya) is the client-detectable "mid-year migrant" signal.
