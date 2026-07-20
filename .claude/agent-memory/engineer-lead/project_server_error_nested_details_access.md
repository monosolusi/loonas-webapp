---
name: project_server_error_nested_details_access
description: BE error `details` payload is DOUBLE-nested on the FE — read it via err.details.details.<key>, never err.details.<key>
metadata:
  type: project
---

Backend error `details` objects (e.g. the close-period 422 `{ failed_count }`, `{ unacked_count }`) are reachable on the FE `ServerError` at `err.details.details.<key>` — DOUBLE-nested — NOT `err.details.<key>`.

**Why:** `http-request.ts` (registered-code path, ~L70-77) throws `new ServerError(ErrorCode, { message, details: data.details })`. The `ServerError` ctor (server-error.ts ~L524-530) does `this.details = Object.assign({}, { code, message }, arg)`, so the passed `{ details: data.details }` lands as `this.details.details`. Net: `err.details.details === data.details`. A shallow `err.details.failed_count` yields `undefined` — and because `err.details` is typed `Record<string, any>`, tsc/lint never catch it; the count-less fallback renders silently and passes auth-gated QA. This is the #1 silent-bug class for any count/detail-bearing BE error.

**How to apply:** Whenever a plan reads a value out of a BE error's `details`, specify the access as `err.details?.details?.<key>` (guarded), and require the contract-re-validation pass to confirm the leaf key VERBATIM against the live spec (the 422 `details` shape is flat-per-code: `unacked_count` for PERIOD_NOT_DRAINED, `failed_count` for PERIOD_HAS_FAILED_POSTINGS, etc.). Complementary to [[project_server_error_code_passthrough]] (which covers UNREGISTERED codes → code="UNKNOWN"/httpCode 500, real code at `err.details.code`).
