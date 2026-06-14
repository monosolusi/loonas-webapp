---
name: accounts-list-vs-me-status-drift
description: GET /accounts (list) carries latest_status/verification_outcome; GET /accounts/me does NOT — both feed same Account models, so status fields must be optional
metadata:
  type: project
---

LNS-388 (merged 2026-06-14) added top-level `latest_status` + `verification_outcome` to the **list** item shape of `GET /accounts` (operationId `listAccounts`), required + populated org-less. But `GET /accounts/me` (`getCurrentAccount`) returns full `PersonalAccount`/`BusinessAccount` `$ref` schemas that do **NOT** carry those two fields. Both endpoints deserialize into the SAME `PersonalAccountModel`/`BusinessAccountModel`.

**Why:** BE put per-account status on the list (thin summary) to unblock the org-less `/accounts` picker badges (LNS-389), but did not backfill it onto the single-account `/accounts/me` payload.

**How to apply:**
- When adding `latestStatus`/`verificationOutcome` to the account entities/models, make them **optional** (`?`), not required-everywhere. The `/accounts/me` path (`AccountServiceImpl.getCurrent`) constructs the same model with the fields absent — required typing would force a fake value there and the runtime parse would yield `undefined` anyway.
- `fromEntity` on both account models has **zero external callers** (verified 2026-06-14) — it's defined but dead. It can safely omit the new fields without breaking any call site.
- The detail page `/accounts/[id]` does NOT fetch a single account — it reuses `useListAccount()` and `.find()`s by id. So the detail-page status badge ALSO consumes the list payload and gets the new fields. `AccountStatusBadge` has 2 callers: `account-card.tsx` (list) + `account-detail-left-panel.tsx` (detail).

**Separate pre-existing drift (NOT LNS-389 scope):** the `/accounts` list item schema declares only 5 props (`id`, `type`, `latest_status`, `verification_outcome`, `membership`) — none of the deep detail fields (`full_name`, `id_number`, `company`, `created_at`, …) that `*AccountModel.fromJson` parses. The UI doesn't currently crash because nothing in the `/accounts` subtree renders deep fields (only id/type/fullName/membership/status). If a future feature renders deep fields off a list-sourced account, this drift bites. Flag to BE if it matters.
