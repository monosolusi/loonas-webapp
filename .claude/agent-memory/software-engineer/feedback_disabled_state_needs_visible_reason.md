---
name: feedback-disabled-state-needs-visible-reason
description: A wrapper-level opacity-50 dims the very copy that explains a disabled state; recession must come from color, and inert-without-a-reason should be made unrepresentable via a discriminated union
metadata:
  type: feedback
---

When fixing "a control looks available but is inert with nothing explaining why", two things
recur and neither is obvious from reading the component:

1. **A wrapper-level `opacity-50` is the defect, not the styling.** It also dims the `error` /
   `description` lines — which on a disabled field are exactly what explain WHY it is disabled.
   On this app's white panes: `text-neutral-200` (#BDBDBD) at 50% ≈ **1.35:1**;
   `text-neutral-300` (#323636, 11.9:1) collapses to **~2.8:1**; even `text-neutral-500` only
   reaches ~3.6:1. No token survives it. Apply the fade to the label and the bordered field row
   only, never the wrapper, and get recession from **color**.
2. **`bg-neutral-50` as a "disabled fill" is a no-op** — it is `#FFFFFF` in this project
   (see [[feedback-neutral-token-palette]] / CLAUDE.md), identical to the page, which is how
   `opacity-50` ends up doing 100% of the disabled signalling. `bg-neutral-100/25` (≈#F5F6F6) is
   the visible-but-calm fill; it also matches the icon tile's existing `bg-[#F5F5F5]`, so a card
   reads as one inert slab. Do **not** reach for `border-dashed` — `Dropzone` owns that in this
   vocabulary and it reads "drop a file here".
3. **Model the inert reason as a discriminated union, not a `disabled` boolean + optional copy.**
   `{ selectable: true } | { selectable: false; reason: string }` (nationality options) and
   `{ hasParent: false } | { hasParent: true; parentChosen: boolean; parentHintCopy: string }`
   (select-field state) both make "inert with no explanation" a **type error** rather than
   something a test has to catch. Pass the union down as one prop; splitting it back into two
   props at the component boundary reintroduces the bad state.

**Why:** LNS QA F10 plus the folded-in five-select fix (2026-08-17). Every instance of this
family shipped looking correct in review because the markup contained the right copy — the
opacity made it invisible at runtime, which no type or lint check can see.

**How to apply:** any time you add explanatory copy to a disabled/blocked control, check what
opacity the copy is inheriting from an ancestor before you consider it shipped. When the copy is
conditional on a state, ask whether that state can be a union that forbids the empty case. Pair
with [[feedback-inline-validation-hints-required]] — a disabled control is never the whole fix.
