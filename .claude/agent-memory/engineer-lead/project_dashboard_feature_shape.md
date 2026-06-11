---
name: dashboard-feature-shape
description: Existing /home dashboard feature wiring as of 2026-05-21 — single repo, getStatistics(session)-only signature, no range params yet; LNS-193 extended it
metadata:
  type: project
---

`src/features/dashboard/` is a thin feature: one entity (`DashboardStatisticsEntity`), one model, one repo (`DashboardRepository.getStatistics(session)`), one use case, one SWR hook. No SWR-keys constants file existed pre-LNS-193 — accounting/fixed-cost/inventory have them; dashboard did not.

**Why:** Single caller (`/home`) historically passed no params; the hook signature was zero-arg.

**How to apply:** When extending dashboard endpoints, expect to introduce both `presentations/constants/swr-keys.ts` AND the range/param-aware hook signature in one go. The single existing caller (`home/_components/dashboard-statistics.tsx`) is the only thing that breaks. Also the existing entity/model don't follow the `public readonly` rule consistently — fix the drift while touching them.

The home page itself (`/home/page.tsx`) is composition-only: `DashboardWelcomeHeader`, `DashboardStatistics`, `DashboardRecentInvoices`, `DashboardCashflowSummary`. No `_providers/` folder pre-existed — LNS-193 introduces the page-provider pattern here.
