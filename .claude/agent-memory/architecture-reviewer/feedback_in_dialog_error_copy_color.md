---
name: in-dialog-error-copy-color
description: In-dialog error callout copy is text-error-500 in the accounting siblings; core ConfirmationDialog's text-error-300 warning slot fails AA (3.76:1) and is debt, not a convention to copy
metadata:
  type: feedback
---

For an in-dialog error/warning callout, the house copy color is `text-error-500` (`#B42318`, 6.57:1) — see `reopen-period-dialog.tsx:87` and `cash-entry-cancel-dialog.tsx:71`, both `rounded-lg border border-error-300 bg-error-50 px-4 py-3` + `text-sm text-error-500`. `text-error-300` (`#F04438`) is **3.76:1** on white (≈3.5:1 on `bg-error-300/5`) and fails the 4.5:1 body-text floor.

**Why:** `core/presentations/components/confirmation-dialog.tsx:42` renders its `warning` slot at `text-error-300`, and two feature callouts (`price-tier-error-block`, `draft-action-card`) copy that container — so the failing color *looks* established. It is pre-existing core debt in the same family as the `primary-300` / `text-warning-400` / `text-red-500` entries CLAUDE.md already records; a color used at several call sites is not thereby AA-compliant.

**How to apply:** in a NEW dialog, flag `text-error-300` error copy as a Minor (a11y + sibling divergence) and recommend `text-error-500`; do not flag the `/20` + `/5` container itself — two container shapes coexist (`bg-error-50` in accounting dialogs, `bg-error-300/5` in core primitives) and picking either is not a violation. Note that copy passed into `ConfirmationDialog`'s `warning` prop inherits the failing color from core — fix once in core, not per call site. Related: [[sectioncard-fetch-error-convention]], [[warning-callout-token-convention]].
