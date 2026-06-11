---
name: authenticated-chrome-clipping
description: Authenticated layout has 3-level overflow clipping that crops any inline popover; use Headless UI v2 `anchor` to portal+flip
metadata:
  type: project
---

The authenticated layout (`src/app/(authenticated)/layout.tsx`) creates a fixed-height shell with three overflow-clipping ancestors stacked vertically:

1. Outer flex shell: `h-screen flex-row overflow-hidden`
2. Main column: `flex-1 flex-col overflow-hidden`
3. Content scroll surface: `flex-1 overflow-y-auto p-8` (children render here)

**Why:** All three are load-bearing — the chrome relies on this stack for sidebar/header pinning + a single inner scroll surface. Removing any breaks layout.

**How to apply:** Any `<PopoverPanel>` / floating element rendered *inline* inside the content surface will be clipped if its bounding box extends past the scroll container's visible area. Symptom seen in LNS-230 dashboard: date range picker dropdown bottom edge cropped against the layout's scroll container.

**Canonical fix on Headless UI 2.2.6**: use `anchor={{ to: "bottom end", gap: 8 }}` on `<PopoverPanel>` (and `<MenuItems>`, etc.). This single prop:
- portals the panel to document root (escapes all ancestor overflow/transform/contain boundaries)
- uses Floating UI for viewport-aware positioning with auto-flip + shift
- replaces manual `absolute right-0 mt-2` positioning

Manual `<Portal>` wrap is a worse alternative — it portals but loses the trigger anchor, forcing manual rect math.

Related: [[authenticated-chrome-widths]] for the same chrome's width constraints.
