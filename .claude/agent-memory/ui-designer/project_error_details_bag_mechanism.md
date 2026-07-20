---
name: project-error-details-bag-mechanism
description: How ServerError carries BE-provided structured error fields (double-nested `.details.details`), and the provider-parity risk this creates for new 422 codes
metadata:
  type: project
---

`core/helpers/http-request.ts` parses any non-2xx response, looks up `ErrorCodes.find(data.code)`, and throws `new ServerError(ErrorCode, { message: data.message, details: data.details })`. Because `ServerError`'s constructor does `this.details = Object.assign({}, { code, message }, details)`, the RAW backend detail payload ends up **double-nested**: `serverError.details.details.<field>` (the code has its own comment noting this). No camelCase transform happens at this layer — whatever key casing the BE sends is what you get. Contrast: the 2xx `warnings[]` advisory array on close-period IS camelCased, via the `CloseWarning` domain entity/model — a different code path, don't confuse the two.

Also: `ServerError.message` prefers the BE's raw `data.message` over the FE's static `ErrorCodes.X.message` registry string (`this.message = details?.message ?? code.message`). This means any handler that does `setSomeError(err.message)` for a generic 422 catch-all (rather than `ErrorCodes.X.message`) will leak whatever raw string the backend sends straight to the user — a real risk when a jargon-free, FE-owned Indonesian copy is required.

**Why discovered:** LNS-457 — `periods-provider.tsx`'s `handleClosePeriod` explicitly branches per `err.code` and uses `ErrorCodes.X.message` (FE-owned copy), but `fixed-cost-entries-provider.tsx`'s equivalent handler has a generic `else if (err.httpCode === 422) { setClosePeriodError(err.message) }` catch-all that would surface the BE's raw message for ANY new 422 code it doesn't explicitly branch on — these two integration points, which share the same close-period 422 contract, had already silently diverged in structure.

**How to apply:** Whenever adding a new error code that needs FE-owned copy, check ALL sibling providers that consume the same BE endpoint/error family (grep, don't assume) — a generic 422 branch in one of them is not "already handled" by default; it may be passing raw BE text straight through instead of the intended FE copy.

Related: [[project_lns457_failed_postings_retry]], [[project_periods_page]]
