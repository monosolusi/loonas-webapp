---
name: centralize-predicate-with-message-helper
description: When a shared helper centralizes error-message mapping across multiple providers, check whether the instanceof/code-matching predicate that gates the call site was also centralized — not just the message.
metadata:
  type: feedback
---

Engineers who extract a shared `resolveXError(err)`-style helper to de-duplicate message mapping across
providers often leave the *predicate* that decides whether to increment a counter / branch UI state
still copy-pasted verbatim in each call site, even though the predicate and the message logic are the
same concern.

Found in LNS-457 (`feat/lns-457-handle-period-has-failed-postings`): both
`src/app/(authenticated)/finance/periods/_providers/periods-provider.tsx` and
`.../finance/fixed-costs/_providers/fixed-cost-entries-provider.tsx` correctly import a shared
`resolveClosePeriodErrorMessage()` from `src/features/accounting/presentations/helpers/close-period-error.ts`
for the message — but each provider independently re-derives the same 4-line guard
(`err instanceof ServerError && err.httpCode === 422 && err.code === ErrorCodes.PERIOD_HAS_FAILED_POSTINGS.code`)
to decide whether to increment `closePeriodFailureCount`. The guard should have been exported from the
same helper file (or as a `domain/guards/` predicate per the project's existing Type Guards convention)
alongside the message resolver.

**Why:** this is an easy-to-miss half-DRY refactor — the author solved message duplication but not
predicate duplication, because the predicate lives in a different call site (a `useState` setter) than
the message assignment. Two call sites with the identical inline `instanceof` check is exactly the
"Type guards" pattern CLAUDE.md already prescribes centralizing (`domain/guards/{noun}-guards.ts`).

**How to apply:** whenever a diff introduces a new shared helper for error-message resolution AND the
same error is also independently detected (counted, gated, branched) at each call site, check whether
that detection logic is duplicated too. Flag as Minor (not Major) — it's a few lines, not a layer
violation — but call it out explicitly since it's cheap to fix and the PR already demonstrates the
author knows how to centralize (they just stopped one function short).

See also [[project_lns457_review_learnings]].
