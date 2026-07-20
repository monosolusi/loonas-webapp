---
name: lns384-techdebt-deferred
description: LNS-384 Phase 6 triage — what was accepted vs deferred to a bundled tech-debt issue on the account verification-work read path
metadata:
  type: project
---

LNS-384 (verification-works JWT-path migration) Phase-6 triage outcome (2026-06-14). See [[lns384-jwt-tenant-migration]] for the migration itself.

**Sent back to SWE in-scope (fixed in this ticket):** empty `RetrieveAccountVerificationWorkUseCaseParams {}` class removed, use case switched to `UseCase<..., void>` / `execute()` no-arg, 3 callsites updated. Reason: the empty class was residue THIS ticket created when stripping `accountId` — completing our own cleanup, not new work.

**Deferred to a single bundled tech-debt issue** (theme: `features/account` verification-work read path predates current conventions):
- No `presentation/constants/swr-keys.ts` in the `account` feature (only `domain/constants` exists); two inline keys `"get-account-verification-work"` + `"list-approved-accounts"`.
- `use-get-account-verification-work.ts` returns a plain object with no discriminated-union `.types.ts`. NOTE: `use-list-approved-accounts.ts` ALREADY has a proper union `.types.ts` — the gap is only the get-hook.
- `presentation/providers/account-verification-work.tsx` is `@deprecated`, zero callers (grep-confirmed), still on `LocalStorageSessionService` — delete it in the sweep.
- Fetcher naming `GetAccountVerificationWorkFetcher` inconsistent with peers — cosmetic, fold in.

**Why deferred not fixed-now:** all pre-existing, and LNS-384 is a deploy-lockstep breaking change (must land with BE #266) — kept the diff minimal/revertable. Deleting the dead provider would have widened blast radius for no migration benefit.

**Hard merge gate (NOT a code fix):** `use-list-approved-accounts` fires N identical `/accounts/verification-works` calls under one JWT (old path carried distinct accountId). If one JWT resolves one account, the per-account filter breaks. This is Open Q #4, relayed to BE — merge sign-off item, unresolvable in FE code.

**How to apply:** if asked about LNS-384 follow-ups, the tech-debt sweep is the home for the 4 convention items; the N-calls question is a BE-behavioral gate, not FE work.
