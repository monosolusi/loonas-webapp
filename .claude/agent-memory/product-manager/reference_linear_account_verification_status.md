---
name: linear-account-verification-status
description: Linear chain for per-account verification status on the /accounts picker — LNS-388 (BE, done) → LNS-389 (FE)
metadata:
  type: reference
---

Per-account verification-status on the org-less `/accounts` picker (`account-status-badge.tsx`).

- **LNS-388** [BE] — Include `latest_status` + `verification_outcome` per account in `GET /accounts` list response. DONE 2026-06-14 (loonas-api PR #268). Labels `fe-requested-be` + `Backend`. Top-level fields on each account object; user-scoped so they populate with NO active org.
- **LNS-389** [FE] — Consume those fields; drop the per-card `useGetAccountVerificationWork({ accountId })` N+1 call. Labels `Frontend` + `Bug` (regression). Priority Urgent. https://linear.app/loonas/issue/LNS-389

Why the FE ticket exists: after the JWT-only migration ([[project_jwt_only_tenant_resolution]], LNS-382/384), `verification-works` resolves tenant from JWT `orgId` only. The picker is org-less (`setActive({ organization: null })`) so every per-card call failed → all badges stuck on "Memuat...". BE moved status into the user-scoped list to fix it.

Enum contract (verified against FE source + live spec 2026-06-14, both 3-member — do NOT assume 2):
- `latest_status` → `VerificationStatus`: `NEW | PROCESSING | COMPLETED` (`src/features/account/domain/enums/verification-status.ts`)
- `verification_outcome` → `VerificationOutcome`: `APPROVED | REJECTED | PENDING` (`src/features/account/domain/enums/verification-outcome.ts`)

Badge label/color map (locked, only data source changes): NEW.PENDING→"Menunggu Verifikasi"/warning, PROCESSING.PENDING→"Sedang Diproses"/warning, COMPLETED.APPROVED→"Aktif"/success, COMPLETED.REJECTED→"Ditolak"/error; unmapped→"Status Tidak Diketahui"/neutral.

FE data layer: parse `data["latest_status"]`/`data["verification_outcome"]` onto BOTH `PersonalAccountModel`/`Entity` + `BusinessAccountModel`/`Entity` (the `AccountTypeModel`/`AccountTypeEntity` union). Canonical mapping pattern already in `data/models/account-verification-work.ts`.

Out of scope for LNS-389: don't remove `useGetAccountVerificationWork` entirely (kept for active-account kyc-summary detail flow); broader `account`-feature verification-works cleanup is LNS-385.

Related FE escape path: LNS-387 ("switch account on REJECTED") depends on this picker showing real statuses.
