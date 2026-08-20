---
name: feedback_no_timeout_race_on_mutating_calls
description: Never race/timeout a real mutating network call (Clerk signUp.create/setActive or similar) against a client-side deadline — use a separate display-only elapsed-time timer instead. Plus the structural way to distinguish Clerk's ClerkAPIResponseError from ClerkRuntimeError without importing @clerk/*.
metadata:
  type: feedback
---

**Do NOT `Promise.race()` a real mutating network call against a client-side timeout, even to
"improve" a stuck-forever loading state.** First-pass fix of the `/onboarding/user`
registration-submit regression (2026-08-14) built exactly this — a
`core/utilities/with-timeout.ts` helper wrapping `signUp.create()`/`setActive()` in
`AbortController` + `Promise.race`, rejecting the UI with a timeout error if Clerk took too long.
The design review caught the real defect: **racing rejects the UI promise, but the real request
is still in flight and can still succeed server-side.** The user sees "failed", retries, and the
retry collides with `form_identifier_exists` on an account that silently already exists — the
EXACT duplicate-account trap the original bug report was about. This helper (and migrating the
sibling `use-business-account-data.ts`/`use-personal-account-data.ts` hooks to it) was reverted
entirely; **those two account hooks' original `AbortController`+`Promise.race` blocks were left
untouched** (out of scope — don't "helpfully" dedupe them either, same reasoning applies there).

**Correct pattern: "display-only timers".** Await the real promise normally — its real
resolution/rejection is the ONLY thing that ends the loading state, full stop. Separately, run a
`setInterval` purely to track elapsed wall-clock time and feed a pure resolver
(`resolveWaitPhase(elapsedMs): "none" | "slow" | "stalled"`, thresholds e.g. 8s/20s) that decides
what reassurance/advisory copy to show — this timer only changes what's DISPLAYED, it never
touches the real promise. Past the "stalled" threshold, the honest copy is deliberately
uncertain ("Akun Anda mungkin sudah berhasil dibuat di latar belakang... Muat ulang halaman untuk
melihat status terbaru") — never assert success or failure when you genuinely don't know, and
steer to reload-and-check rather than resubmit. See `_utils/submit-wait-phase.ts` +
`_components/create-user-wait-notice.tsx` for the shipped shape. Generalizes past Clerk: this
applies to any client call whose serverside effect isn't safely re-triggerable (payment capture,
account creation, anything with real side effects) — a client timeout on such a call is a
correctness bug, not just a UX rough edge.

**Distinguishing Clerk's two error classes without an `@clerk/*` import** (still accurate/useful
— needed because `_utils/classify-submit-error.ts` must stay reachable by the node-env vitest
suite; see [[feedback_async_handler_and_swallowed_catch]] for why this module avoids Clerk
imports altogether, same as `sign-in.tsx`'s `classifyClerkError`):
- `ClerkAPIResponseError` (from a rejected `signUp.create()`/`signIn.create()`/etc. server call)
  has `status: number` AND `errors: Array<{ code: string }>` AND optionally `retryAfter?: number`
  (seconds). Duck-type: `typeof err.status === "number" && Array.isArray(err.errors)`.
- `ClerkRuntimeError` (a CLIENT-side failure before any request — e.g. `{ code:
  "captcha_unavailable" }` when the Turnstile widget itself can't load) has only `code: string`,
  no `errors` array, no `status`. Duck-type: `typeof err.code === "string" &&
  !Array.isArray(err.errors) && typeof err.status !== "number"`.
- Verified against `node_modules/@clerk/shared/dist/types/index.d.ts` (installed
  `@clerk/nextjs` 6.38.2 / `@clerk/shared` 3.47.0) — `ClerkAPIError.code`,
  `ClerkAPIResponseError.{status,errors,retryAfter}`, `ClerkRuntimeError.code` all confirmed
  there; codes referenced (`form_identifier_exists`, `session_exists`, `form_password_pwned`,
  `form_password_not_strong_enough`, `form_password_length_too_short`, `captcha_unavailable`) are
  real localization keys in the same file. `too_many_requests` is NOT in that localization
  dictionary but IS already relied on by the house precedent (`sign-in.tsx`'s
  `classifyClerkError`) — rate-limit/lockout codes apparently aren't part of the UI-component
  localization set even though they're real API codes. The finer-grained `form_password_no_*`
  codes (uppercase/lowercase/number/special_char) are also absent from this SDK's localization
  dictionary but were confirmed live via actual QA against dev — don't assume "not in the
  installed `.d.ts`'s string table" means "not a real code Clerk can return."

**Why:** the timeout-racing mistake shipped past typecheck/lint/test (all green) — it's a
correctness bug only visible by reasoning about what happens to the REAL promise after the UI
promise is rejected, not something a type system or unit test catches.

**How to apply:** before wrapping ANY Clerk (or other real-mutation) call in a client-side
deadline, ask "if I reject the UI now, does the real call keep running, and can it still
succeed?" If yes, don't race it — use the elapsed-time display-only pattern instead. Before
writing a new Clerk error classifier, reuse the two duck-type predicates above rather than
re-deriving them from scratch or reaching for `isClerkAPIResponseError`/`isClerkRuntimeError`
(importing those would break the node-env testability constraint most submit-error classifiers in
this repo are held to).
