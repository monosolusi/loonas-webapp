---
name: table-row-nested-interactive
description: Table rows with both expand-toggle and ActionMenu must use outer div grid, not a button wrapping both
metadata:
  type: feedback
---

When a table row needs both a whole-row expand/collapse toggle AND an `ActionMenu`, structure it as:

1. Outer element: `<div>` with grid layout (e.g., `grid grid-cols-[1.5fr_3fr_1fr_1fr_auto]`)
2. Inner element: `<button>` spanning data columns (e.g., `col-span-4`) — handles expand/collapse click
3. `<ActionMenu>` as a sibling in the last grid column (e.g., `col-span-1` or `auto`) — NOT inside the `<button>`

The `ActionMenu`'s `MenuButton` must call `e.preventDefault()` to stop event propagation and prevent triggering the expand toggle.

**Why:** Browsers disallow nested interactive elements (`<button>` inside `<button>` is invalid HTML). An `ActionMenu` (which renders a button) nested inside a `<button>` expand toggle causes invalid DOM structure and broken interaction. EL flagged this in LNS-372 review.

**How to apply:** Any time a table row has a click-to-expand behavior AND action menu items, use the outer-div + sibling pattern, never wrap both in a single button.
