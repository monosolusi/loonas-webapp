---
name: project-accounting-be-done-fe-gap
description: Accounting BE is feature-complete (almost every API has a shipped BE ticket); the open work is the FE presentation layer consuming shipped contracts
metadata:
  type: project
---

As of 2026-06-14, the Loonas accounting **backend is essentially feature-complete** for Non-PKP UMKM. The dev API (https://dev-api.loonas.id/openapi.json, Redoc at /docs) exposes a full `/accounting/*` surface and nearly every capability has a Done BE ticket under project "Accounting — UMKM (Non-PKP) Feature-Completeness" (epic LNS-96).

**The gap is the FRONTEND.** `src/features/accounting/` only has FE for: coa-mapping CRUD, journal LIST (no manual post/reverse UI), ledger (accounts + entries), account-balance. Routes exist only for `/finance/{journals,ledger,fixed-costs}` + `/settings/coa-mappings`.

**Net-new FE surfaces (BE shipped, no/partial FE) discovered 2026-06-14:**
- Chart-of-Accounts editor (LNS-117 filed, unstarted, blocked by LNS-114 parent_id→nested migration)
- Manual journal POST + journal detail + reverse
- Financial reports viewers: Neraca, Laba Rugi (POST not GET), Arus Kas, Trial Balance, General Ledger, CALK — all return JSON {data:...}; PDF/XLSX export is separate (renderer LNS-133+)
- Period close / fiscal calendar (list/close/reopen/year-end/reopen-year)
- Opening Balance Wizard (only copy ticket LNS-344 exists; wizard FE unticketed)
- Tax posture / account-settings (PATCH + audit; NO GET for current settings — flag)
- PPh Final UMKM self-settle (money movement)

**Why:** BE sprinted ahead; FE presentation lagged. **How to apply:** when scoping accounting work, default to FE-consumer tickets (label Frontend + be-requested-fe) citing the live shipped contract path; do not re-file BE. See [[project-accounting-domain]], [[reference-linear-accounting-bootstrap-v1]].
