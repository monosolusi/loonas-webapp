---
name: qa-patterns
description: Recurring build warnings, CI ticket scope rules, build perf baseline, JSON validity gate, and Playwright session patterns
metadata:
  type: project
---

## Build / Static Check Patterns

- `next lint` emits deprecation warning about `next lint` being removed in Next.js 16 — this is a WARNING not a failure, exit 0. Do not flag as fail.
- `src/app/layout.tsx:29:11` — Warning: Custom fonts not added in `pages/_document.js` — pre-existing, not a regression.
- Typecheck passes cleanly on a clean codebase; slow on first run (~20-30s).

## Playwright Session Patterns

- The dev environment uses Clerk with a dev instance — a fresh headless Playwright context can load the authenticated page on FIRST navigation only, likely due to existing Clerk dev cookies on the machine.
- Playwright context does NOT persist Clerk session cookies across `.reload()` or `page.goto()` to different URLs. After any reload, the browser redirects to `/sign-in`.
- **Pattern**: run all tests sequentially in a single `page.goto()` flow without reload. Use `router.replace` URL-param navigation (which does not trigger full reload and preserves session) instead of `page.goto(NEW_URL)` for range changes.
- For AC4 (festival URL) and AC8 (invalid range): navigate via `page.goto()` only at the start of the session. Subsequent param changes should use `page.evaluate(() => window.history.replaceState(...))` or picker interaction.

## Backend Dev Environment

- Backend API runs on `localhost:14000`. It is frequently NOT running during headless QA sessions.
- When backend is down: all three festival widgets show `Gagal memuat` + `Coba lagi` error state (correct behavior).
- The existing `DashboardRecentInvoices` widget shows "Gagal memuat data faktur." (no retry button — existing pre-festival behavior).
- Do NOT fail AC1 "three widgets render" if backend is down — the error state IS the correct render. The section structure, widget titles, and error chips are all verifiable regardless.

## SWR Key Isolation (Dashboard) — post LNS-193 round 2

- `DASHBOARD_STATISTICS` — single key used as the first element of a tuple `[DASHBOARD_STATISTICS, from, to]` for both the range widgets AND the existing `DashboardStatistics` widget (no `from`/`to` → `[DASHBOARD_STATISTICS, undefined, undefined]`). The dual-key pattern (`DASHBOARD_STATISTICS_RANGE`) was collapsed in round 2.
- `DASHBOARD_REVENUE_SERIES` — retained as its own key, still used by `DashboardRangeRevenueTile` + `DashboardRangeDailyRevenueChartImpl` (with `from`/`to`).
- Tile and chart share the same SWR key — "Coba lagi" on either refetches both. This is intentional (comment in swr-keys.ts).

## localStorage Migration Pattern (LNS-193 round 2)

- `lns_festival_date_range` → `lns_dashboard_range` migration runs in `useState()` initializer of `DashboardRangeProvider`.
- Due to Next.js App Router hydration timing, the migration can fire while the URL is still `/sign-in` (provider JS bundle executes before Clerk middleware redirect completes client-side). This is NOT a bug — migration result is correct.
- Migration is idempotent: runs only when legacy key exists AND new key is absent. Verified via CDP headless run.
- CDP-based localStorage verification is reliable on this project (Chrome stays on `localhost:3000` origin throughout, even after Clerk redirect to `/sign-in`).

## AC5 Error Count Expectation (when backend down)

- Total `text=Gagal memuat` matches: 4 (3 festival + 1 existing invoice widget substring match)
- Total `text=Coba lagi`: 3 (all 3 festival widgets; existing widgets have no retry button)

## sr-only Chart Table

- The sr-only accessibility table in `festival-daily-revenue-chart-impl.tsx` only renders when data is present (no error state). When backend is down, the chart shows error — no sr-only is rendered. This is correct and should not be failed.

## AC3 localStorage Behavior (pre-round-2 note — key renamed)

- `lns_dashboard_range` (new key; old: `lns_festival_date_range`) is written either by migration on first load (if legacy key exists) or by explicit `setRange()` call. On a fresh profile with no prior interaction and no legacy key, the new key is also absent until user changes range. Test must pre-seed or trigger a range change before checking.

## Mobile Picker Button Order

- In the section, button order is: [picker button (index 0), Coba lagi (x3 if error state)].
- For mobile Dialog test: target `mobileSectionButtons[0]` or filter by date text, not `.last()`.

## Build Performance Baseline

- `npm run build` — typical production build ~2-3 min on this machine.
- `npx tsc --noEmit` — ~20-30s.
- `npm run lint` — ~15s.
