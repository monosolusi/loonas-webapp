---
name: inline-style-grid-columns
description: Engineers use inline style prop for CSS grid-template-columns; Rule 13 violation — use CSS custom prop + Tailwind arbitrary class instead
metadata:
  type: feedback
---

Engineers frequently reach for `style={{ gridTemplateColumns: "..." }}` when building data tables with custom column widths. This is a Rule 13 violation — all styling must go through Tailwind utility classes, not the `style` prop.

**Why:** Rule 13 forbids author-written `style` props on DOM elements. Found in LNS-347 profitability table (`profitability-table.tsx:67` and `profitability-table-row.tsx:50`).

**How to apply:** Flag whenever a `style={{ gridTemplateColumns: ... }}` appears on a `<div>` or table element. The fix is: define a CSS custom property in `globals.css` and consume via Tailwind arbitrary-value syntax, e.g. `className="grid [grid-template-columns:var(--grid-name)]"` or Tailwind 4 shorthand `grid-cols-(--grid-name)`. Note that when two sibling components must share the same column widths (header row + data row), a single CSS variable shared between them is the correct pattern.

Related: [[inline-style-tab-indicator]]
