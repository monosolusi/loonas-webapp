# Analytics

## Purpose

Thin instrumentation layer for tracking user interactions in the dashboard. Provides a type-safe `track()` function backed by a discriminated union of known events.

## Status

**LNS-239**: No-op shim. The `track()` body fires nothing — all events are defined and call sites are wired, but no vendor SDK is called yet.

**LNS-247**: Will replace the no-op body with a real vendor dispatch (e.g. PostHog, Segment). The public API (`track(name, properties)`) will remain identical — only the body of `src/core/analytics/track.ts` changes.

## Public API

```ts
import { track } from "@/core/analytics";

track("recent_activity_tab_switched", { from_tab: "all", to_tab: "pos" });
```

`track<N extends AnalyticsEventName>(name: N, properties: AnalyticsEventProperties<N>): void`

TypeScript enforces that `properties` matches the shape declared for `name`. Passing an unknown event name or wrong property shape is a compile-time error.

## Adding a new event

1. Add a new variant to the `AnalyticsEvent` union in `src/core/analytics/events.ts`:
   ```ts
   | { name: "my_new_event"; properties: { foo: string; bar: number } }
   ```
2. Call `track("my_new_event", { foo: "x", bar: 1 })` at the call site.
3. TypeScript enforces correctness — no runtime registration needed.

## Naming convention

- `snake_case` throughout.
- Surface-scoped prefix: `recent_activity_*`, `checkout_*`, etc. This groups events by feature in analytics dashboards.

## PII rule

**Do not pass PII to `track()`.** Allowed: IDs, enums, route templates, ISO date strings (`YYYY-MM-DD`), counts, numbers. Not allowed: names, email addresses, phone numbers, free-form text entered by users. A full PII allow-list and data governance policy will land with LNS-247.

## SSR safety

`track()` is a no-op when `typeof window === "undefined"`. Safe to import in any client component without SSR guard.

## Error handling

`track()` wraps its body in `try/catch`. In non-production environments, failures are surfaced via `console.warn("[analytics] track() failed", ...)`. In production, errors are silently swallowed — instrumentation must never break the app.

## Tests

No test framework is configured in this repository (see root `CLAUDE.md`). The analytics shim is verified via `npx tsc --noEmit` (type correctness) and `npm run lint`.

## LNS-247 swap-in point

Replace the body of the `try` block in `src/core/analytics/track.ts`:

```ts
// Replace these two void lines:
void name;
void properties;

// With vendor dispatch, e.g.:
posthog.capture(name, properties);
```

No call-site changes are required.
