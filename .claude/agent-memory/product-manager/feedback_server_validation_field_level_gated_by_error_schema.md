---
name: server-validation-field-level-gated-by-error-schema
description: Field-level server-validation display in FE is only buildable if the BE Error schema carries per-field details; the loonas Error schema is {code,message} only
metadata:
  type: feedback
---

When an AC asks for "field-level / inline server validation errors," that is only buildable if the backend `Error` response schema actually carries per-field detail (e.g. a `details[]` / `fields{}` map). The loonas BE `Error` schema is **`{code, message}` ONLY** — no per-field channel on the wire. So a 400 `VALIDATION_FAILED` can only surface as a single generic message; per-field server display is NOT achievable from the current contract and would require a BE v2 (add `details[]` to the Error schema).

**Why:** LNS-380 AC-6 ("surface validation errors inline") — EL ruled (accepted, not deferred-debt) that field-level server display is unbuildable because the Error schema has no per-field payload. The AC's "surface the error" bar is still met: generic error toast shown, edits preserved, Save re-enabled, AND FE-side validation (NPWP 15/16 digits, NPPKP ≤30, date validity) blocks most 400s pre-submit. PM signed off this gap as acceptable for v1.

**How to apply:** When writing an AC that branches on inline/field-level server errors, first confirm the BE Error schema exposes per-field detail (via EL / live OpenAPI). If it's `{code,message}`-only, scope the AC to "generic error surfaced + edits preserved + retry enabled + FE pre-submit validation," and file the per-field-detail need as a separate `fe-requested-be` (BE Error-schema enhancement) rather than blocking the FE ticket. Related: [[reference_fe_requested_be_label]], [[project_account_settings_contract_2026_06_24]].
