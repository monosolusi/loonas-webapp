---
name: dashboard-widget-card-pattern
description: Home dashboard widgets — SectionCard for list-style cards (no icon, use bare title), DashboardStatistics-style custom <div> for compact metric cards; SectionCard.iconSrc only accepts string file paths so Heroicons cannot decorate the header without a local card shell
metadata:
  type: project
---

`SectionCard` (`src/core/presentations/components/section-card.tsx`) renders `iconSrc` via Next.js `<Image>` and only accepts a string URL — Heroicon React components can NOT be passed as the card icon.

Two dashboard card patterns in use (as of 2026-05-22):
- **List-style widgets** (`dashboard-recent-invoices`, `dashboard-range-pos-sales-tile`) use `<SectionCard title="..." bodyClassName="p-0">` with NO `iconSrc`. Title text alone, optional `headerAction` slot.
- **Compact metric widgets** (`dashboard-statistics`) skip `SectionCard` entirely and render a custom `<div>` with `rounded-xl border border-t border-r border-b-4 border-l bg-neutral-50 p-5` — letting them embed an icon node freely in the layout.

**Why:** Brightpos-inspired widgets (LNS-230) want Heroicon decorators (UsersIcon, Squares2X2Icon, ExclamationTriangleIcon, ShoppingBagIcon) on cards. Extending `SectionCard.iconSrc` to accept `ReactNode` would touch LNS-227 scope. Mirror the local pattern instead.

**How to apply:** For LNS-230-style point-in-time metric cards (W1, W2), copy the `DashboardStatistics` custom-div shape and inject the Heroicon inline at top-left of the card header. For list-style cards (W3, W4), use `SectionCard` with no icon and put a small icon-prefixed title node into the `headerAction` slot, OR render an icon row inside the body header band — never bypass `SectionCard` for list cards (it owns the border/header rhythm).
