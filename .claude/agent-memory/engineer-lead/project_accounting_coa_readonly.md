---
name: accounting-coa-readonly-as-of-2026-05-12
description: As of 2026-05-12, the accounting feature has no CoA account create path — list/get only. Any flow that "opens an add dialog" must build the create stack.
metadata:
  type: project
---

The accounting feature module under `src/features/accounting/` is **read-only for CoA accounts** as of 2026-05-12.

What exists: `list-ledger-accounts.usecases.ts`, `get-account-balance.usecases.ts`, plus CoA *mapping* CRUD (`use-create-coa-mapping`, etc.).

What does NOT exist: any `create-ledger-account` usecase, `create` method on `LedgerAccount` repo/source, ledger-account form dialog, or "Tambah Akun" UI. The only finance/ledger components are `account-type-badge.tsx` and `ledger-list-impl.tsx`.

**Why:** The accounting feature was scaffolded read-only against the initial BE contract. Plan B+ Accounting Bootstrap (2026-05) is the first release that needs CoA account creation (for the CoA viewer "Tambah Manual" pre-fill story for accounts 1420 PPN Masukan, 2220 Utang Pajak PPN).

**How to apply:** Any plan that says "open the CoA add dialog" needs to budget for building the full create stack (usecase + repo method + source method + hook + dialog component) as one delivery. Don't split "build dialog" from "add prefill prop" — pre-fill is just `initialValues?` on a fresh dialog. Also flag the BE contract dependency: confirm `POST /accounting/ledger-accounts` (or equivalent) exists before P2 kickoff. See [[accounting-module-audit-2026-05]] for the rest of the read-only state.
