---
name: f9-nationality-reset-review-learnings
description: Review learnings from the onboarding/account F9 nationality-reset + shared-submit-state provider promotion branch (2026-08-17)
metadata:
  type: project
---

Branch `fix/onboarding-nationality-reset-and-submit-state` (5 commits on `04b534d1`, reviewed
2026-08-17). Disposition: Approve, one Major (dormant) — see [[feedback_oneway_latch_derived_visibility]].

**Two-tier provider split precedent**: `/onboarding/account`'s `CreateAccountProvider` (wizard-level,
mounted for the whole flow) owns the actual form buffers (`personalData`/`businessData` via `useState`),
kept alive across `prevStep()` unmounting the type-specific layout so switching account type and back
doesn't lose typed data. The newer `PersonalAccountProvider`/`BusinessAccountProvider` (page-level, added
to fix a real bug — see below) own only *submit* state (`submitStatus`/`submitError`/`createdAccountId`)
and pull `accountData` from `useCreateAccount()`. When judging "should this action live on the shared
wizard provider or the narrower one," check which provider actually owns the STATE the action writes —
`changeNationality` had to stay on `CreateAccountProvider` because that's where `personalData` lives, not
because of stylistic preference.

**Plain-hook-instead-of-context is a recurring defect class here, not a one-off**: `usePersonalAccountData`
and `useBusinessAccountData` were both plain hooks (no `createContext`) called by ~14-22 consumers each,
giving every call site its own `useState` — writes from one component (the form wrapper's `submit()`)
were invisible to others (error/incomplete banners, submit button), so a prior QA remediation (#230/#231)
was silently dead in both twins. Fix pattern: rename the existing hook body to `use{X}State` (kept
verbatim, still in `_hooks/`, now documented as provider-internal via docstring only — no compiler
enforcement), wrap it in a new `_providers/{x}-account-provider.tsx` that mounts it once and shares via
`createContext<ReturnType<typeof use{X}State> | null>(null)`, and repoint every consumer's import from
`_hooks/` to `_providers/`. Grep for `usePersonalAccountData`/`useBusinessAccountData` call sites confirmed
zero stragglers on the old direct-hook import after migration — verify this exhaustively on any future
"promote plain hook to provider" fix, not just spot-check.

**`ReturnType<typeof useX>` as the WHOLE context value (not nested under a field) is new in this repo**:
existing precedent (`product-create-provider.tsx`, `product-detail-provider.tsx`) nests it as
`form: ReturnType<typeof useProductFormState>` alongside provider-owned orchestration logic in the same
context type. This branch instead sets `type XContextValue = ReturnType<typeof useXState>` directly — the
entire provider is a pass-through. Judged acceptable (minimal diff for a surgical bug fix, the hook already
existed at that path pre-PR) but flagged as a minor stylistic gap from the nested-field convention, worth a
consolidation-pass opinion later, not a blocker.

**Also confirmed correct**: `PersonalAccountContext`/`BusinessAccountContext` both default to `null`
(guard works) — contrast with the adjacent pre-existing `CreateAccountContext` which defaults to `{}`
(truthy, so its `useCreateAccount()` `if (!context) throw` guard can never fire — pre-existing, out of
scope, noted as tech debt only).
