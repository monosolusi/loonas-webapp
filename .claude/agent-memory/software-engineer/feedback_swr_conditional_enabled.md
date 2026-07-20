---
name: swr-conditional-enabled
description: How to do conditional SWR fetching in this codebase without violating hooks rules
metadata:
  type: feedback
---

When a hook should only fetch under certain conditions (e.g., GL report only when account is selected), add an `enabled?: boolean` param to `UseXxxParams` and use a null SWR key when disabled:

```ts
const enabled = params.enabled !== false;
const { data } = useSWR(
  enabled ? [SWR_KEYS.FOO, { ...params, clerk }] : null,
  FetcherFn,
  { keepPreviousData: true },
);
```

**Why:** React hooks can't be called conditionally. Passing `null` as the SWR key is the SWR-native idiom for skipping fetches. The `enabled` flag lives in the public params type so callers can control it declaratively.

**How to apply:** Any hook that wraps a resource that depends on a user selection (account, partner, etc.) should use this pattern.
