---
name: route-map-dynamic-segment
description: Dynamic route segments in header-title.tsx use an if-block in useMemo, not a bracket key in ROUTE_MAP
metadata:
  type: feedback
---

When adding a header title for a dynamic route (e.g., `/finance/journals/[id]`), do NOT add a bracket-pattern key to the static `ROUTE_MAP` object. Instead, add a dynamic `if` block in the `useMemo` BEFORE the `ROUTE_MAP` lookup.

Example pattern:
```typescript
if (segments[0] === "finance" && segments[1] === "journals" && segments[2] && segments[2] !== "new") {
  return { title: "Detail Jurnal" };
}
```

**Why:** `usePathname()` returns the actual URL path with real IDs (e.g., `/finance/journals/abc-123`), not bracket patterns like `/finance/journals/[id]`. A static `ROUTE_MAP` key of `"finance/journals/[id]"` will never match a real path. (LNS-372 fix loop — EL corrected bracket-key approach.)

**How to apply:** Every time the chrome page title doc says "add to ROUTE_MAP", check if the route has dynamic segments. If yes, use the `if` block pattern instead of a ROUTE_MAP key.
