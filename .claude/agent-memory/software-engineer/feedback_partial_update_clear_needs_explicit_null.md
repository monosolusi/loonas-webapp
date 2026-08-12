---
name: feedback_partial_update_clear_needs_explicit_null
description: on a PUT partial-update endpoint, "clear a nullable field" must serialize to explicit null, never the `|| undefined` house fallback — undefined is dropped by JSON.stringify and reads as "leave unchanged"
metadata:
  type: feedback
---

The house idiom for optional string params, `field: value.trim() || undefined` (see
[[feedback_undefined_key_still_present_in_params_obj]]), is correct for a CREATE endpoint (POST) —
there is nothing to "leave unchanged," so an absent key and a `null` key are equivalent. It is
**wrong** for an UPDATE endpoint (PUT) whose contract is partial-update semantics ("omitted = leave
unchanged, `null` = clear the column"): `undefined` values are silently stripped by
`JSON.stringify` (`http-request.ts`), so a cleared field never reaches the wire, the PUT reports
success, and the old value survives.

**Why:** LNS-573 — `sync-variants.ts` used `sku: v.sku.trim() || undefined` for both `addVariant`
(POST, correct) and `updateVariant` (PUT, wrong). Clearing a variant SKU and saving silently kept
the old value. `isVariantChanged` correctly detected the diff and fired the PUT; only the body
encoding was wrong. The BE's deployed OpenAPI spec stated the omitted/null contract verbatim, so
this was independently verifiable, not a guess.

**How to apply:** Before wiring a form-clear action to a PUT/PATCH endpoint, check the BE contract
for partial-update semantics. If "clear = null" is confirmed, (1) the call-site fallback becomes
`value.trim() || null` (never `undefined`) on the update path — note this deliberately diverges
from the same computation's `|| undefined` on a sibling create path if one exists, and that
divergence is correct, not the coincidental-agreement fork CLAUDE.md warns against, because the
two paths have different HTTP semantics; (2) widen the params/repository type chain
(`string?` → `string | null`) end to end; (3) the service-layer PUT method must build its body
**explicitly** (`if (params.field !== undefined) body[...] = params.field`), never `body: params`
passthrough — passthrough is exactly how `undefined`-dropping becomes an accidental
"leave unchanged" instead of an intentional one. Mirror `ProductServiceImpl.update()`'s existing
explicit-body pattern rather than inventing a new one.
