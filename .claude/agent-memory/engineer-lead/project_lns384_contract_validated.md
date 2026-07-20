---
name: lns384-contract-validated
description: LNS-384 Phase 7 live-spec contract validation result — verification-works + journals migration confirmed aligned; spec quirks noted
metadata:
  type: project
---

LNS-384 (JWT-only tenant migration) shipped surfaces validated against the LIVE spec (`https://dev-api.loonas.id/openapi.json`, OpenAPI 3.0.3, Loonas API v1.0.0, ~585KB) on 2026-06-14 Phase 7.

**Verdict: CONTRACT VALIDATED.** See [[lns384-jwt-tenant-migration]].

**Confirmed facts (live spec):**
- `GET /accounts/verification-works` exists, operationId `getAccountVerificationStatus`, `security: ClerkAuth` (HTTP bearer), NO path/query params. Only param is an optional `api-version` HEADER (default `v1`) — FE sending none is valid (BE defaults to v1).
- 200 response top-level: `account` (object), `latest_status` enum [NEW,PROCESSING,COMPLETED], `verification_outcome` enum [APPROVED,REJECTED,PENDING], `estimated_verification_complete` date-time. All match `AccountVerificationWorkModel.fromJson` + the two FE enums exactly.
- `GET /accounting/journals` exists, operationId `listJournals`, `security: ClerkAuth`, ZERO path params (no tenant id). (Also has POST now.)
- Old tenant-scoped paths `/accounts/{accountId}/verification-works` and `/accounts/{accountId}/journals*` are ABSENT — will 404 post-deploy as intended.

**Spec quirks worth remembering:**
- The nested `account` inside the verification-works 200 is a BARE `{type:object}` with no properties/discriminator on THAT endpoint — loosely typed BE doc gap. The same account union IS properly typed on `GET /accounts/me` (`oneOf: [PersonalAccount, BusinessAccount]`), where `PersonalAccount.type` enum=[PERSONAL] and `BusinessAccount.type` enum=[BUSINESS] — matches the FE `account.type` discriminator branch. So the FE's nested parse is safe; the gap is documentation, not a real mismatch.
- `api-version` header (default `v1`) appears on these account/accounting ops; harmless for FE today but a versioning lever to watch.

**Why:** Phase 7 mandatory pre-PM contract gate. How to apply: this migration is schema-clean; the ONLY open gate is the BE-behavioral multi-account question (does `/accounts/verification-works` resolve one account per JWT, affecting the `use-list-approved-accounts` loop) — NOT visible in schema, relayed to BE, remains a merge sign-off gate. Journal-list `page` vs `offset` drift ([[journal-list-param-drift]]) reconfirmed but out of LNS-384 scope.
