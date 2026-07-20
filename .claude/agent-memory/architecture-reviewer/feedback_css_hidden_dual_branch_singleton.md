---
name: css-hidden-dual-branch-singleton-semantics
description: Responsive dual-layout branches toggled with CSS hidden/sm:hidden keep BOTH mounted — flag ANY singleton-semantic element duplicated across them (autoFocus, aria-live/role=status, unique id, aria-labelledby targets), not just the first instance
metadata:
  type: feedback
---

When a component renders two layout variants (desktop grid + mobile card) and toggles them with `hidden`/`sm:hidden`, CSS `display:none` does NOT unmount — both branches exist in the DOM simultaneously. Every element with **singleton DOM semantics** is therefore duplicated, and each duplication is a real defect:

- `autoFocus` → browser focus is DOM-order-driven, not CSS-visibility-driven → non-deterministic focus across browsers.
- `role="status"`/`aria-live` → two live regions → screen readers announce changes twice.
- A unique `id` → invalid duplicate-id document.
- `aria-labelledby`/`aria-describedby` target → ambiguous/duplicated association.

**How to apply (review discipline):** When you find ONE such duplication in a CSS-hidden dual-branch component, do not stop — enumerate every element rendered in BOTH branches across the whole diff and flag each singleton-semantic one. The correct fixes are viewport-conditional render (`isMobile` matchMedia, so only one branch mounts) or lifting the singleton to a single shared variable consumed by both.

**Why:** LNS-364 — round-1 review caught the dual-`autoFocus` input in `journal-line-row.tsx` but MISSED the structurally-identical dual `aria-live`/`role="status"` region in `journal-line-totals-footer.tsx` (same diff, same pattern). QA caught it in round 2, forcing an avoidable extra fix-loop. The knowledge was present; the "sweep the whole class, not just the first instance" discipline was not.
