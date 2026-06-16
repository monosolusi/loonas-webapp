---
name: discriminated-union-narrowing
description: How to safely access fields from discriminated-union hook return types
metadata:
  type: feedback
---

The hook return discriminated union (InitialState | LoadedState | ErrorState) cannot be narrowed by checking two fields independently (e.g., `!hookResult.loading && hookResult.error !== null`). TypeScript narrows on the discriminant field alone.

Safe pattern for components:
```ts
const isLoading = hookResult.loading;
const hasError = !hookResult.loading && hookResult.error !== null;
const hasData = !hookResult.loading && hookResult.error === null && hookResult.data !== null;

// Then access data only in hasData branch — TS narrows correctly
const lines = hasData ? hookResult.data.lines : [];
```

For `isLoadingPage` (only on LoadedState), use:
```ts
const isLoadingPage = hookResult.loading === false && hookResult.error === null
  ? hookResult.isLoadingPage
  : false;
```

**Why:** TS evaluates discriminant narrowing on the union tag (`loading`, `error`), not arbitrary boolean expressions. Sequential narrowing flags work correctly.

**How to apply:** Everywhere a component or provider consumes a discriminated-union hook return and needs to access state-specific fields.
