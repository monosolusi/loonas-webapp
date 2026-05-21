---
name: clerk-error-classification-pattern
description: Clerk signIn/signUp failures classified locally in the auth provider — not in ErrorCodes registry — via a discriminated union read from err.errors[0].code
metadata:
  type: project
---

Clerk SDK errors are classified locally inside the auth provider that owns the call, using a discriminated union state (e.g. `SignInError = 'wrong_credentials' | 'too_many_requests' | 'network' | 'fallback' | null`). The classifier is a small pure helper colocated in the same file.

**Why:** ErrorCodes in `core/resources/server-error.ts` represents the loonas-id backend contract. Clerk codes are SDK-internal and version-coupled to `@clerk/nextjs` — mixing them into the global registry leaks an external dependency into the domain layer and creates a sync burden when Clerk renames codes. Locked in during LNS-221 (sign-in error handling, 2026-05-21).

**How to apply:**
- Read Clerk error code defensively: `err?.errors?.[0]?.code` (Clerk wraps with `{ errors: [{ code }], clerkError: true }`).
- Detect network failures via `err instanceof TypeError` (fetch boundary) — anything without `errors` array AND not a TypeError falls to `'fallback'`.
- Anti-enumeration: collapse `form_password_incorrect` + `form_identifier_not_found` into one user-visible class.
- Never re-throw inside `useEffect` — classify in the `catch` of the async action itself and store the discriminator in state.
- Telemetry: `console.warn("[sign-in]", { class, clerkCode })` only — no PII, no full payload.
- Sign-up provider at `features/user/presentation/providers/sign-up.tsx` has the same anti-pattern as of 2026-05-21; if a future ticket touches it, apply the same shape.
- **Classifier ordering**: `TypeError` guard runs FIRST, then Clerk-coded branch, then fallback. A Clerk-wrapped error that has a `code` but isn't in the mapped set falls to `'fallback'` (not `'network'`) — this is correct: if Clerk classified it, the true-network "Gagal terhubung…" copy would mislead. True network failures hit the TypeError guard. Confirmed in LNS-221 triage.
