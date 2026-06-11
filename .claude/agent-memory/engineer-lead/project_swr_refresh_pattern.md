---
name: swr-refresh-pattern
description: Established convention for exposing manual refresh from SWR-backed hooks in this codebase
metadata:
  type: project
---

SWR-backed `useGet*` / `useList*` hooks in this repo expose manual revalidation as `refresh: KeyedMutator<T>` on the LoadedState of the discriminated return union, and `refresh: null` on InitialState/ErrorState.

**Why:** Consistency — `use-get-verification-work`, `use-list-members`, `use-list-payment-method`, `use-list-partner-invoice`, `use-get-notification-config`, and `use-list-account` all use this exact shape. Per Context7 (vercel/swr), bound `mutate()` with no args is the canonical revalidation trigger.

**How to apply:** When a feature needs manual refresh (e.g., a "Cek status" button, page-visibility re-fetch), add `refresh` to the hook's return-type union rather than creating a separate revalidate helper. Destructure `mutate` from `useSWR(...)` and return it as `refresh`. Initial/Error states get `refresh: null` so callers must narrow.
