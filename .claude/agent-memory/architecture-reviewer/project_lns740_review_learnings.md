---
name: lns740-review-learnings
description: LNS-740 cash-entry create flow review — 1 Minor (recovery copy no-op); corrected idempotency/classification template vs journal-create twin; registry-absent code literals accepted pending second consumer
metadata:
  type: project
---

Reviewed the uncommitted LNS-740 create flow (11 files under `app/(authenticated)/accounting/cash-entries/new/`, branch `feat/cash-entry-create-flow` on `release/kas-masuk-kas-keluar`). Verdict: findings (1 Minor), approve.

- **`cash-entry-create-provider.tsx` is now the corrected positive template** for create-flow submit+idempotency: key minted once in a ref at the form-state owner, transport status from `details["status"]`, `shouldRotateIdempotencyKey` gating, rotation *only* inside the ServerError branch (network failures keep the key), classification extracted to a pure node-tested `_utils/classify-create-error.ts` whose `code` the provider reads instead of re-deriving the unwrap. The twin `journals/new/_providers/journal-create-provider.tsx` still carries both known anti-patterns (bare-catch rotation at :154/:186, `err.httpCode === 422` branch at :102) — cite the cash-entry provider, not the journal one.
- **Deviation precedent, validated by the lead's framing:** two per-operation pure classifiers co-located in one `_utils` module (entry + category create) sharing one `unwrapCode` is fine; and matching registry-absent BE codes (`JOURNAL_ACCOUNT_INVALID`, `CASH_ACCOUNT_NOT_SEEDED`) as module-local literals with a doc comment is fine — promote to `ErrorCodes` only when a second consumer appears. Verified the fallback mechanism end-to-end: `HttpRequest` throws `UNKNOWN` + `details.code` + `details.status`, and `ServerError`'s `Object.assign` lets `details.code` override the registry code.
- The 1 Minor (recovery copy naming a no-op action) is generalized at [[error-copy-names-real-recovery]].
- **Newly-sized pre-existing debt:** the `UNKNOWN`/`details.code` unwrap now has **6 repo copies** — 4 inline in providers (`journals/new` :86, `journals/[id]` :61, `pph-final` :82, `opening-balance-wizard` :357) and 2 in pure classifiers (`classify-cancel-error.ts`, `classify-create-error.ts`). Repo-wide consolidation candidate; per-diff copies are consistent with existing classifier precedent, so don't block on them.
- **`search-combobox.tsx:67` still ships `props.disabled && "opacity-50"`** on its wrapper — the exact defect class CLAUDE.md's F10/SelectInput rule bans (label fades to ~2.8:1 on white). Pre-existing component, but every dialog that disables it over a load/error state exercises it. Cleanup-ticket material, not a per-diff finding.

[[lns741-review-learnings]] [[project-lns738-review-learnings]]
