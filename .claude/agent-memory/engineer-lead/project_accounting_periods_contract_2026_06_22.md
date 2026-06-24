---
name: accounting-periods-contract-2026-06-22
description: LNS-377 verified — /accounting/periods list/get/close/reopen contract, AccountingPeriod schema (no label/reason field), page-IN/page-OUT, Idempotency-Key required, no capability field, generic Error 422
metadata:
  type: project
---

LNS-377 feasibility pass (2026-06-22) verified against live `https://dev-api.loonas.id/openapi.json` (raw JSON parse). Net-new FE work — no AccountingPeriod domain/data/entity/model exists in `src/features/accounting`. Periods infra is shared with LNS-378 year-end; design reusable.

**`AccountingPeriod` schema (verbatim):** `id` (uuid), `account_id` (uuid), `kind` enum `["month"]` (single member), `start_date` (date), `end_date` (date), `status` enum `["open","closed"]` (clean 2-state, NO transitional — Terbuka=open, Terkunci=closed), `closed_by_user_id` (uuid, nullable), `closed_at` (date-time, nullable), `created_at` (date-time).
- **NO month/period label field** → derive display label ("Mei 2026") from start_date/end_date via Luxon (id locale).
- **NO reason field returned** → the `reason` POSTed on close/reopen is write-only, never echoed on the period object.

**GET /accounting/periods** (`listAccountingPeriods`): query `status` enum `[open,closed]`, `kind` enum `[month]`, `page` (min 1, default 1), `limit` (min 1, **max 100**, default 25). Response `{data, meta}`, `meta` = `PaginationMeta` page/limit/total/total_pages. **Symmetric page-IN/page-OUT** — does NOT repeat the LNS-386 journal-list offset-IN trap; use the standard page-based sibling pattern (`/accounting/accounts`, `coa-mappings`, `fixed-cost-entries`), NOT journal.ts offset conversion. See [[journal-list-param-drift]].

**GET /accounting/periods/{id}** (`getAccountingPeriod`): 200 AccountingPeriod, 404 NOT_FOUND.

**POST /accounting/periods/{id}/close** (`closeAccountingPeriod`): `Idempotency-Key` header **required: true** (pattern `^[A-Za-z0-9_-]{8,255}$`; randomUUID satisfies it). Body `{reason?}` (maxLength 500, optional). 200 AccountingPeriod / 400 (validation or missing key) / 403 (not authenticated OR feature not enabled) / 409 (already closed) / **422 ("Period not drained (pending outbox events) OR PPh Final not posted" — TWO conditions under one 422)**.

**POST /accounting/periods/{id}/reopen** (`reopenAccountingPeriod`): `Idempotency-Key` header **required: true**. Body `{reason}` **required, minLength 10, maxLength 500**. 200 / 400 / 403 / 409 (period not closed — cannot reopen an open period). NO 422.

**Idempotency:** follow POS lifecycle [[pos-idempotency-key-lifecycle]] — fresh key per attempt (page-level provider, lazy useState + regen-on-retry), never reuse across an unwanted 4xx. Plumb via HttpRequest `config.headers` like `invoice.ts:116`. `IDEMPOTENCY_KEY_CONFLICT`/`IDEMPOTENCY_KEY_IN_PROGRESS` already in ErrorCodes.

**Capability gating — NOT spec-answerable.** No per-period capability field, no capabilities/me endpoint, no close/reopen permission flag. Account carries only `role` (free-form string) + `features` (string[] → `hasFeature`), both product-feature enablement not actor-permission. Close/reopen gated purely by 403. PRD's "reopen hidden for non-admins" has no spec source → recommend FE always renders reopen and relies on 403 (v1 default) unless BE supplies a capability/role string. (`membership.ts` isOwner is org-membership, unrelated.)

**422 rich payload — NOT in schema.** All errors `$ref` generic `Error` = `{code, message}` only. The PRD's `PPH_FINAL_NOT_POSTED` rich payload (tenant_regime / expected_account_code "8110" / period_dpp / setor_deadline) is NOT documented anywhere (grep of all schemas: zero pph/setor/regime/dpp error matches) — BE-prose-only, same as LNS-344. HttpRequest now DOES forward `data.details` (see [[opening-balance-contract-2026-06-19]] corrected note), so IF BE sends it, it survives to `serverError.details.details` — but plan must degrade gracefully (generic Bahasa keyed off `code`, opportunistically surface rich fields if present).
