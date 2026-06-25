---
name: project-lns381-pph-final-settle
description: LNS-381 FE PPh Final UMKM self-setor form — net-new wiring on shipped POST /accounting/pph-final-settle; combobox has no filter seam; mirror journal-create idempotency
metadata:
  type: project
---

LNS-381: FE form to post the monthly PPh Final UMKM 0.5% self-setor journal (canonical Dr Beban PPh Final / Cr Kas). FE-only adoption of an already-shipped BE contract (`Frontend`+`accounting`+`Feature` labels; NO `fe-requested-be`).

**Why:** Non-PKP UMKM owner owes PPh Final 0.5% monthly via self-setor and has no in-app way to record it without building a raw manual journal. Manual self-payment only (automation out of scope per LNS-96; BE pattern shipped via LNS-98/LNS-122).

**How to apply (Phase-1 grounding + Phase-2 LOCKED contract):**
- **NO existing FE consumer** of `POST /accounting/pph-final-settle` — net-new service/model/repo/usecase/hook/page. The `pph-final` grep hits are all the tax-posture feature (LNS-380), a different flow. See [[reference_payment_features_disambig]].
- **BE contract LOCKED (Phase-2, live spec via EL):** required `[cash_account, amount, journal_date]`. `cash_account`=object `{id}` (uuid, asset account code range **1100–1199**, not just asset type). `amount`=**rupiah INTEGER** (NOT sen). `journal_date`=date-only `^\d{4}-\d{2}-\d{2}$` → send `.toISODate()` NOT `.toISO()`. `memo`=optional, maxLength 500. Response=**bare JournalEntry, NO `{data}` wrapper**, carries `id` → `router.push('/finance/journals/${id}')`.
- **`Idempotency-Key` is a REQUIRED header** (BE middleware) — missing → `400 IDEMPOTENCY_KEY_REQUIRED`; same key+body within 24h replays cached response. This endpoint returns **201|4xx only, NO `warnings[]`** → mirror journal-create idempotency MINUS the warn→ack two-phase.
- **Errors:** 400 (validation/missing idem-key), 403 `FEATURE_NOT_AVAILABLE` (accounting gate→access-denied), 422 (non-asset/out-of-range cash acct — **no documented `code` string**, map by httpCode→server msg), 409 `PERIOD_CLOSED` (keep defensively; spec silent on closed-period for this endpoint).
- **`LedgerAccountCombobox` has NO type/category filter seam** (props: value/onChange/label/noLabel/placeholder/required/disabled/excludeIds only). EL resolved it: add optional **predicate prop** `filter?: (a: LedgerAccountEntity) => boolean`; caller passes `(a)=>a.type===ASSET && a.code>="1100" && a.code<"1200"`. Same gap noted in [[project_journal_line_editor]].
- **Mirror the money-movement create precedent** in `finance/journals/new/_providers/journal-create-provider.tsx` (idempotency ref + in-flight disable + `mapServerError`), MINUS the warn→ack two-phase. See [[feedback_manual_journal_idempotency]].
- **Access-denied precedent:** `settings/tax-posture/_components/tax-posture-access-denied.tsx` (LNS-380 graceful-403 degrade) — locked Bahasa copy. See [[project_periods_close_infra]] for the same degrade pattern.
- **ROUTE_MAP** is literal-pathname keyed → `/finance/pph-final` needs a new literal entry in `header-title.tsx`.
- Error schema is `{code,message}` only (no per-field detail) → field-level server validation unavailable; FE pre-submit validation + generic mapped messages. See [[feedback_server_validation_field_level_gated_by_error_schema]].
- Blocker LNS-372 (journal detail) is Done; success links to that detail page. See [[project_lns372_journal_detail_reverse]].
