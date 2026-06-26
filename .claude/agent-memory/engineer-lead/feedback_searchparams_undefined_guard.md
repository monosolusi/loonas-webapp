---
name: searchparams-undefined-guard
description: Data-source searchParams for OPTIONAL params must be per-key guarded (if (params.x)), never set unconditionally — http-request.ts serializes undefined as the string "undefined"
metadata:
  type: feedback
---

When specifying how a `data/sources/*.ts` method builds `searchParams`, an OPTIONAL param (`x?: string`) must be assigned per-key-guarded — `if (params.x) searchParams["k"] = params.x;` — NEVER set unconditionally in the object literal (`{ k: params.x }`).

**Why:** `core/helpers/http-request.ts:44` does `url.searchParams.set(key, value)` with NO undefined guard, so `set("from", undefined)` coerces to the literal string `"undefined"` → `?from=undefined`. Unconditional-set is ONLY safe when the source param TYPE is required (non-optional). In LNS-415 I instructed SWE to set `from`/`to` unconditionally by mirroring `report.ts` getGeneralLedger — but that precedent's `from`/`to` are REQUIRED typed params, whereas `ListLedgerEntriesServiceParams.startDate/endDate` are OPTIONAL. arch-review flagged it as a change-introduced blocker (B1); fix was the per-key guard, matching the same file's own `getBalance`/`list` convention.

**How to apply:** Before forwarding a "mirror this precedent's param assignment" instruction, check the OPTIONALITY of the params in BOTH the precedent and the target type. Match the per-key-guard convention the target file already uses for its other optional params; reserve unconditional-set for genuinely required (non-optional) params. Note: for an endpoint whose query param is REQUIRED by the contract but OPTIONAL in the FE type, guarding turns an undefined into an *omitted* param → a clean BE 400 (missing required), which is the correct loud failure rather than a malformed `?k=undefined`. Relates to [[tb-gl-contract-2026-06-16]] (the LNS-415 getGeneralLedger repoint).
