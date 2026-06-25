---
name: project-periods-close-infra
description: LNS-377 periods/close/reopen surface — net-new FE infra, no FE capability primitive exists, PPh-Final 422 contract, idempotency precedent
metadata:
  type: project
---

LNS-377 builds the `/finance/periods` surface (list + monthly close/reopen) on the already-shipped BE contract `GET/POST /accounting/periods[/{id}][/close|/reopen]`. Shared periods domain/data infra is consumed by LNS-378 (year-end) and LNS-354 (fixed-costs guard).

**Why:** Books-locking is a high-stakes fintech control; FE had no surface to drive the BE close/reopen mechanism (LNS-102).

**How to apply (durable, non-obvious facts):**
- **No FE capability/permission primitive exists** in the accounting feature or `core/` (grep-confirmed 2026-06-22). Any "gated by close capability / admin reopen" requirement needs a capability *source* decided with EL/BE — likely a BE-relay question. Don't assume one exists. **Now formalized:** user deemed this essential → filed **LNS-397** (`fe-requested-be`+`Backend`, High) which **blocks LNS-377**; LNS-377 left In-Progress (no team "Blocked" state) pending it. LNS-397 asks BE for (A) machine-readable close/reopen capability signal and (B) enriched close error contract — distinct 422 codes (PPh-Final-not-posted vs period-not-drained), distinct 409 codes (already-closed vs not-closed), + documented PPh-Final `details` payload (setor_deadline / expected_account_code "8110" / period_dpp / tenant_regime).
- **No FE consumer for `/accounting/periods`** yet — net-new entity/model/repo/source/usecases/hooks. The `AccountingPeriod` schema + status/kind enum members are NOT groundable from FE source; EL parses the raw spec. Status chip map is Terbuka(open)/Terkunci(locked) — validate exhaustiveness (watch a 3rd transitional state) before treating as closed.
- **Idempotency-key FE precedent:** POS pay-in (`src/app/(pos)/pos/_providers/pos-provider.tsx`) mints fresh `crypto.randomUUID()` and re-mints before retry — the established "fresh key per attempt" pattern. Reuse this frame; see [[manual-journal-idempotency]].
- **PPh-Final precondition (LNS-127, BE Done):** post-deadline close → HTTP 422 `PPH_FINAL_NOT_POSTED` (payload: period, tenant_regime, expected_account_code="8110", period_dpp, setor_deadline ISO Asia/Jakarta). Pre-deadline → warning `PPH_FINAL_NOT_POSTED_YET` (close still allowed); transport (2xx-warning vs soft-block) unconfirmed → EL/BE.
- **Idempotency enforcement still open:** LNS-368 Q3 (Backlog, unanswered) — does BE reject close w/o the header; fresh-per-attempt vs stable-per-period.
- Route prefix `/finance/...`; nav in `finance-nav-group.tsx`; ROUTE_MAP in `header-title.tsx`. See [[finance-nav-ia]], [[accounting-list-pagination-drift]].
