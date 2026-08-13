---
name: feedback_derived_index_reset_during_render
description: reset a highlight/selected-index when the underlying list changes via render-time setState, not useEffect, when another effect in the same component consumes that index
metadata:
  type: feedback
---

When a component tracks a `highlight`/`selectedIndex` into a derived list (search results,
filtered rows) AND another `useEffect` in the same component reads that index to act on the
list (e.g. resolving a keyboard commit against "whatever the list settled to"), reset the index
via the React-documented render-time pattern, not a `useEffect`:

```ts
const [settledSignature, setSettledSignature] = useState(signature);
if (signature !== settledSignature) {
  setSettledSignature(signature);
  setHighlight(0);
}
```

**Why:** a `useEffect(() => setHighlight(0), [signature])` schedules the reset for the *next*
render. Any other effect defined later in the same component that fires in the SAME commit
(e.g. because its own dependency — like an async fetch's status — also changed) still reads the
STALE pre-reset `highlight` value, because effects in one commit run against that commit's
closure, and `setHighlight(0)` called from an earlier effect doesn't retroactively update a
later effect's already-captured value. This reintroduces the exact "acts on a stale index" bug
class the reset was meant to prevent. The render-time pattern avoids this: React discards and
re-renders synchronously when `setState` is called during render, so every effect in the
component sees the corrected value by the time it runs. Root-caused and fixed in
`src/app/(pos)/pos/_components/product-picker.tsx` (LNS barcode-scanner fix, no ticket — branch
`feat/pos-barcode-sku-resolve`): the highlight-reset effect (keyed on `visibleRows.length`) and
a new "resolve pending commit against the settled list" effect both fired in the same commit
when an async product-search result landed; only the render-time reset actually closed the race.

**How to apply:** anytime you add a second effect that consumes a `highlight`/`selectedIndex`
piece of state that a *different* effect resets in response to a list changing, check whether
both effects can fire in the same commit. If so, convert the reset to the render-time pattern
above rather than adding ordering assumptions or a ref workaround. Also key the reset signature
on row IDENTITY (e.g. `rows.map(r => r.id).join("|")`), not `rows.length` — two different
same-length result sets must still reset the index, or the old bug resurfaces in a new shape.
