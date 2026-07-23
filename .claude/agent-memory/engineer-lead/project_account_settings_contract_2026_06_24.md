---
name: account-settings-contract-2026-06-24
description: LNS-380 tax-posture / account-settings BE contract verified against live OpenAPI — GET/PATCH/audit shapes, date-format asymmetry, is_pkp read-only, PATCH 404 edge
metadata:
  type: project
---

LNS-380 (FE: Tax Posture / Account Settings page) — BE contract verified against live `https://dev-api.loonas.id/openapi.json` on 2026-06-24 (LNS-367 shipped it). FE is **greenfield**: zero existing account-settings artifacts in `src/`, no `useGetAccountingSettings` (memory [[project_accounting_prd_lock_2026_05_12]]'s `useGetAccountingSettings` reference never materialized — do not assume it exists).

**Three endpoints, all gated by `MANAGE_ACCOUNT_SETTINGS` capability (403 FORBIDDEN otherwise):**
- `GET /accounting/account-settings` → `{ data: AccountSetting }`. Always 200, never 404. No-row case = "null triad": `id`/`created_at`/`updated_at` all `null`, defaults legal_form='sole_proprietor', is_pkp=false, is_pph_final_umkm=true.
- `PATCH /accounting/account-settings` → `{ data: AccountSetting }`. All fields optional; omit = unchanged, send `null` = clear column.
- `GET /accounting/account-settings/audit?page&limit` → `{ data: AccountSettingAudit[], meta: PaginationMeta }` (page/limit/total/total_pages; limit max 100, default 25; newest first).

**CRITICAL date-format asymmetry (PM open Q#2 answer):** GET/`AccountSetting` returns `pkp_effective_date` and `pph_final_eligibility_start` as **`date-time`** (full ISO instant, e.g. `2025-01-01T00:00:00.000Z`). PATCH requestBody expects **`date`** (date-only `YYYY-MM-DD`) for the same two fields. Model must read date-time on the way in and the use case/repo must emit date-only on the way out — do NOT echo the GET value back verbatim on PATCH.

**`is_pkp` read-only:** entirely ABSENT from PATCH requestBody schema (not just prose). Sending it → 400 VALIDATION_FAILED. FE form must never include it in the write payload.

**PATCH 404 edge the brief missed:** `NOT_FOUND` (404) when no settings row exists yet AND the request body is empty (no posture fields). With a partial-PATCH/dirty-field-diff form this is reachable if a user opens the form with no row and saves without touching anything — guard by disabling save when nothing is dirty.

**AccountSettingAudit per-entry (PM open Q#1 — the biggest unknown, now resolved):** `id`(uuid), `account_id`(uuid), `actor_user_id`(opaque Clerk id, NOT resolved to name/email in v1), `actor_role`(string e.g. owner/accountant/internal), `changed_fields` (object map: key=field name, value=`{prior, next}` — prior/next are any scalar|null; untouched fields omitted; possible keys legal_form/is_pkp/npwp/nppkp/pkp_effective_date/is_pph_final_umkm/pph_final_eligibility_start/sektor_klbi), `npwp_classification` (nullable enum `npwp_15|npwp_16|nik_as_npwp`, null when npwp untouched), `created_at`(date-time). No display-name resolution server-side → FE history shows raw Clerk id + role only in v1.

**Other confirmed:** legal_form enum exactly `sole_proprietor|cv|firma|pt|koperasi`. npwp pattern `^\d{15,16}$`. nppkp max 30, sektor_klbi max 10 (both nullable strings). All snake_case. `Error` schema is `{code, message}` only — no `details` (but ServerError ctor already accepts optional details so no blocker).

**FE gate:** `account.hasFeature("accounting")` is a `features.includes()` check (`personal-account.ts`/`business-account.ts`); the settings landing (`settings/page.tsx`) gates the card via `account?.hasFeature(c.feature)` with `feature:"accounting"`. There is NO `MANAGE_ACCOUNT_SETTINGS` capability on the FE account/session model — so visibility proxy = `hasFeature("accounting")`, true enforcement = the 403 from BE. Acceptable; same pattern as coa-mappings. See [[project_feature_flag_mechanism]].

Template to follow: `settings/coa-mappings/` (page = provider+components, `_providers/coa-mappings-provider.tsx`, hand-rolled `useState`+`useMemo` form state, `useSWRMutation` trigger+isMutating, `revalidateSWRKey()` + `ACCOUNTING_SWR_KEYS` constants). No react-hook-form in repo. Place under `features/accounting/` (extend, don't new-feature). New SWR keys needed: GET settings + LIST audit.
