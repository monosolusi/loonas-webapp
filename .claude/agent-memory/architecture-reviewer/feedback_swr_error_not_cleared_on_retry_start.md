---
name: swr-error-not-cleared-on-retry-start
description: When a hook's error type widens from literal null to ServerError|null, sweep consumers for `error === null` used as a loading/success gate — SWR does not clear error when a same-key retry starts, so the gate goes falsely-false mid-retry
metadata:
  type: feedback
---

When a `LoadedState.error` field is widened from a hardcoded `null` literal to
`ServerError | null` (the LNS-761 shape, see [[swr-error-stale-data-false-alarm]]), grep
every consumer for a narrowing that treats `error === null` as a proxy for "nothing is
wrong, trust the other happy-path fields" — it usually predates the widening and was
harmless only because the field could never be non-null before.

Confirmed via Context7 (`/vercel/swr-site`, advanced/performance.mdx lifecycle log):

```
undefined Error false false    // => end fetching, got an error
undefined Error true true      // => start retrying
Data      undefined false false // => end retrying, got the data
```

**`error` stays non-null the instant a retry/revalidation starts** (`isValidating` flips
to `true` first) — it is only cleared when the new attempt *settles* successfully. This is
the mirror image of [[swr-error-stale-data-false-alarm]] (which is about a *completed*
failed revalidation next to stale `data`); this one is about the *in-flight* window right
after `mutate()`/`refresh()` is called on a key that already has an error.

Found in LNS-761 review: `buku-besar-provider.tsx:116-118` computed
`isLoadingPage = loading===false && error===null ? hookResult.isLoadingPage : false`.
Pre-fix this was harmless (`LoadedState.error` was always the literal `null`, so the guard
was always true whenever `loading===false` in that branch). Post-fix, calling `onRetry()`
against a page that already errored keeps `error` non-null through the retry's `isValidating:
true` window, so the ternary now falls to `false` — suppressing the loading indicator
during the exact retry the hook fix was meant to enable. TS narrowing itself was NOT wrong
(it still narrows precisely to `LoadedState`); the defect is purely in treating
`error === null` as a stand-in for "not currently validating."

**Severity judgment**: flag it, but check reachability before calling it a blocker — here
`isLoadingPage` from `useBukuBesarProvider()` had zero consumers (grep confirmed; the
sibling `cost-valuation-gaps` provider's `isLoadingPage` IS wired into
`cost-valuation-gaps-table.tsx`'s `aria-busy`, so the two providers are not equivalent).
Report as Minor/non-blocking with the reachability evidence, not as a blocker, when the
tainted value is unconsumed — but still name it, since wiring it up later is one line away
and would ship silently broken.

**How to apply:** the correct fix is almost always to stop deriving from `error === null`
and read the union member's own boolean field directly — here, `hookResult.isLoadingPage`
alone is correctly typed `boolean` across all three states (`false` on Initial/Error,
`isValidating` on Loaded) with no guard needed at all.
