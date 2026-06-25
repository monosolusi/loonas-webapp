---
name: grid-child-count-walkthrough
description: A conditional element added as a bare direct child of a grid-cols-N container consumes a grid slot and displaces siblings when shown — count direct children in BOTH states; wrap conditional+sibling in a column div
metadata:
  type: feedback
---

When you add a **conditional** element (e.g. an advisory hint `<p>`) directly inside a `grid grid-cols-N` container, it becomes a **direct grid child** and consumes a slot when visible — pushing the following sibling to the next row. The layout looks correct only in the state where the conditional is hidden. Fix: wrap the conditional **plus the input it belongs to** in a single column `<div>`, so the grid always sees exactly N children regardless of the conditional.

**Why:** LNS-117 — the wired `getCodeRangeHint()` advisory `<p>` was a bare child of a `grid-cols-2`, so for the 4 contra-types it displaced the "Tipe" select to row 2. tsc/lint/build all passed; only review caught it (a rendered-structure bug, not a type/lint error).

**How to apply:** Before shipping any conditional element inside a grid, count the container's direct children in BOTH states (shown / hidden). If the conditional adds a direct child, wrap it with its sibling in a column div. Green gates do not catch displacement — walk the structure. Related: [[css-hidden-vs-conditional-render]], and the orchestrator-side visual-validation rule.
