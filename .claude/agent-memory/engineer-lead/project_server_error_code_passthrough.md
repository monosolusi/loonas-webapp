---
name: server-error-code-passthrough
description: For unregistered BE error codes, ServerError.code is "UNKNOWN" (httpCode 500) and the real code lives in details.code — to branch a provider on a BE code, register it in ErrorCodes or read details.code
metadata:
  type: project
---

For an error code the backend returns that is NOT registered in `src/core/resources/server-error.ts` `ErrorCodes`, `HttpRequest` builds `new ServerError(ErrorCodes.UNKNOWN, { code, message, details })`. So `serverError.code` becomes `"UNKNOWN"` and `serverError.httpCode` becomes `500` — only the human `message` passes through (via `details.message`). The real BE code is nested at `serverError.details.code`. `ErrorCodes.find()` matches on the **code string only**, so a registered code resolves regardless of which HTTP status the BE returns it under.

**Why:** LNS-371 AC7 — `journal-create-provider.tsx` `mapServerError` branched on `err.code === "PERIOD_CLOSED"` and `err.httpCode === 422`, both unreachable because the code wasn't registered (it arrived as UNKNOWN/500). Closed-period silently fell to the generic toast instead of the inline date error. Fix: register `PERIOD_CLOSED` in `ErrorCodes`. My Phase-2/3 D4 wrongly assumed `.code` passthrough for unregistered codes.

**How to apply:** Any plan that branches a provider on a specific BE error code must FIRST confirm the code is in the `ErrorCodes` registry, OR branch on `details.code` (e.g. `const code = err.code === "UNKNOWN" ? (err.details?.code ?? err.code) : err.code`). Never assume `serverError.code` carries the BE code. Caveat: UI `WarningEntry.code` values (in-band 201 `warnings[]`) are a DIFFERENT namespace from BE error-response codes — do not register a warning code as an error code (LNS-371 mis-promoted `DATE_IN_CLOSED_PERIOD`, caught in Phase-7 contract re-validation).

Related: [[clerk-error-classification]], [[opening-balance-contract-2026-06-19]], [[accounting-periods-contract-2026-06-22]]
