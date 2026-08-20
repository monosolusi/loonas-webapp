---
name: plain-hook-shared-state-needs-provider
description: A plain (non-context) hook called from multiple sibling components each gets its own useState — writes in one call site are invisible to reads in another; fix by wrapping in a provider
metadata:
  type: feedback
---

When a page-level hook (e.g. `use{Noun}Data`) owns mutable state (submit status, error, an
in-flight mutation id) and is called directly — not via `createContext`/`useContext` — from
multiple sibling components (form wrapper, error banner, incomplete banner, submit button, step
pages), each call site gets its OWN `useState` instances. The component that triggers the mutation
(form wrapper) writes to its own instance; the components that render the outcome (banners, button)
read a separate, permanently-initial instance and can never show the error/incomplete/disabled
state. A per-instance mutation-id guard also fails to prevent a double-submit, since the guard
itself is duplicated per instance.

**Fix shape** (mirrored on both `@personalAccount` and `@businessAccount` in the onboarding wizard,
LNS-onboarding submit-state fix, 2026-08-17):
1. Rename the existing hook body verbatim to `use{Noun}State()` (docblock: "provider-internal, must
   only be called from `{Noun}Provider`"). Do not restructure its logic — keep the diff reviewable.
2. New `_providers/{noun}-provider.tsx`: `createContext<ReturnType<typeof use{Noun}State> | null>`,
   `{Noun}Provider` mounts ONE instance and provides it, exported `use{Noun}Data()` consumer throws
   an existing `ErrorCodes` member (reuse, don't invent) when context is null.
3. Mount `<{Noun}Provider>` in the feature's `layout.tsx`, OUTSIDE the form wrapper, and only after
   any type/guard check that the underlying state hook itself assumes (e.g. `if (type !== "business")
   return null` before the provider, since the state hook throws on a type mismatch).
4. Repoint every consumer's import from the old hook file to the new provider file
   (`grep -rln "use-{noun}-data"` to find them all — page.tsx step files count as consumers too).
5. Add an `if (isCreating) return;` re-entry guard at the top of the form wrapper's `onSubmit` —
   shared state alone does not stop Enter-key submission from a text input while a mutation is
   in flight; a `disabled` button only blocks click, not Enter.

**Why:** onboarding's business/personal account creation wizards shipped exactly this bug — the
submit error banner and incomplete-fields banner could never render, and the submit button never
showed its disabled/loading state, despite the underlying completeness/error logic being correct.
**How to apply:** whenever a brief says "hook X is called independently by multiple components,
state written by one is invisible to another" — this is the fix shape, not a from-scratch design.
Related: [[feedback_usecase_params_class]] for the sibling convention on hook exports.
