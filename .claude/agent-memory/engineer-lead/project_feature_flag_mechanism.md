---
name: feature-flag-mechanism
description: How feature flags are detected client-side in loonas-webapp — single canonical mechanism via account entity
metadata:
  type: project
---

Feature flags are read from the current account entity via `useGetCurrentAccount()` returning an account that exposes `hasFeature(featureKey: string): boolean`. The `features` array is populated server-side from the Clerk JWT and lives on `BusinessAccountEntity`/`PersonalAccountEntity`.

**Why:** This is the only client-side gating mechanism in the codebase as of 2026-05. There is no separate feature-flag service (LaunchDarkly, Statsig, etc.); the BE owns flag assignment per account and exposes the flat list via the `/me` (current-account) endpoint.

**How to apply:** When asked to gate a route by a feature flag, the pattern is a per-route `layout.tsx` (client component) that calls `useGetCurrentAccount`, returns `null` while `loading`, then `router.replace("/home")` if `!account?.hasFeature(featureKey)`. See `src/app/(authenticated)/internal/kyc/layout.tsx` for the canonical precedent. Same hook is used for inline gating in nav (e.g. `finance-nav-group.tsx`) and for filtering options in the `/settings` dashboard. Never propose a new feature-flag mechanism without first checking this is insufficient.
