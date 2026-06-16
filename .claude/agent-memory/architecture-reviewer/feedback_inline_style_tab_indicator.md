---
name: inline-style-tab-indicator
description: Sliding tab indicator implemented via inline style prop + imperative DOM mutation — Rule 13 violation; use CSS custom properties via className instead
metadata:
  type: feedback
---

Engineer used `style={{ left: 0, width: 0 }}` on a `<span>` indicator plus `useEffect` imperatively setting `indicator.style.left` and `indicator.style.width` via DOM refs to animate a sliding tab underline. This is author-written `style` on a DOM element, which violates Rule 13.

**Why:** Rule 13 forbids the `style` prop on JSX elements. Dynamic pixel-value positioning should use CSS custom properties set via className or tracked in useState and applied via Tailwind arbitrary values `left-[var(--x)]`.

**How to apply:** When reviewing animated/positional UI components (tab strips, sliders, progress bars), check if `style` props or imperative `element.style.x =` patterns are used for pixel-offset animation. These are always Rule 13 violations unless the positions come from a third-party positioning library (Floating UI, Popper, etc.).
