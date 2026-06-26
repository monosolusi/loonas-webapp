---
name: lns405-capability-adoption
description: LNS-405 SHIPPED (PR#94, In Review) — FE adoption of LNS-397 period capability contract; can_close/can_reopen gating + 2xx warnings[] PPh advisory; DPP/regime deferred to LNS-407
metadata:
  type: project
---

LNS-405 SHIPPED on PR#94 (In Review 2026-06-25). Pure FE adoption of LNS-397's shipped BE contract on the monthly-periods surface. `Frontend`+`Feature` only (LNS-397 Done PR#277 → consume-not-request, no `fe-requested-be`). Contract validated vs live spec, zero drift.

**What shipped (final state, grounds future periods work):**
- Entity/model (`features/accounting/{domain/entities,data/models}/accounting-period.ts`) expose `canClose`/`canReopen`, mapped from `can_close`/`can_reopen` with safe defaults `can_close ?? true`, `can_reopen ?? false` (reopen defaults false → admin-only never falsely offered; close defaults true → preserves LNS-377 degrade).
- `period-row.tsx` gates ActionMenu by flags; renders `null` when zero options (non-admin never sees reopen).
- 2xx close `warnings[]` now propagated via NEW `ClosePeriodResult` wrapper through source→repo→usecase→hook→provider (it was DISCARDED pre-LNS-405). New `period-advisory.tsx` = calm dismissible non-blocking inline notice below closed row: account 8110 + setor_deadline (Asia/Jakarta, Bahasa `d LLLL yyyy`) + guidance; single+multi warning shapes.
- New domain types `CloseWarning` + `ClosePeriodResult` in `features/accounting/domain/entities/close-warning.ts`; `details` carries expectedAccountCode/setorDeadline/periodDpp/tenantRegime.
- New `ErrorCodes.PPH_FINAL_NOT_POSTED` (422) → tailored inline msg; existing `PERIOD_NOT_DRAINED` 422 path preserved (no LNS-377 AC-5 regression). Graceful-403 safety nets on close+reopen preserved.

**Scoped v1 deferral → LNS-407:** `period_dpp` + `tenant_regime` parsed but NOT rendered. Reason: BE returns `period_dpp` in minor units (sen); rupiah-vs-sen unconfirmed → a possibly-100x-wrong tax figure is worse than omitting (money-precision NFR). Actionable fields (8110 + deadline) ARE shown. LNS-407 = confirm unit then render via NumberDisplay (sen→rupiah at boundary, no FE float math).

**LNS-407 UNIT RESOLVED (2026-06-26, PRD delivered, ticket In Progress):** `period_dpp` = **sen (IDR minor units), CONFIRMED** via live spec `paths./accounting/periods/{id}/close.post.responses.422...details.period_dpp` (desc: "gross revenue (DPP) … in IDR minor units"). `tenant_regime` = string, "always `pph_final_umkm` in v1" → map to "PPh Final UMKM". 422-block details + 2xx advisory `warnings[].details` share one shape. So LNS-407 is pure FE render (Frontend only, NO fe-requested-be), NO open BE question: convert sen→rupiah (÷100) at model boundary, render DPP via NumberDisplay (prefix Rp) + regime label in BOTH single-prose & multi-list advisory shapes; omit on absent/0/unknown. EL open Q = sen-remainder rounding if `period_dpp % 100 !== 0` (recommend round-to-whole-rupiah; expected divisible).

**Tech-debt follow-up → LNS-406:** two PRE-EXISTING items (from LNS-377/371): (1) hardcoded SWR mutation keys `"close-period"`/`"reopen-period"` — GATED "verify convention first" (mutation keys may be intentionally hook-local, differ from list/read cache keys; no skill rule documents it → may close no-op); (2) `domain/sources/accounting-period.ts` re-uses param types from `domain/repositories/`.

See [[periods-close-infra]], [[manual-journal-idempotency]].
