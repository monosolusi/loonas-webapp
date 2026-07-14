---
name: feedback_mobile_fixed_px_children
description: Non-Tailwind-scalable children (QRCodeSVG size prop, etc.) need dual-render by breakpoint, not a shrink-to-fit wrapper, when mobile-adapting
metadata:
  type: feedback
---

Some child components take a **pixel-number prop** (not a CSS width) that renders a fixed-size element unaffected by a shrinking parent — e.g. `QrisCard`'s `size` prop passed straight into `<QRCodeSVG size={size} />` (`src/core/presentations/components/qris-card.tsx`). Wrapping it in `max-w-sm`/`w-full` does **not** make it responsive; the parent shrinks but the fixed-px SVG doesn't, and gets clipped by the card's `overflow-hidden`.

**Why:** Found during the POS mobile-adapt pass — `qris-confirm-step.tsx` rendered `<QrisCard .../>` with no `size` override (defaults to 256) inside three nested paddings (page `p-6` + step `px-6` + card's own `p-6` = 144px). At the 320px floor that leaves only 176px for a 256px-wide SVG — real overflow in the core payment flow, not a cosmetic issue.

**How to apply:** When a component takes a fixed-pixel prop and the brief requires "keep desktop identical," don't try to compute one shrunk value for all breakpoints (that regresses desktop). Instead dual-render exactly like the `hidden lg:block` / `lg:hidden` list-row pattern, but pass a *different* pixel size to each copy — e.g.:
```tsx
<div className="hidden sm:block"><QrisCard ... size={256} /></div>
<div className="sm:hidden"><QrisCard ... size={160} /></div>
```
Pick the mobile size by actually summing the padding chain down to the 320px floor, not by guessing. This is a narrower version of [[feedback_css_hidden_vs_conditional_render]] — safe here because neither branch has autoFocus/aria-live/id singleton state, matching that memory's stated exception.
