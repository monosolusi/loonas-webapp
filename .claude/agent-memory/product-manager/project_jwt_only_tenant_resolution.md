---
name: jwt-only-tenant-resolution
description: BE shipped JWT-only tenant resolution (LNS-382, PR#266 merged 2026-06-14); journal + verification-works routes re-mounted without :accountId — old paths 404, FE must never carry a tenant id
metadata:
  type: project
---

LNS-382 (Backend, Breaking Change) shipped 2026-06-14 (PR monosolusi/loonas-api#266, status Done). `WithAccountMiddleware` is now JWT-only: tenant resolves solely from Clerk JWT `orgId`; the old `param(req, "accountId") || orgId` override seam is removed.

Route re-mounts (old → new):
- `/accounts/:accountId/journals` (GET, POST) → `/accounting/journals`
- `/accounts/:accountId/journals/:id` (GET, PUT) → `/accounting/journals/:id`
- `/accounts/:accountId/journals/:id/reverse` (POST) → `/accounting/journals/:id/reverse`
- `/accounts/:accountId/verification-works` (GET) → `/accounts/verification-works`

Response shapes UNCHANGED. No tenant id anywhere (path/query/body) — BE fail-closes if a client-supplied tenant id disagrees with the JWT (and 403 if token has no `orgId`). CoA snake_case `:account_id` ENTITY routes are a different concept (ledger-account ids) and are explicitly untouched — do not migrate those.

**Why:** Reconciles BE with the long-standing CLAUDE.md "FE never sends account id" convention; was the hard blocker for the accounting FE batch (raised via LNS-366). Old paths 404 post-deploy — no dual-mount grace window.

**How to apply:** FE migration is LNS-384 (deploy-lockstep). When scoping any future accounting/journal FE work, assume JWT-only paths under `/accounting/*` and `/accounts/verification-works`; never interpolate an account/tenant id. Closes out LNS-366's path-strategy question (option 3 won: promote to un-scoped routes). LNS-383 (internal cross-tenant via `/internal`) is DEFERRED — trigger-gated, no current consumer. Related: [[accounting-be-done-fe-gap]], [[linear-accounting-fe-batch]].

**OpenAPI caveat (verified 2026-06-14):** live spec at dev-api.loonas.id/openapi.json documents `/accounts/verification-works` (GET) but does NOT yet list the four `/accounting/journals[...]` routes. Journal-path mapping is sourced from the EL spec for LNS-382, not the published doc. OpenAPI authoring for journals is deferred to LNS-366/tech-writer. Treat journal new-paths as authoritative-from-EL-spec, OpenAPI-undocumented.
