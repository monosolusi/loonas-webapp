---
name: accounting-periods-close-warnings-contract-2026-06-25
description: LNS-405 verified — period can_close/can_reopen flags top-level, close 200 warnings[] nested details, distinct PPH_FINAL_NOT_POSTED 422 code unregistered
metadata:
  type: project
---

LNS-405 contract verification (live spec `https://dev-api.loonas.id/openapi.json`, 604712 bytes, re-fetched 2026-06-25). Adopts the already-shipped richer accounting-periods contract (LNS-397, BE done). Builds on [[project_accounting_periods_contract_2026_06_22]] (LNS-377) — that earlier note is now superseded on the points below.

**LIST 200 + CLOSE 200 `AccountingPeriod` object gained fields (top-level, snake_case):**
- `can_close: boolean`, `can_reopen: boolean` — directly on the object (NOT nested), present on both LIST `data[]` and CLOSE 200. Pre-computed capability+state gate so FE shows/hides actions without a trial 403. `can_reopen=false` for `locked` (year-end) periods — reopen needs admin year-unlock `POST /accounting/periods/reopen-year`.
- `status` enum GREW to `['open','closed','locked']` (was 2-state in FE). `isClosed = status !== "open"` still correct.
- `reopened_count: integer` (new, unused by LNS-405).
- Safe defaults when absent: `can_close ?? true` (preserve LNS-377 degrade, 403 safety net catches), `can_reopen ?? false` (never dangle admin-only action).

**CLOSE 200 body = `allOf[ AccountingPeriod, { warnings: array } ]`.** `warnings[]` element is an INLINE object (no named $ref), THREE keys — PPh-Final detail is NESTED under `details`, NOT flat:
- `code: string` ("PPH_FINAL_NOT_POSTED")
- `message: string` (BE human text)
- `details: object|null` — for PPH_FINAL_NOT_POSTED: `period` ("yyyy-MM", e.g. "2026-05" — NOT a timestamp), `tenant_regime` ("pph_final_umkm"), `expected_account_code` ("8110" — NOT account_code/account_id), `period_dpp` (number, IDR MINOR UNITS per spec), `setor_deadline` (format `date` "yyyy-MM-dd", already Asia/Jakarta — NOT date-time; render zoneless, NO setZone or off-by-one risk).

**Mechanism:** `HttpRequest.request` returns the full parsed 2xx body (http-request.ts:84). Warnings already reach the service; they're dropped ONLY because `AccountingPeriodServiceImpl.close` calls `Model.fromJson(result)` which ignores `warnings`. Carrying them needs ZERO HttpRequest change — read `result.warnings`, return a `{ period, warnings }` wrapper (warnings are a transient close artifact, do NOT add to `AccountingPeriodEntity`).

**CLOSE 422 has TWO distinct stable codes:** `PERIOD_NOT_DRAINED` (registered, httpCode 422, details `{unacked_count}`) and `PPH_FINAL_NOT_POSTED` (NOT registered → arrives as ServerError.code="UNKNOWN"/httpCode 500, real code at err.details.code per [[project_server_error_code_passthrough]]). To branch in the provider's `httpCode===422` handler, REGISTER `PPH_FINAL_NOT_POSTED` (httpCode 422) — otherwise it bypasses the 422 branch. 409 also gained `PERIOD_LOCKED` (optional; reopen catches 409 generically).

**Open question for PM/BE (unresolved at Phase-2):** is `period_dpp` IDR rupiah or minor units (sen)? Spec says minor units; FE money convention may treat ints as rupiah. Recommended NOT rendering DPP in v1 until confirmed (100x-wrong tax figure worse than omission).

**Why:** the warnings detail fields are nested+specifically-named; PRD FR-4 assumed flat fields and wrong names (account_code, date-time deadline). Capturing this verbatim prevents the LNS-373/377-class silent-blank drift.
**How to apply:** when planning any close-period warning/advisory UI or the can_close/can_reopen gating, use these verbatim keys; re-fetch the live spec to confirm BE hasn't drifted again before locking the model `fromJson`.
