---
name: swr-error-stale-data-false-alarm
description: When a component newly starts reading a SWR hook's `error`, check the stale-data-plus-error state — SWR keeps `data` on a failed revalidation and `isLoading` stays false, so a "list failed" message renders over a working list
metadata:
  type: feedback
---

When a diff makes a component start reading a SWR hook's `error` (the usual fix for a
silent empty list), always ask: **what does this render when `data` is populated AND
`error` is set?** That state is reachable and common, not exotic.

Verified against SWR v2 source via Context7 (`/vercel/swr`, `src/index/use-swr.ts`):

- On a **revalidation** failure the catch block sets `finalState.error` and **never
  writes `data`**; `setCache` merges via `mergeObjects`, so the last successful `data`
  survives alongside the new `error`. Only the success path clears `error` and replaces
  `data`.
- `isLoading` is `isValidating && data === undefined`. With stale `data` present it stays
  **false** for the whole retry, so any "loading outranks the error" guard never fires.
- Default `revalidateOnFocus: true` means a tab-away + network blip is enough to produce
  it.

Two consequences to flag:

1. A red "Gagal memuat …" message renders over a fully populated, usable control — a
   false alarm, and worse than the silence it replaced.
2. Any in-flight/pending state keyed on `isLoading` never engages during a retry over
   stale data, so a stated double-tap or stale-error defence does not hold.

**Why:** F10 sibling sweep (`fix/wna-option-unavailable-explanation`). Five onboarding
selects were fixed to read `error`, and `resolveSelectFieldState` was given a documented
rung "loading outranks a fetch error" justified by *"`data` is undefined after a
failure"* — true only for a **first-load** failure. The whole design was sound for the
bug it targeted and wrong for the adjacent state.

**How to apply:** the fix is to make list-emptiness an explicit input (`hasOptions`) and
gate the error rung on `!hasOptions`, and to use `isValidating` — not `isLoading` — as the
in-flight signal, which usually means the hook must expose it. If a resolver has a
combinatorial test sweep, check the sweep's **axes**, not just its case count: a missing
axis is invisible in a passing 48-case product. Related: [[revalidate-swr-key-throws-in-catch]].
