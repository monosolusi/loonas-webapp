---
name: project_pr227_registration_captcha_review_learnings
description: Review learnings from PR #227 (fix/registration-captcha-silent-hang into release/fix-registration) — Clerk captcha DOM facts verified via Context7, and a refinement of the derived-invariant-getter rule for provider-internal defense-in-depth re-checks.
metadata:
  type: project
---

Context: `/onboarding/user` registration bug — `#clerk-captcha` rendered after the submit button
(off-screen), plus three silent-failure defects in the same submit path (swallowed catch → false
success nav, silent `return` inside `try`, `throw` from an async handler). App-layer only
(`src/app/(user)/onboarding/user/**`) plus one shared error-code addition
(`src/core/resources/server-error.ts`). Zero Blockers/Majors found; disposition was Approve.

**Clerk captcha DOM facts — verified against `/clerk/clerk-docs` via Context7, all confirmed
accurate**: `#clerk-captcha` div is the widget placeholder; if absent, Clerk transparently
degrades to an invisible-only widget that can hard-block a falsely-flagged user with **no**
verification recourse (this is documented Clerk behavior, not speculation); official examples
place the div between the last field and the submit button; `data-cl-theme` / `data-cl-language`
/ `data-cl-size` are real supported attributes on that div. Useful baseline for any future
Clerk sign-up/sign-in flow review — don't re-derive these facts from scratch, and cite Context7
`/clerk/clerk-docs` when confirming similar claims.

**Derived-invariant-getter rule extends to provider-internal defense-in-depth re-checks, with a
real carve-out.** CLAUDE.md's rule (LNS-570) is written for domain entity getters: don't restate
a predicate that's already expressed by another getter, derive from it instead. This PR's
provider defines `isReady = isLoaded && !isLoadingMe` for the submit button, but `createUser()`
internally re-checks `!isLoaded` and `isLoadingMe` separately (not `!isReady`) before submitting.
Judgment call: this is **not** flagged as a violation, because the two call sites need different
information — `isReady` collapses to one UI boolean, while `createUser()` needs to throw a
*distinct error code per failure reason* (`AUTH_NOT_READY` vs `VALIDATION_FAILED`), which a single
collapsed boolean structurally cannot express. The entity-getter rule assumes both call sites want
the *same* predicate; when they want different information derived from the same source facts,
re-checking the source facts is legitimate, not drift-prone duplication. The narrow residual risk
(a future third readiness flag added to `isReady` but forgotten in `createUser()`) is real but
Minor, not Major — worth a code comment cross-reference, not a blocking finding. Apply this
carve-out test in future reviews before flagging a similar "getter defined but re-derived
elsewhere" pattern: are the two sites asking the *same* question, or different questions built
from the same facts?

Also confirmed via Clerk's `ClerkAPIResponseError` type (`errors: ClerkAPIError[]`, each with a
`code: string`) that `err.errors[0]?.code` is well-typed — no need to re-verify this specific
access pattern in future Clerk-error-handling reviews in this repo.
