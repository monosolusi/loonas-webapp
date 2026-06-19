---
name: css-hidden-vs-conditional-render
description: Responsive dual-layout branches toggled with CSS hidden/sm:hidden keep BOTH branches mounted — duplicating any singleton-DOM element; use viewport-conditional render instead
metadata:
  type: feedback
---

When a component renders two responsive layout branches (desktop + mobile) and toggles them with CSS `hidden`/`sm:hidden`, BOTH branches stay mounted in the DOM — CSS `hidden` is `display:none`, not unmount. Any element with **singleton DOM semantics** then exists twice: `autoFocus` (→ non-deterministic browser focus), `role="status"`/`aria-live` (→ double screen-reader announce), a unique `id`, or an `aria-labelledby`/`aria-describedby` target.

**How to apply:** When authoring a responsive dual-layout, scan each branch for singleton-semantic attributes. If any branch contains one, use viewport-conditional render — `const [isMobile, setIsMobile] = useState(false)` + a `useEffect` subscribing to `window.matchMedia("(max-width: 639px)")`, then `if (isMobile) return <mobile/>; return <desktop/>;` — so exactly one branch mounts (pattern lives in `date-range-picker.tsx` and `journal-line-row.tsx`). Reserve CSS `hidden`/`sm:hidden` toggling for purely-visual branches with NO singleton-semantic elements. SSR-safe default is `isMobile=false` (desktop first), corrected on mount.

**Why:** LNS-364 — the same CSS-hidden dual-branch pattern in `journal-line-row.tsx` (dual `autoFocus`) and `journal-line-totals-footer.tsx` (dual `aria-live` region) produced two independent fix loops (an architecture-review Major + a QA-caught a11y defect), both resolved by switching to conditional render.

Related: [[feedback_verify_computed_state_consumed]].
