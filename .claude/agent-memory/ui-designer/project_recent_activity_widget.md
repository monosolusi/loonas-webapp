---
name: project-recent-activity-widget
description: Design decisions for LNS-232 DashboardRecentActivity widget — tab anatomy, scoping caption, POS row identity, empty states
metadata:
  type: project
---

LNS-232 replaces DashboardRecentInvoices with a 4-tab unified activity widget (Semua / POS / Faktur Masuk / Faktur Keluar). Spec locked 2026-05-22.

Key decisions:
- Natural expansion (no internal scroll) — matches existing dashboard rhythm; page scroll is the scroll model
- Scoping caption "Sesuai periode dipilih" lives below the tab row, left-aligned, `text-xs text-neutral-300`, only rendered when POS tab is active
- POS row identity: `bg-primary-50` icon badge + `ShoppingCartIcon` (Heroicons outline) instead of arrow icon; no channel chip
- Empty states: text-only, no illustration — matches every other widget in the dashboard
- Tab UI: pill buttons identical to existing DashboardRecentInvoicesFilters pattern (`bg-neutral-800 text-white` active, `bg-neutral-100 text-neutral-400` inactive)
- Column grid changes per tab: POS = [2fr_1fr_auto], incoming/outgoing = [2fr_1fr_1fr], Semua inherits POS grid (most column-rich)

**Why:** matches existing pattern; avoids introducing any new tokens or patterns; POS icon badge is the established channel cue already used in the row mapper

**How to apply:** when extending or modifying this widget, preserve the natural-expansion model and keep the scoping caption as a sub-tab hint, not chrome.
