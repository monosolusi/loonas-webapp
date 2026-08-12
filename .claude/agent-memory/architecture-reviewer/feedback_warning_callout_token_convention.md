---
name: warning-callout-token-convention
description: The house warning-callout recipe is border-warning-400 + bg-warning-50 + text-warning-500; text-warning-400 as body copy is off-convention and fails WCAG AA
metadata:
  type: feedback
---

When a diff adds a warning/advisory callout box, check the token trio against the established recipe: `border-warning-400 bg-warning-50` on the box, `text-warning-500` on the copy. `text-warning-400` is used in-repo only for **icons** and a **hover** state, never as body text.

**Why:** two reasons, and the second is the one that makes it a real finding rather than a taste call. (a) Consistency — every warning callout in the app already uses the trio: `accounting/periods/_components/allocate-fixed-cost-dialog.tsx`, `close-year-dialog.tsx`, `close-period-dialog.tsx`, `period-advisory.tsx`, and `core/presentations/components/status-chip.tsx`. (b) Contrast — `warning-400` is `#DC6803`, `warning-50` is `#FFFCF5`; that pair is roughly **3.4:1**, under the 4.5:1 AA bar PRODUCT.md commits to for normal-size text. `warning-500` (`#B54708`) on the same background is roughly 5.3:1 and passes. Found on the LNS negative-stock adjustment guard, 2026-08-11.

**How to apply:** flag as a Minor/should-fix with both the convention citation and the contrast number — the contrast figure is what makes it non-negotiable rather than bikeshedding. Compute it rather than asserting it; the palette is in `src/app/globals.css` under `@theme` and diverges from Tailwind defaults (see [[neutral-token-palette]]). Also check the same value's treatment elsewhere: on this diff the negative balance rendered `text-error-400` in `negative-stock-row.tsx` but `text-warning-*` in the dialog, which is a separate register-consistency question worth raising alongside.
