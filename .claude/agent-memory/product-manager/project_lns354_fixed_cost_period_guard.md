---
name: lns354-fixed-cost-period-guard
description: LNS-354 FE-only — fixed-costs page consumes shipped period infra + PERIOD_CLOSED 409 guard; reuse not rebuild
metadata:
  type: project
---

LNS-354 (FE, `be-requested-fe`+`Frontend`, In Progress 2026-06-25): make `/finance/fixed-costs` period-aware. FE-only consumption of already-shipped BE — NO `fe-requested-be`.

**Reuse mandate (biggest risk = duplication):** the full `accounting-period` stack already ships (LNS-377+405): entity/model/repo/source + hooks `useListPeriods`/`useClosePeriod`/`useReopenPeriod`. Period entity has `status` (`open|closed|locked`), `isClosed`(=`!==open`), `isLocked`(=`locked`), Bahasa `label` getter, and `canClose`/`canReopen` capability flags. BE field names: `start_at`/`end_at`/`status`/`can_close`/`can_reopen`/`closed_at`/`closed_by`; list is `{data,meta}` paginated.

**PERIOD_CLOSED contract (from LNS-51 BE comment, shipped):** create/update/delete fixed-cost entry whose `start_date` falls in a closed/year-locked period → `409 {code:"PERIOD_CLOSED", message:"Periode akuntansi sudah ditutup; jurnal tidak dapat diposting ke periode yang tertutup"}`. null-period (no row for that date) = allowed/editable. `ErrorCodes.PERIOD_CLOSED` (httpCode 409, Indonesian msg) **already in** `src/core/resources/server-error.ts:397`.

**Silent-failure gap to fix:** `fixed-cost-entries-provider.tsx` `save()` catch-all (~line 124) swallows everything into generic "Gagal menyimpan biaya tetap" — must branch on `ServerError.code==="PERIOD_CLOSED"`. The page is a month-navigated inline currency-input grid (no per-row edit/delete) → "form disabled" = disable whole month's inputs + Save + Copy-prev-month.

**Why:** establishes the consumer pattern for period-status-aware accounting pages (read status via useListPeriods, gate edits on isClosed, gate close action on canClose, fresh Idempotency-Key per close). Links [[project_periods_close_infra]] [[project_lns405_capability_adoption]] [[feedback_server_validation_field_level_gated_by_error_schema]].
