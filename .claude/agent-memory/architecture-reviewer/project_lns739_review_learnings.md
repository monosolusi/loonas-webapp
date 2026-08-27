---
name: lns739-review-learnings
description: LNS-739 cash-entries list review — shellState "empty" swallows pageError, and cost-valuation-gaps' onRetry precedent replicates the unguarded-mutate defect
metadata:
  type: project
---

Two defect shapes worth carrying forward from the LNS-739 cash-entries list-page review.

**1. A 4-way `shellState` switch silently swallows `pageError` when the retained page is empty.**
The `cost-valuation-gaps` shape derives `shellState` from `hasData`/`entries.length` and puts the
`pageError` strip *inside* the table component. With `keepPreviousData`, a failed refetch whose
previous result was an empty array lands in `"empty"`, so the error strip — living only in the
`"success"` branch — never renders and the empty copy ("Tidak ada … pada filter ini") asserts a
successful empty result that never happened.
**Why:** the reviewer brief specifically asks "a failed refetch must not silently render stale rows";
the empty-list variant is the blind spot, because nothing looks stale — it looks legitimately empty.
**How to apply:** whenever a diff pairs `keepPreviousData` with a `shellState` switch, check the
empty×error cell of the matrix, not just success×error. The strip must sit above the switch, or the
error branch must outrank `"empty"`.

**2. `cost-valuation-gaps-provider.tsx:105` is the source of the unguarded-retry copy.**
Its `onRetry = () => { hookResult.refresh?.(); }` discards the promise from SWR's bound `mutate()`,
which defaults to `throwOnError: true` — so a retry that fails again is an unhandled rejection, from
a button whose entire purpose is to be pressed after a failure.
**Why:** CLAUDE.md already documents `void refresh().catch(() => {})`, but the precedent every new
list provider is told to mirror does not follow it, so the defect propagates by copy.
**How to apply:** treat this exact three-line `onRetry` as a known-bad template; flag it in new code
even though it matches the cited precedent, and say the precedent is the one to fix, not follow.
Related: [[feedback_revalidate_swr_key_throws_in_catch]], [[feedback_swr_error_stale_data_false_alarm]].
