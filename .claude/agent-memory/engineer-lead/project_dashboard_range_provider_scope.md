---
name: dashboard-range-provider-scope
description: DashboardRangeProvider in /home only wraps DashboardRangeSection — picker is non-reactive for widgets outside that subtree; LNS-227 is bundling a hoist as Bug B fix
metadata:
  type: project
---

In `src/app/(authenticated)/home/page.tsx`, `<DashboardRangeProvider>` currently wraps **only `<DashboardRangeSection>`**, not the rest of the page. This is the root cause of LNS-227 Bug B ("Periode terpilih non-reactive for widgets other than the chart"): `DashboardStatistics`, `DashboardCashflowSummary`, and `DashboardRecentInvoices` are siblings of the provider, not descendants, so `useDashboardRange()` is unreachable from them.

**Why:** the provider was originally scoped narrowly because only the 3 widgets inside `DashboardRangeSection` (revenue tile, daily chart, payment breakdown) were intended to be range-driven. The dashboard revamp work in LNS-227 is the trigger to hoist it so additional widgets can opt in.

**How to apply:** When planning anything that wants to consume the dashboard picker, check the provider position in `page.tsx` first. After LNS-227 the provider should wrap the whole page, but consuming a hoisted provider is **opt-in per widget** — only widgets that explicitly call `useDashboardRange()` and pass `{from, to}` to their hook will react. Do not auto-bind every widget.

Related: [[dashboard-feature-shape]] — dashboard is a thin single-repo feature; the provider lives at the page level under `app/(authenticated)/home/_providers/`, not in `features/dashboard/`.
