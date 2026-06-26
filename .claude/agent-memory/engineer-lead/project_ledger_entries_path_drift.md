---
name: project_ledger_entries_path_drift
description: RESOLVED by LNS-415 (PR #128, 2026-06-26) — listEntries repointed to getGeneralLedger. (Was: FE listEntries called a stale per-account ledger path absent from the live BE spec; pre-existing drift found LNS-402 Phase-7.)
metadata:
  type: project
---

> **✅ RESOLVED by LNS-415 (PR #128 → dev, 2026-06-26):** `listEntries` was repointed to `getGeneralLedger` (`GET /accounting/reports/general-ledger/{account_id}`, query `from`/`to`) with the response-envelope mapping adapted (entries from `result.data.lines`, pagination from top-level `result.meta`, per-line `account_id` injected). The stale path no longer ships. Historical record retained below; see [[tb-gl-contract-2026-06-16]] for the live contract and [[searchparams-undefined-guard]] for the B1 lesson from the fix.

`LedgerAccountServiceImpl.listEntries` (data/sources/ledger-account.ts) **previously** called `GET /accounting/accounts/{account_id}/ledger` with `start_date`/`end_date`/`page`/`limit` query params. That path is **NOT in the live OpenAPI spec** (verified 2026-06-26). The only per-account ledger endpoint in the spec is `GET /accounting/reports/general-ledger/{account_id}` (opId `getGeneralLedger`), which requires `from`/`to` (NOT `start_date`/`end_date`) plus optional `page`/`limit`. So the FE is calling a path the BE no longer publishes → expected 404 → caught as `ServerError(UNKNOWN)`.

This is **live**: `useListLedgerEntries` is consumed by `src/app/(authenticated)/finance/ledger/[accountId]/_components/ledger-detail-impl.tsx` (the ledger account detail page), so the broken call fires whenever a user opens that page.

**Why:** Surfaced during LNS-402 (pure param-type refactor) Phase-7 contract re-validation. The `path:` line is in an UNCHANGED hunk — LNS-402 did not introduce or touch it, so it was correctly held out-of-scope (do not expand a refactor PR to fix a pre-existing contract bug). Pairs with the same source's pre-existing 3-param-signature arch note ([[project_accounting_module_audit_2026_05]]) and the GL report contract ([[project_tb_gl_contract_2026_06_16]]).

**How to apply:** When a future ticket touches the ledger account detail page or ledger entries, fix this drift — either repoint `listEntries` to `/accounting/reports/general-ledger/{account_id}` and rename params to `from`/`to`, or confirm with BE whether `/accounting/accounts/{id}/ledger` is meant to exist. Re-fetch the live spec first; BE may have moved it again. A follow-up tech-debt ticket was recommended to PM at LNS-402 Phase-6.
