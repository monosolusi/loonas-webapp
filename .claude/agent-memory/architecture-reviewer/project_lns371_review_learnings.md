---
name: project-lns371-review-learnings
description: LNS-371 review learnings — two accounting debts it recorded are since CLEARED (mutation keys now constant-backed; sources no longer import repo params); create-page providers still need no guarantee pattern
metadata:
  type: project
---

## LNS-371 Review — Key Findings

**Create-page providers do NOT need the guarantee pattern (loading prop).** The guarantee pattern (provider accepts `loading: React.ReactNode` and holds rendering until data resolves) applies to **detail pages** that pre-fetch existing data. Create-page providers hold form state initialized to safe defaults — no async gate is needed. `JournalCreateProvider` is correctly implemented without a loading prop.

**How to apply:** Do not flag the absence of `loading` prop on create-page providers. Only flag it as missing on detail/edit providers that pre-fetch entity data.

---

## Debts this file used to record — both now CLEARED (verified 2026-08-30 during the LNS-738 review)

Do not re-surface these as pre-existing findings; they were re-checked and are gone:

1. **Mutation SWR keys hardcoded in accounting hooks** — cleared. `ACCOUNTING_MUTATION_KEYS` now exists alongside `ACCOUNTING_SWR_KEYS` in `presentations/constants/swr-keys.ts`, and mutation hooks (`use-cancel-cash-entry`, the LNS-738 category/settings hooks, …) reference the constants. The LNS-738 hooks also call `revalidateSWRKey` from inside the mutation fetcher — the first accounting hooks to do so (accounting callers historically invalidated from the owning provider/dialog instead). Both shapes are present in the repo; neither is a violation.

2. **`domain/sources/*.ts` importing param types from `domain/repositories/`** (LNS-369 stragglers in `journal.ts` / `ledger-account.ts`) — cleared. A repo-wide grep of every `domain/sources/` file for `from "@/features/.../domain/repositories/"` returns zero hits, so the LNS-402 "fold stragglers in the same PR" instruction has nothing left to fold.

**How to apply:** Trust a fresh grep over this file's older claims. Before citing either debt in a review, re-run: `grep -rn "domain/repositories" src/features/*/domain/sources/` and `grep -rn "ACCOUNTING_MUTATION_KEYS" src/features/accounting/presentations/hooks/`.

[[feedback_css_hidden_dual_branch_singleton]]
