---
name: analytics-module-lns239
description: src/core/analytics/ is a typed no-op shim landed in LNS-239; vendor wiring deferred to LNS-247
metadata:
  type: project
---

`src/core/analytics/` ships in LNS-239 as a typed, no-op telemetry shim. Shape:
- `track.ts` — SSR-safe, try/catch-wrapped, dev-only console.warn on caught errors, currently empty vendor dispatch
- `events.ts` — discriminated union by `name` literal; `AnalyticsEvent` is the sole input type to `track()`
- `index.ts` — barrel
- `README.md` — event catalogue, PII allow-list, refactor rule, scope deferral note

**Why:** Decouple instrumentation call sites from vendor choice so PostHog (LNS-247) can land without touching call sites. PII allow-list (not deny-list) is the safety belt — adding a property requires PM sign-off.

**How to apply:**
- LNS-239 wires 4 events into `dashboard-recent-activity.tsx` only. Any additional call site needs a new event variant in the union.
- LNS-247 will fill in `track()` body with the vendor dispatch; no call-site change.
- Tab-string alignment: registry uses widget's existing `'all'`, NOT PRD's `'combined'`. Documented in README so PostHog dashboards are built against `'all'`.
- `destination` field on `row_clicked` is a ROUTE TEMPLATE with `:id`, not a resolved URL. Easy to ship wrong; protect via const map.
