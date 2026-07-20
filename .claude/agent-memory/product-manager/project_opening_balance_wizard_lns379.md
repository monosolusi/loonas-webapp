---
name: opening-balance-wizard-lns379
description: LNS-379 Opening Balance Wizard — ~70% shipped by deps; net-new = POST write path + wizard host; retained-earnings code is 3200 NOT 3300 (ticket body wrong)
metadata:
  type: project
---

LNS-379 (FE Opening Balance Wizard for migrating UMKM; In Progress 2026-06-25) is mostly a WIRING ticket, not a build-it-all ticket. Its deps LNS-364 (editor) + LNS-344 (copy/contract) shipped most primitives.

**Already shipped (do NOT rebuild) — verified in src 2026-06-25:**
- Journal-line editor + `accountFilter` seam (host supplies predicate; `journal-line-account-combobox.tsx` filters client-side) + balance helper (`use-journal-line-balance`). The combobox HAS a working filter seam now (supersedes older note that it lacked one).
- Opening-balance READ path: usecase/repo/source/model/entity + `use-get-opening-balance` hook + `isMigration` probe (`accountCode === "3200"` at use-get-opening-balance.ts:36). Service/repo are GET-only.
- 422 stack: `normal-balance-hint-block.tsx`, `accumulated-deficit-block.tsx`, `normal-balance-hint-resolver.ts` (encodes mixed-offender precedence: fixable leads, deficit dead-end only when nothing fixable), `normal-balance-hint` model+entity, `NORMAL_BALANCE_HINT` in `server-error.ts`. `HttpRequest` forwards `data.details`; `ServerError.details` carries it (`serverError.details.details.lines`).
- Item A mid-year explainer: `laba-rugi-migration-notice.tsx` (copy + component, wired into Laba Rugi viewer).

**Genuine net-new work:** (1) POST write path — `post()` on opening-balance service/source/repo (today read-only), `PostOpeningBalanceUseCase` (precedent: `create-journal.usecases.ts` + `use-create-journal.ts`), write hook + SWR key, revalidate GET on success, reuse `JournalModel` for bare (non-`{data}`-wrapped) response. (2) The wizard host: route `/finance/opening-balance`, provider+steps, ROUTE_MAP entry, nav/setup entry point, already-migrated guard, host-supplied account filter predicate, review+submit, double-submit guard, loading/error.

**Why:** correct-but-confusing accounting for non-accounting UMKM owners; non-PKP window ends 2026-08-10. See [[opening-balance-copy-contract]], [[journal-line-editor]].

**How to apply / two locked corrections vs ticket body:**
1. **Retained-earnings exclude code is `3200`, NOT `3300`.** Ticket body says 3300 — WRONG. Shipped FE uses 3200 (`Saldo Laba Ditahan Periode Sebelumnya`). Lock filter + probe on 3200.
2. **422 structured `details.lines[{account_id,entered_side,corrected_side}]` is NOT BE-confirmed** (LNS-368 Q1 still Backlog; spec types 422 as generic `Error{code,message}`, details prose-only). Proceed on structured assumption WITH mandatory generic fallback. Relay E1 (POST req/resp shape via raw spec — summarizer truncates `/accounting/opening-balance`), E5 (3200 vs 3300) to BE; both block SWE submit but not design/EL planning.

Account filter: permitted = balance-sheet types (asset/contra_asset/liability/equity/contra_equity) minus 3200 minus header accounts; income-statement types (revenue/contra_revenue/cogs/expense/contra_expense) excluded. `AccountType` enum confirmed at domain/enums/account-type.ts. Deficit branch = offending line account `type==="equity"` AND `entered_side==="debit"`.

**Shipped 2026-06-25 (PR #91, In Review).** Both BLOCKING flags RESOLVED at implementation time: (1) `3200` confirmed correct vs the drifted live OpenAPI spec (~11KB drift since planning) — ticket body's `3300` was the error; wizard auto-computes the `3200` retained-earnings residual. (2) 422 handled via mandatory generic fallback + shipped resolver. Guided design: debit/credit grid NEVER shown to owner — plain rupiah category inputs map to balanced lines invisibly. EL added a required `Idempotency-Key` on POST. AC-6 mixed-offender precedence was a real resolver bug (deficit-on-first-match vs fixable-leads), fixed. AC-9 residual (NormalBalanceHintBlock 422-recovery copy shows "sisi debit/kredit" outside collapsible) deferred to [[#]] **LNS-403** (Low/Tech Debt, Frontend+accounting, UID authors gloss → SWE wires; consumed only by this wizard, no LNS-371 regression).
