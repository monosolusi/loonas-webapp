---
name: journal-line-editor
description: LNS-364 shared journal-line editor — presentational double-entry component; LedgerAccountCombobox has NO filter prop seam
metadata:
  type: project
---

LNS-364 builds a reusable presentational journal-line editor (double-entry: account + Debit + Credit) shared by manual-journal-entry and the opening-balance wizard. Props-only `{ lines, onChange, accountFilter?, disabled?, error? }`; line shape is existing contract `{ account_id, debit, credit }` integers (not amount+side). Derived balance helper exposes `{ totalDebit, totalCredit, isBalanced }`; isBalanced requires equal AND non-zero (all-zero is NOT balanced). Min 2 lines. Unbalanced copy locked: "Belum seimbang — total Debit harus sama dengan total Kredit". No BE contract change.

**Why:** Foundation ticket in "Accounting — UMKM (Non-PKP) Feature-Completeness" — build once to avoid 3 divergent line editors.

**How to apply:** Two non-obvious gotchas for any future PRD touching this editor or its hosts:
1. The shipped `LedgerAccountCombobox` (src/features/accounting/presentations/components/ledger-account-combobox.tsx) has NO filter prop — it fetches ALL accounts internally via `useListLedgerAccounts({ limit: 500 })`. Honoring an `accountFilter` requires extending the combobox or wrapping it (EL call). Don't assume a filter seam exists.
2. `NumberDisplay` is DISPLAY-ONLY (`{ value, prefix?, suffix? }`) — it covers the read-only totals row, NOT the editable money cells. Debit/Credit inputs are net-new Indonesian-format numeric inputs; IDR is integer-only, so the parse/format must round-trip without float drift (the #1 precision risk).

Hosts (manual journal entry, opening-balance wizard) own submit/posting/idempotency, the account filter predicate, and warning/acknowledge flow. See [[journal-write-contract]] for the journal POST contract the manual-entry host will use. Opening-balance wizard excludes header accounts, retained-earnings 3300, and income-statement-type accounts via host-supplied filter.
