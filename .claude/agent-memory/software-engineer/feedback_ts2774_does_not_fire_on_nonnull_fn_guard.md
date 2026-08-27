---
name: feedback_ts2774_does_not_fire_on_nonnull_fn_guard
description: tsc does NOT raise TS2774 for `if (fn) fn()` when fn's type is narrowed to non-nullable in this tsconfig — grep is the only reliable sweep for dead null-guards on a function-typed field
metadata:
  type: feedback
---

`tsc --strict` in this repo does NOT flag `if (refresh) refresh();` (or `if (state.refresh) …`) as
TS2774 ("this condition will always return true") even after `refresh`'s type is narrowed from
`T | null` to a non-nullable function type (`KeyedMutator<T>`) on every union member. Verified with
a minimal repro (`function foo(): void {}; const refresh = foo; if (refresh) refresh();` under
`tsc --strict --noEmit`) — zero diagnostics. Confirmed on LNS-757: after widening `refresh` to
non-null across 13 hooks, `npm run typecheck` stayed green with the four `if (refresh)` /
`if (hookResult.refresh)` guards still in place — the compiler gave no worklist.

**Why:** an approved plan (LNS-757) explicitly said dropping the nullability would make these sites
"hard TS2774 errors" and used that as the proof step between the types-edit and the consumer-edit.
It didn't happen — the plan's own fallback (grep for `if \(refresh\)|refresh\?\.\(\)|if \(hookResult\.refresh\)`)
was the only mechanism that actually found the 11 in-scope sites (4 `if()` + 7 `?.()`).

**How to apply:** when a plan claims narrowing a nullable field to non-null will surface `tsc`
errors at existing defensive-guard call sites, don't trust that as the sole worklist generator —
verify with a throwaway repro first, or just grep from the start. `no-unnecessary-condition` (which
WOULD catch this) is off in this repo's `eslint.config.mjs` (`tseslint.configs.recommended`, not
`recommendedTypeChecked`), so neither the compiler nor lint catches a redundant `if (nonNullableFn)`
guard here — only a manual grep sweep does. See [[feedback_repo_is_not_prettier_clean]] for the
sibling lesson that this repo's toolchain has real, documented gaps rather than catching everything.
