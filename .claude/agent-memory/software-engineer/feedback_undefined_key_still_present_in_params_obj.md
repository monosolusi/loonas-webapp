---
name: feedback_undefined_key_still_present_in_params_obj
description: this project's `field: value || undefined` params objects always have the key present (JS "in" true) even when value is undefined — test the value, not "in"
metadata:
  type: feedback
---

When a call-site params object is built with `sku: v.sku.trim() || undefined` (the house pattern for
optional string fields sent to services — seen in `sync-variants.ts`, `create-pos-sale-body.ts`, etc.),
the key is a literal property in the object literal, so `"sku" in obj` is **always `true`** regardless
of whether the trimmed value was empty. The omission that matters for the real request only happens at
the JSON-serialization boundary — `JSON.stringify` drops `undefined`-valued keys, so the wire body omits
it, but the raw JS object handed to a hand-rolled test recorder does not.

**Why:** LNS-570 sync-variants.test.ts. The approved plan's own test-writing brief said to check both
`calls.updates[0].sku` and `"sku" in calls.updates[0]"` to distinguish "sent `sku: undefined`" from
"omitted `sku`" (a real distinction when *asserting with `toEqual`*, since `toEqual`/`toHaveBeenCalledWith`
treat `{sku: undefined}` as equal to `{}`). But when reading the recorded object directly (not via
`toEqual`), `"sku" in obj` is not a useful discriminator for this codebase's params style — it's always
true. Wrote `expect("sku" in calls.updates[0]).toBe(false)`, which failed the real (non-buggy) code
itself; fixed by asserting `.sku` is `undefined` plus `JSON.stringify(...)` doesn't contain `"sku"` to
prove the wire-level omission.

**How to apply:** When writing a hand-rolled recorder test (see `[[feedback_code_patterns]]`-adjacent
house idiom in `idempotency-rotation.test.ts`) against a call site using `field: value || undefined`,
assert `.field === undefined` (and/or `JSON.stringify` if the wire-level omission itself is the AC) —
do not assert `"field" in obj` as a proxy for "omitted," it will always be true.
