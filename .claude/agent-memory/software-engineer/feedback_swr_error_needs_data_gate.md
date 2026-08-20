---
name: feedback-swr-error-needs-data-gate
description: Newly reading a SWR hook's error is not enough — gate it on the data being unusable, because SWR keeps data on a failed revalidation and isValidating is true for background refreshes too
metadata:
  type: feedback
---

When a component starts consuming a SWR hook's `error` (or `isValidating`) for the first time,
gate BOTH on whether the data is currently usable. Neither flag means what it looks like:

- **`error` survives alongside `data`.** SWR's catch never writes `data`, so after a failed
  *revalidation* you have a populated list AND a set `error`, and `isLoading`
  (`isValidating && data === undefined`) stays **false**. Keying a "failed to load" message off
  `error` alone therefore paints a red failure plus a retry link over a control that works
  perfectly — a false alarm, and worst on flaky mobile networks where background refreshes fail
  routinely.
- **`isValidating` is true for ANY in-flight request**, including `revalidateOnFocus` /
  `revalidateOnReconnect` background refreshes (confirmed in SWR docs). Swapping `isLoading` →
  `isValidating` to fix a pending state will disable a populated field every time the user
  refocuses the window.

**The shape that works:** collapse `data` into one tri-state — `unresolved` (`data === undefined`)
/ `empty` (resolved, length 0) / `populated` — and branch on it FIRST. `populated` short-circuits
to the caller's own copy regardless of `error`/`validating`; only once the list is unusable do the
`validating` and `error` rungs apply. Two bonuses: `unresolved` read as *loading* rather than
*empty* removes any first-render flash of an "empty" message without depending on whether
`isValidating` is true on the first render; and the tri-state makes "populated but never resolved"
unrepresentable, unlike `hasOptions` + `resolved` booleans.

Also: a bound `mutate()` used as a retry defaults to `throwOnError: true`, so wiring it straight
to an `onClick` yields an unhandled rejection when the retry also fails. Swallow deliberately and
log the RAW error object (`JSON.stringify` on a native Error gives `{}`).

**Why:** the QA F10 build's select-field work (2026-08-17). Reading `error` was the whole point of
the fix, and doing it naively introduced a *new* defect on a KYC path that architecture review
caught. Derived from `data`, not from a mapped `options` array — the memo returns `[]` for both
unresolved and empty, which is exactly the distinction that matters.

**How to apply:** any time a diff newly reads `error`/`isValidating`, or adds a retry affordance,
over a SWR hook. Trace the populated-plus-error state explicitly; it is not reachable by the
node-env vitest suite, so it must be reasoned about rather than tested through the component.
See [[feedback-disabled-state-needs-visible-reason]].
