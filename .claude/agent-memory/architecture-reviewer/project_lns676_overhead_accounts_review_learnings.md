---
name: lns676-overhead-accounts-review-learnings
description: revalidate-after-success ordering compounds badly with a page's own card-only error-swap design; check listResult.error precedence over stale-but-valid data before blessing an unguarded post-success revalidateSWRKey
metadata:
  type: project
---

LNS-676 (`/accounting/overhead-accounts`) review: the sole Major finding was NOT a standalone
rule violation — it was two individually-precedented patterns compounding into a real defect.

**The interaction**: `performSave` did `await trigger()` (PUT succeeds) → unguarded
`await revalidateSWRKey(...)` → `setBufferOverride(null)` → success toast, all in one `try`, catch
routes to a rejection-shaped error UI. CLAUDE.md blesses the bare await here ("fine on the success
path, the surrounding catch handles it") and `tax-posture-provider.tsx:196-202` does the identical
thing — but tax-posture's catch is a generic toast with the form staying mounted. This page's own
list hook (`use-list-overhead-accounts.ts`) checks `error` before `data` (same order as
`use-list-coa-mapping-entity-type.ts` — also precedented), so a revalidate failure after a
successful save makes `listResult.selections` go `null`, `savedAccounts` collapse to `[]`, AND the
`SectionCard` swap unconditionally to a full error+retry view (deliberate deviation, approved
per-ticket: "provider loading gate covers only SWR-loading, not fetch errors"). Net effect: a save
that actually succeeded on the backend renders as two conflicting failure messages with the
editable table hidden, self-healing only after a manual retry.

**Why this matters for future reviews**: neither ingredient is a violation in isolation — both
match accepted precedents verbatim. The defect only exists at their intersection on THIS page,
because this page (unlike tax-posture) hides its main content behind the fetch-error state. When a
provider's `error`-swap design is a per-ticket deviation from the "children always render, only the
card errors" default, check what a *revalidate-triggered* (not just initial-load) error does to
that same swap — a save-then-revalidate-fails sequence is a realistic path into the fetch-error
branch, not just cold-load failure. Related: [[feedback_revalidate_swr_key_throws_in_catch]].

**Verified correct (don't re-flag if seen again)**: selection-row-id vs account-id — `data/models`
docstring plus `accountIds` threading through repo→source→PUT body was correct end-to-end; worth
spot-checking end-to-end on any resource with a similar row-id/foreign-id split, but this
implementation got it right.
