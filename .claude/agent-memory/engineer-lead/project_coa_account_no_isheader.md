---
name: coa-account-no-isheader-and-enum-drift
description: CoaAccount has no is_header field; FE AccountType enum is narrower than BE (missing 4 contra_* types) — affects accountFilter predicates
metadata:
  type: project
---

The chart-of-accounts account (`LedgerAccountEntity` / BE `CoaAccount`) exposes ONLY: `id, code, name, type, parentId` (+ balance/totalDebit/totalCredit on the entity). Verified against live `/openapi.json` `CoaAccount` (`id, code, name, type, parent{id}, created_at, updated_at`) on 2026-06-19 for LNS-364.

Two consequences for any account-filter / picker-restriction work:

1. **No `is_header` / `is_group` / `level` / `is_postable` field exists.** "Exclude header accounts" cannot key on a boolean — header must be INFERRED by the host (e.g. an account that appears as another account's `parentId`), scanning the full account list. A predicate can only key on `{ id, code, name, type, parentId }`.

2. **FE/BE `AccountType` enum drift.** BE `CoaAccount.type` enum has 10 values incl. four `contra_*` (`contra_asset, contra_equity, contra_revenue, contra_expense`); FE `src/features/accounting/domain/enums/account-type.ts` has only 6 (asset, liability, equity, revenue, cogs, expense). The model (`data/models/ledger-account.ts`) does an unchecked `data["type"] as AccountType` cast, so a contra account flows through as an enum-invalid string. A `type`-keyed filter (e.g. "exclude income-statement types") may misbehave for contra accounts.

**Why:** LNS-364 (shared journal-line editor) Q-EL1 — the opening-balance wizard's `accountFilter` was specced to exclude header accounts + retained-earnings 3300 + income-statement types; only `code`/`type`/`parentId` keys actually exist.

**How to apply:** When scoping the opening-balance wizard (downstream consumer of LNS-364's editor) or any CoA-restriction filter, do NOT assume an `isHeader` field. Plan header-exclusion as host-side inference over the loaded list, and account for contra_* types when filtering by `type`. The enum drift is a separate FE-modeling tech-debt item, not owned by the presentational editor ticket.
