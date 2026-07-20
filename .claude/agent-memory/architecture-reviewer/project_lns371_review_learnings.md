---
name: project-lns371-review-learnings
description: Architecture review learnings from LNS-371 Manual Journal Entry — mutation SWR key pattern and source/repo param coupling pre-existing in accounting feature
metadata:
  type: project
---

## LNS-371 Review — Key Findings

**Mutation SWR keys in accounting feature are universally hardcoded strings.** None of the mutation hooks (`use-create-journal`, `use-reverse-journal`, `use-create-coa-mapping`, `use-update-coa-mapping`, `use-delete-coa-mapping`) reference `ACCOUNTING_SWR_KEYS`. This is a pre-existing pattern that predates LNS-371. When reviewing any accounting mutation hook, this will always appear as a pre-existing finding — do not flag as change-introduced unless new code introduces a NEW hardcoded key outside an already-existing pattern.

**Why:** `ACCOUNTING_SWR_KEYS` only covers list/get query keys; mutation keys were never added to the constants file.

**How to apply:** Flag mutation SWR key hardcoding in accounting as pre-existing tech debt (not blocker/major) unless a new feature starts adding them inconsistently while others exist in the constant file.

---

**`domain/sources/journal.ts` imports param types from `domain/repositories/journal.ts`.** This cross-coupling in the source interface was introduced in LNS-369 (#72) and is pre-existing. The idempotencyKey threading in LNS-371 flows through this already-coupled interface without worsening the coupling.

**Why:** Source interfaces in this feature reuse repo param types instead of owning their own. Affects `domain/sources/journal.ts` and `domain/sources/ledger-account.ts`.

**How to apply:** Surface as pre-existing tech debt in future reviews touching `domain/sources/journal.ts`. Do not treat as LNS-371-introduced.

---

**Create-page providers do NOT need the guarantee pattern (loading prop).** The guarantee pattern (provider accepts `loading: React.ReactNode` and holds rendering until data resolves) applies to **detail pages** that pre-fetch existing data. Create-page providers hold form state initialized to safe defaults — no async gate is needed. `JournalCreateProvider` is correctly implemented without a loading prop.

**How to apply:** Do not flag the absence of `loading` prop on create-page providers. Only flag it as missing on detail/edit providers that pre-fetch entity data.

[[feedback_css_hidden_dual_branch_singleton]]
