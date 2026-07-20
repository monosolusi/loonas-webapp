---
name: lns384-jwt-tenant-migration
description: LNS-384 JWT-only tenant migration reality vs PRD — journal CRUD never existed in FE, only verification-works URL actually migrates
metadata:
  type: project
---

LNS-384 PRD assumed "6 FE calls" (journal list/get/create/update/reverse + verification-works) all carry a tenant `:accountId` in path and must be repointed. Repo grounding (2026-06-14) contradicts that inventory.

**Reality at time of planning:**
- Journal FE surface has ONLY a `list` method (`features/accounting/data/sources/journal.ts`), and it ALREADY targets `/accounting/journals` (no accountId, no migration needed). There is NO create/get/update/reverse journal service/usecase/hook in the FE yet — those 4 journal calls in the PRD do not exist to repoint.
- The single genuinely-migrating call is verification-works: `features/account/data/sources/account.ts` `retrieveVerificationWork` → `${baseUrl}/accounts/${accountId}/verification-works` (manual `fetch`, bypasses HttpRequest). New path `/accounts/verification-works`, JWT-only.
- `accountId` threads through the whole chain: usecase `RetrieveAccountVerificationWorkUseCaseParams(accountId)` → repo → source. SWR keys `get-account-verification-work` (hook) and the deprecated `AccountVerificationWorkProvider` embed accountId via the params object.

**CRITICAL namespace trap:** `features/kyc-review/data/sources/kyc-review.ts` uses `/internal/verification-works[...]` — a DIFFERENT internal/admin resource, NOT the account-scoped one. LNS-382 left it untouched. Do NOT migrate kyc-review.

**Also leave alone:** CoA `/accounting/accounts/${accountId}/balance` and `/ledger` in `accounting/data/sources/ledger-account.ts` — those `accountId` are ledger-account *entity* ids, not tenant ids.

**Why:** PM PRD was written against an expected BE-symmetric inventory; the FE journal CRUD was never built (only the read-list landed in the earlier accounting batch). How to apply: when LNS-382-family migrations cite a call inventory, grep the actual data/sources before trusting the count — the BE contract surface ≠ FE call surface.
