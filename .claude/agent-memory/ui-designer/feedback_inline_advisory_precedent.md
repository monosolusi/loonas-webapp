---
name: inline-advisory-table-surface-precedent
description: Dismissible inline panel below a mutated row is the right surface for must-persist compliance notices in tables — not toast (auto-dismisses) or page banner (ambiguous ownership)
metadata:
  type: feedback
---

When a compliance-relevant notice must persist until the user actively acknowledges it, and the notice is scoped to a single row mutation, spec a dismissible inline panel immediately below that row — not a toast and not a page-level banner.

**Why:** toasts auto-dismiss (this project's `TOAST_DURATION` ~4s) — unacceptable for a deadline-carrying advisory; page-level banners lack row ownership and stack ambiguously when several rows are mutated in one session. The inline panel is spatially correct (attached to the row whose state changed) and persists until dismissed. Validated without pushback in LNS-405 (PPh Final advisory shown after a period close returned a 2xx `warnings[]`). Pairs with [[project_periods_page]].

**How to apply:** whenever a row action produces a 2xx response carrying an advisory payload (`warnings[]`, flags, hints) the user must act on later, default to this inline-panel-below-row pattern — wrap the mount point in `role="status" aria-live="polite"`, no auto-dismiss, explicit dismiss control. Reserve toasts for ephemeral confirmations (success/error) that carry no compliance or deadline weight.
