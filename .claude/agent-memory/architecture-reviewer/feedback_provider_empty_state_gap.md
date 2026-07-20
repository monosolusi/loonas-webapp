---
name: provider-empty-state-gap
description: Provider shellState never emits "empty" but impl checks for it — dead code gap; Minor finding
metadata:
  type: feedback
---

When a page-level report provider computes `shellState` but omits the `"empty"` branch (e.g., only returns `"loading"`, `"error"`, `"success"`), any `EmptyBody` component imported in the corresponding impl is permanently unreachable dead code.

**Why:** Found in LNS-376 `calk-provider.tsx` — `shellState` had no length-zero branch, so `CalkEmptyBody` referenced in `calk-impl.tsx` could never render. Compare `neraca-provider.tsx` which correctly adds `if (hookResult.data && hookResult.data.sections.length === 0) return "empty"`.

**How to apply:** When reviewing a new report provider + impl pair, cross-check: (1) does the provider's `shellState` useMemo ever return `"empty"`? (2) does the impl check `shellState === "empty"`? If (2) is true but (1) is not, flag as a Minor finding — either wire the empty branch or remove the dead check. Ask the team whether an empty-notes state is a valid product scenario before recommending direction.
