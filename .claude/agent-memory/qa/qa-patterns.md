---
name: qa-patterns
description: Recurring build warnings, CI ticket scope rules, build perf baseline, JSON validity gate, Playwright session/backend patterns, SWR key isolation, LNS-384 JWT tenant resolution, LNS-364 journal-line-editor patterns, LNS-377 sibling-defect check, severity calibration, AC grading discipline, git stash -u baseline isolation, Tailwind v4 CDN static-preview technique, Headless UI Menu anchor/portal/flip behavior, Playwright chromium cache-mismatch fix
metadata:
  type: project
---

## Defect Inspection Discipline (LNS-377)

- **Sibling-defect check (N-of-N rule):** When a defect pattern is found in one component, immediately read/grep ALL structurally-identical siblings (e.g. twin dialogs, parallel hooks) for the same pattern before closing the finding. Do NOT report after checking N-of-1. Example: catching stale-closure in ClosePeriodDialog but missing the identical latent defect in ReopenPeriodDialog.
- **Severity calibration:** Severity = actual user impact on the operation's design intent, NOT "does it crash / does it block a numbered AC". Lost input on a mutation retry path (especially audit-trail fields like 'reason') is a real UX regression even if no AC names it. A user who hits 422 and loses their typed justification must retype before retrying a lock-the-books action — that defeats retry-without-re-entry intent.
- **AC grading discipline:** Grade against the ACs as finalized at handoff time. If a stricter reading is possible, write "PASS — note: stricter reading would require X; confirm with EL" rather than PARTIAL. Reserve PARTIAL only for confirmed spec ambiguity, not self-imposed tighter criteria. (LNS-377: AC-6 collapsed two 409 codes to one message — finalized AC only required one close + one reopen message; it was a PASS.)
- **First-element-derived label check (LNS-407):** When a UI label/value is derived from the FIRST element of a collection (`firstWarning.details.tenantRegime`, `warnings[0].x`, `items[0].label`) yet rendered as if it represents the whole set, verify the multi-element edge: if entries 2..N can differ on that field, the displayed value silently misrepresents them. Confirm against the data contract whether the field is set-uniform (tenant-level, single-enum) — if it is, note the dependency explicitly; if it isn't, flag to EL as a data-shape-dependent defect. (LNS-407: `regimeLabel` derived from `firstWarning` was safe ONLY because `tenant_regime` is tenant-level + single-valued `pph_final_umkm` in v1 — a contract-bounded safety, not a structural one.)

## Build / Static Check Patterns

- `next lint` emits deprecation warning about `next lint` being removed in Next.js 16 — this is a WARNING not a failure, exit 0. Do not flag as fail.
- `src/app/layout.tsx:29:11` — Warning: Custom fonts not added in `pages/_document.js` — pre-existing, not a regression.
- Typecheck passes cleanly on a clean codebase; slow on first run (~20-30s).
- **Pre-existing `lightningcss.darwin-x64.node` build failure (as of LNS-355, 2026-06-25):** `npm run build` fails with `Error: Cannot find module '../lightningcss.darwin-x64.node'` — the native binary is missing from `node_modules/lightningcss/node/`. This is a LOCAL environment-only failure (missing native module), not a code regression. Baseline confirmed via `git stash -u` — same error on `dev` branch before LNS-355 changes. CI will pass if the CI runner has correct `node_modules` installed. Do NOT flag this as a branch regression; note as pre-existing environment issue.
- **Build-failure SYMPTOM has drifted (as of LNS-411, 2026-06-25):** on this run `npm run build` got past CSS processing and failed later, during static prerender, with `@clerk/clerk-react: Missing publishableKey` (digest `431561261`) on `/invoices/outgoing` and `/settings/raw-materials` — a DIFFERENT symptom than the earlier `lightningcss` missing-module failure. Note: `.env` does carry `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` for the dev server/runtime, but the production `next build` prerender step does not pick it up in this local env, so it still fails. Still pre-existing — baseline-confirmed via `git stash -u` (identical failure on untouched `dev`), touches only unrelated pages, CI has the key. Takeaway: the build-failure symptom may change between runs; the symptom-agnostic baseline-stash rule (below) is what proves "pre-existing," not matching a specific error string.

## QA Run Structure (avoid stalls — LNS-371 2026-06-24)

- A QA run STALLED once (watchdog-killed after 600s, zero progress) when it tried to boot the dev server / run `build` up front without a time-box and without emitting interim output. Structure runs to avoid this:
  - Run STATIC GATES first (`tsc` → `lint` → `build`), reporting each result before starting the next.
  - Time-box long commands: if `npm run build` (or dev-server boot) hasn't finished in ~3 min, kill it, note "not completed," and continue — never wait indefinitely.
  - SOURCE-LEVEL acceptance verification is the core deliverable and must complete even if the browser is unreachable.
  - Browser smoke is LAST and OPTIONAL — given the Clerk auth + seeded-state env gap, fall back to source-level when sign-in/seeded state can't be reached headlessly; don't block the whole run on a dev server that won't come up.

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

## Baseline Build Isolation (LNS-377)

- **Use `git stash -u`, NOT plain `git stash`, to isolate a baseline build.** Plain `git stash` does not stash untracked new files. When a feature introduces new files (e.g. all `periods/` components as untracked), plain stash leaves them in place — their imports (e.g. `ACCOUNTING_SWR_KEYS.LIST_ACCOUNTING_PERIODS`) reference constants not yet in the stashed version of shared files, producing false build failures. `git stash -u` cleans the full tree.
- After stash, verify with `git status` that untracked files are gone before running the baseline build. Restore with `git stash pop` immediately after.
- If baseline build fails too, the build failure pre-exists on `dev` and is NOT introduced by the branch under review — report as "pre-existing, not a regression."

## Build Performance Baseline

- `npm run build` — typical production build ~2-3 min on this machine.
- `npx tsc --noEmit` — ~20-30s.
- `npm run lint` — ~15s.

## Clerk Environment Gotcha (LNS-197, 2026-05-21; updated LNS-387 2026-06-14; updated LNS-377 2026-06-25)

- **SUPERSEDED (LNS-457/LNS-459, 2026-07-17; re-verified 2026-07-19): NO `.env` OR `.env.local` file exists in this repo (`loonas-webapp-2`) at all — confirmed via `ls -la .env*` → "no matches found".** Assume keyless Clerk from the start; do not attempt route-mocking, and expect the production `next build` prerender step to fail on `Missing publishableKey`. (Historical, now stale for this repo: LNS-387 2026-06-14 recorded `.env` containing `CLERK_SECRET_KEY` + `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY` — that reflected the sibling `loonas-webapp` checkout, not `loonas-webapp-2`.)
- Server boots. Auth-gated routes may return 200 for unauthenticated hits (Clerk redirects to sign-in), but kyc-summary requires a real authenticated session WITH a specific account state (e.g., REJECTED outcome) — not achievable in headless QA without a seeded account.
- **Mitigation for state-dependent routes** (e.g., KYC REJECTED branch): source-code static analysis is the only viable path. Note "manual browser smoke required" in reports for these routes.
- **Feature-gate redirects:** Routes guarded by `account.hasFeature(X)` (e.g. `PeriodsLayout` → `/home` when account lacks `accounting` feature) are environmental limitations, NOT implementation failures. Name the gate mechanism and source file explicitly in the report (e.g. "redirected by `layout.tsx:13 account.hasFeature('accounting')`") so EL knows it is working-as-intended, not a crash or missing route.
- **Playwright note**: `playwright` package is NOT in the project's `node_modules`. It is only available globally via `npx` cache at `~/.npm/_npx/`. Use the cache entry whose `package.json` version matches the `chromium-1228` browser in `~/Library/Caches/ms-playwright/` — confirmed working: `~/.npm/_npx/e41f203b7505f1fb/node_modules/playwright` (v1.61.1) as of 2026-06-25.
- **Managerial-cost allocation panel (`/finance/periods`) is structurally un-seedable headlessly (LNS-411, 2026-06-25):** the inline panel only renders for a CLOSED period that has managerial-cost projections — this state needs a live authenticated Clerk session AND seeded closed-period + allocation data, none of which is reachable in headless QA. On any QA run touching this panel, plan SOURCE-LEVEL verification from the start (trace entity → model → repo → use case → hook → panel → cell) rather than discovering the gap at dev-server-boot time, and flag any data-shape-dependent AC — e.g. AC-5 "≥2 variants visually distinguishable" — as a manual staging smoke item. Distinguishability/identity-cell rendering is deterministic-by-construction (rows keyed `variantId + "-" + index`, each reads its own identity), so source-level confirmation meets the bar; the staging smoke is a visual-confirm follow-up, not a blocker.
- **PPh-Final post-close advisory (`period-advisory.tsx` on `/finance/periods`) is structurally un-seedable headlessly (LNS-407, 2026-06-26):** the advisory renders only after a period close whose BE 200 response carries `warnings[]` with a `PPH_FINAL_NOT_POSTED` entry (`period_dpp` / `tenant_regime` details) — this needs a live authenticated Clerk session AND a closed accounting period in the PPh-Final regime, neither reachable in headless QA. Plan SOURCE-LEVEL verification from the start (trace model conversion → entity → component render in BOTH the single-warning prose and multi-`<ul>` shapes) and flag the live rupiah figure + both-shape render as a manual staging smoke item. Conversion correctness (sen→rupiah `Math.round(period_dpp / 100)` at the model parse boundary) and the omit-on-0 / omit-on-unknown-regime guards are deterministic-by-construction, so source-level confirmation meets the bar; the staging smoke is a visual-confirm follow-up, not a blocker.

## POS Source Code Structure (LNS-197)

- `peek-strip.tsx` — `fixed inset-x-0 bottom-0 z-30 h-16 lg:hidden`. Bayar hidden when `inWizard === true` (matches CartSummary desktop pattern).
- `cart-drawer.tsx` — `Transition` from `@headlessui/react`. `fixed inset-x-0 bottom-16 z-20 h-[60vh] lg:hidden`. Slides up with `translate-y` transition.
- `cart-softcap.ts` — `CART_SOFTCAP_THRESHOLD = 30`, warning shown on PeekStrip AND CartPanel header. CartDrawer does NOT have its own softcap header — it delegates to CartSummary via `showCta={false}`, which only shows hasCartWarnings warning (not softcap). The softcap chip appears in PeekStrip (mobile) and CartPanel header (desktop).
- `CartPanel` — `hidden ... lg:flex` — hidden at `< lg`, visible at `lg+`. 
- `ActionMenu` — `MenuButton` is `size-11` (44px) hit area with `size-4` icon visually. This is the project-wide change.
- `Chip size="compact"` — outer `div h-11` (44px tap-target) wrapping a `button h-9` (visual). AC-2 compliant.
- `ProductListRow` — `line-clamp-2` on product name span. Row uses `min-h-11` (adaptive height). AC-1 compliant.
- `CartItemRow` — `line-clamp-2` on `displayName` span. Wrapped in `React.memo`.
- `PosProvider` split: `PosCartContext` + `PosUIContext`. `usePos()` preserved as deprecated alias returning `useMemo(() => ({ ...cart, ...ui }), [cart, ui])`.
- `isCheckingOut` added to disabled gate in both `CartSummary` and `PeekStrip` — double-tap protection confirmed.
- `CartDrawer` soft-cap coverage gap: brief says "soft-cap chip on peek strip + drawer header" but CartDrawer has NO softcap chip in its header. CartPanel (desktop) does. This is a minor AC-5 gap on tablet. Severity P2 (non-blocking, warning still appears in PeekStrip).

## Clerk Secret Key + Sign-in 500 (LNS-221, 2026-05-21)

- Clerk middleware runs on ALL routes including `/sign-in` (unauthenticated). Without `CLERK_SECRET_KEY` in `.env.local`, the edge middleware throws on every request — including `/sign-in` — returning HTTP 500.
- This is distinct from prior tickets where only authenticated routes 500'd. The sign-in page itself is now also 500'd.
- Browser smoke testing of sign-in UX changes is **fully blocked** without `.env.local` + `CLERK_SECRET_KEY`. Source-code static analysis is the only viable path.
- When verifying sign-in changes: use static analysis to confirm (1) COPY map strings, (2) `role="alert"` + `aria-live="polite"` attributes, (3) `setSignInError(null)` in wrapped setters, (4) `setIsLoggingIn(false)` in all catch/early-return paths, (5) no `throw` in catch (only the `VALIDATION_FAILED` pre-validation throw).

## LNS-227 Dashboard Revamp Structure (2026-05-22)

- `DashboardRangeProvider` wraps entire page including point-in-time widgets — they render as children of the provider but do NOT consume `useDashboardRange()`. Provider context is read-only by the 5 range-scoped widgets + `DashboardRangeSection` picker.
- `DashboardStatistics` and `DashboardRecentInvoices` sit OUTSIDE the `bg-primary-50 section` tag but INSIDE `<DashboardRangeProvider>` — AC4 is structurally correct (not a DOM mistake).
- `DashboardCashflowSummary` is a re-export barrel: delegates to `DashboardCashflowSummaryPending` — no useGetCashFlow call anywhere. BE-pending placeholder is structurally clean.
- `DateRangePicker` presets are: "7 hari terakhir", "14 hari terakhir", "30 hari terakhir" — NO "Bulan ini" preset. The default range IS current month-to-date (AC3) but the picker trigger displays a date string (e.g., "1 Mei 2025 — 22 Mei 2025") NOT a "Bulan ini" label. AC3 spec says labelled "Bulan ini" — this is NOT implemented. Flag to EL.
- `DashboardRangePosSalesTile` and `DashboardRangeRevenueTile` share the same `useGetRevenueSeries` SWR key `[DASHBOARD_REVENUE_SERIES, from, to, {clerk, from, to}]`. Picker change drives a single cache miss → single refetch for both.
- `SWR dedupingInterval: 30_000` on `useGetRevenueSeries` — rapid picker changes within 30s of the same from/to pair will not re-fetch (expected). For different from/to pairs, each change creates a new key and will fetch independently.
- `DashboardRangeSection` debounces picker commit by 250ms. Rapid changes cancel prior timer — only the last value within 250ms commits. AC2 rapid-picker test passes structurally.
- `Saldo saat ini` sublabel rendered inline under stat label inside `DashboardStatistics` — NOT in `headerAction`. Both Piutang and Hutang render it identically.
- `Aktivitas terkini` rendered in `headerAction` of `DashboardRecentInvoices` `SectionCard`, positioned left of the filter pill row.
- Soft CTAs only on empty states: `dashboard-range-daily-revenue-chart-empty.tsx` ("Buat transaksi di POS" → `/pos`) and `dashboard-range-pos-sales-tile-empty.tsx` ("Buka POS" → `/pos`). No other empty states have CTAs.
- `bg-primary-50` token = `#F0F7FF` — a very light blue. On white `bg-white` card backgrounds inside, the tint contrast is minimal. EL flagged this as Risk #1 for visual wash-out.

## LNS-230 Dashboard Widget Set Structure (2026-05-22)

- W1 (Anggota Aktif) and W2 (Total Produk) reuse the `dashboard-statistics.tsx` card shell pattern — NOT `SectionCard`. Rounded-xl, border-b-4, border-neutral-100, bg-neutral-50.
- W3 (Stok Menipis) and W4 (Transaksi POS Terbaru) use `SectionCard title="..." bodyClassName="p-0"`.
- W4 `dashboard-recent-pos-invoices-row.tsx` uses `deriveInvoicePaymentStatusKind()` from `@/features/invoice/presentations/components/invoice-payment-helpers` — NOT from `dashboard-recent-invoices.tsx`. Status display is a plain `<span>` with `text-success-500`/`text-warning-500` — no chip/bg wrapper.
- W3 sort uses `a.minStock ?? 0` fallback (minStock is `number | null` on entity) — correctly defensive.
- W4 Luxon DateTime comparison uses `>=` / `<=` operators directly on Luxon DateTime objects — valid because Luxon DateTime supports JS comparison operators.
- Page layout: `grid grid-cols-1 xl:grid-cols-3`; main `xl:col-span-2`, shoulder `xl:col-span-1`. W4 is inside the `bg-primary-50` tinted section.
- All 18 new components use `"use client"`. No deprecated components. No `text-gray-*`. No className template literals.
- Build time: 5.8s compile + static generation (44 pages). Build output: `/home` page is 19.9 kB.

## LNS-230 3rd Pass Layout Iteration (2026-05-22)

- `DashboardRangeRevenueTile` + 3 siblings deleted; `DashboardCashflowSummary` deleted. No import survivors in `src/`.
- `DashboardRangePosSalesTile` now accumulates `revenue + transactionCount` from the series via `useMemo`. Title = "Penjualan POS". Subtext = "dari N transaksi · periode ini".
- `DashboardRangeDailyRevenueChart` has a `SPARSE_THRESHOLD = 7` density switch: `activeDays < 7` → `DashboardRangeDailyRevenueStat`, `activeDays === 0` → existing empty component, `≥ 7` → chart impl.
- `DashboardRangeDailyRevenueStat` is a new component displaying active day count + peak day callout. Uses `useMemo`.
- B1 layout in `page.tsx`: main `xl:col-span-2` = period-controlled only (RangeSection → PosSalesTile → DailyRevenueChart → PaymentBreakdown). Shoulder `xl:col-span-1` = always-on (RecentInvoices → TotalProductsCard → LowStockCard).
- `hover:bg-primary-50` in `dashboard-recent-invoices.tsx` row hover is a PRE-EXISTING interactive hover effect (not a tinted background zone). CC1 (no tinted zone re-introduced) PASSES — verify via `git diff` before flagging.
- `dashboard-recent-invoices.tsx` color tokens updated: `bg-emerald-50` → `bg-success-50`, `text-emerald-500` → `text-success-400`, `bg-orange-50` → `bg-warning-50`, `text-orange-500` → `text-warning-400`. Limit: 5 → 7. Skeleton rows: 5 → 7.
- Build output: `/home` = 17.3 kB (down from 19.9 kB in round 2 — 2 deleted tiles reduced bundle). Build time: 4.4s compile. Total 44 pages.

## LNS-232 DashboardRecentActivity Structure (2026-05-24)

- Widget name change: `DashboardRecentInvoices` (shoulder column, 7 rows) → `DashboardRecentActivity` (full-width band below the 2-col grid, 10 rows). Old `DashboardRecentInvoices` top-level widget removed from `page.tsx`; 4 sub-components (`-arrow-icon`, `-column-header`, `-skeleton-row`, `-status-text`) retained and reused by new widget.
- 4 concurrent `useListInvoices()` calls inside a single component (posMergeResult / posPeriodResult / incomingResult / outgoingResult). Each has a distinct params shape, so SWR generates distinct keys — no collision risk.
- `InvoiceListItemEntity = IncomingInvoiceEntity | OutgoingInvoiceEntity` — `instanceof IncomingInvoiceEntity` guard in row is safe because both concrete classes exist.
- POS "Sesuai periode dipilih" caption uses `hidden` class (not conditional render) — DOM node always present, no layout shift. This is the intended pattern.
- `bg-primary-50` for POS icon badge, `bg-success-50` for incoming, `bg-warning-50` for outgoing — all tokens confirmed in `globals.css`.
- Period scoping: POS tab over-fetches 30 rows (limit:30), then client-filters by `createdAt >= from && <= to` using `.toISODate()` in Asia/Jakarta zone. Other tabs are NOT period-scoped.
- `page.tsx` `/home` route already registered in `ROUTE_MAP` (`header-title.tsx` line 13) — no regression risk.
- Build output: `/home` = 18 kB (up ~0.7 kB from LNS-230 round 3 baseline of 17.3 kB — expected from new widget). Build time: 5.2s compile. 44 pages total.

## LNS-246 Import-Path Refactor (2026-05-25)

- Pure `../...` → `@/` alias rewrite across 87 files, 154 specifiers. Zero behavioral change.
- Verification path: `npx tsc --noEmit` (exit 0) + `npm run lint` (exit 0, pre-existing `no-page-custom-font` warning only) + `grep -rln "from ['\"]\.\./" src/` (exit 1, zero matches) — all PASS.
- Dev server boots cleanly. `/sign-in` HTTP 200, `/` HTTP 200. No module-resolution errors in Next.js Turbopack compile log.
- `DEP0205 module.register() deprecated` warning appears in server log on page compile — upstream Node/Next internals, NOT caused by this refactor. Pre-existing.
- Browser smoke UNBLOCKED for this refactor: Clerk env gap did NOT cause 500s. Sign-in page returned HTTP 200 (Clerk middleware compiled cleanly — refactor preserved all import paths correctly). This is the first LNS ticket where `/sign-in` returned 200 without `.env.local`.
- Spot-checks passed: `create-incoming-invoice.tsx`, `use-get-incoming-invoice-pay-in-detail.ts`, `http-request.ts`, `transaction-timeline-impl.tsx` — all `@/` specifiers resolve to extant files on disk.

## LNS-245 Hook Deletion Verification (2026-05-25)

- Pure deletion: `use-get-incoming-invoice.ts` hook file + `GET_INCOMING_INVOICE` SWR key constant removed.
- No `/incoming-invoices` route exists in Next.js app router — the feature has no dedicated list page at that path. HTTP 404 on that URL is expected.
- `/invoices` HTTP 404 under Clerk env gap (no `.env.local`) — consistent with prior tickets. Not a regression.
- Dev server compile log showed zero `module not found` or HMR errors referencing deleted files — clean deletion confirmed.
- All three grep patterns returned exit 1 (zero hits): `useGetIncomingInvoice`, `GET_INCOMING_INVOICE`, `GetIncomingInvoiceFetcher`.
- Verification path: tsc exit 0 + lint exit 0 + 3x grep exit 1 + clean compile log = PASS.

## LNS-239 Analytics Shim Structure (2026-05-25)

- `track()` is a plain function export (not a hook). SSR guard via `typeof window === "undefined"` early-return. Body is a no-op (`void name; void properties;`). Try/catch wraps entire body; `console.warn` only fires when `process.env.NODE_ENV !== "production"`.
- `events.ts` is a discriminated union `AnalyticsEvent` — four variants: `recent_activity_tab_switched`, `recent_activity_period_changed`, `recent_activity_row_clicked`, `recent_activity_empty_state_shown`.
- `AnalyticsEventProperties<N>` uses `Extract<AnalyticsEvent, { name: N }>["properties"]` — tsc enforces payload shape per event name at call sites.
- AC6 tab-switch guard: `if (next !== activeTab) { track(...) }` inside `handleTabChange` — no-op click on active tab fires nothing.
- AC8 initial-mount guard: `prevRangeRef = useRef(null)`; first effect run sets the ref and returns early without firing `track()`. The brief referenced `didInitRef` from `dashboard-range-provider.tsx` as a reference pattern — SWE used `prevRangeRef` in `dashboard-recent-activity.tsx` instead. Functionally equivalent; not a defect.
- AC9 destination: `DESTINATION_TEMPLATE: Record<ActivityKind, string>` (`pos: "/sales/pos/:id"`, `incoming: "/invoices/incoming/:id"`, `outgoing: "/invoices/outgoing/:id"`). `destination: DESTINATION_TEMPLATE[view.kind]` — NOT `view.href`. AC9 PASSES.
- AC11 empty-state guard: three sequential early-returns (`if loading return; if error return; if rows.length !== 0 return`) semantically equivalent to `loading === false && error === null && rows.length === 0`. Not a defect.
- AC12 dedupe: `emptyStateSeenRef = useRef<Set<string>>(new Set())`, keyed by `${activeTab}|${from}|${to}`.
- Playwright NOT installed in project node_modules. Browser smoke fully blocked by Clerk env gap AND missing playwright package. Source-code static analysis is the only viable QA path.
- Build output: `/home` = 18.5 kB (up ~0.5 kB from LNS-232 baseline of 18 kB — expected from analytics call sites). Build time: 6.6s compile. 44 pages total.

## LNS-255 Personal Account NIK Validation (2026-05-26)

- `identity-number-input.tsx` — full rewrite. Mask enforced in `handleChange` via `raw.replace(/\D/g, "").slice(0, 16)` (WNI) and `raw.replace(/[^A-Za-z0-9]/g, "").slice(0, 16)` (WNA). `maxLength={16}` on the input (belt-and-suspenders). `inputMode="numeric"` on WNI.
- Paste sanitization: `handleChange` receives raw value and strips/truncates — covers paste path identical to keystroke path.
- `isClean` in `use-personal-account-data.ts` gates submit: WNI needs `/^\d{16}$/`, WNA `/^[A-Za-z0-9]{1,16}$/`. No submit until condition satisfied.
- Domain guard in `create-personal-account.ts` (execute): same regex check; returns `DataFailed(INVALID_IDENTITY_NUMBER)` without hitting repo if pattern fails — AC10 short-circuit confirmed.
- Toast wiring: `personal-account-form-wrapper.tsx` catches `ServerError` whose `code !== ErrorCodes.UNKNOWN.code` → shows `err.message`; all other errors (UNKNOWN + non-ServerError) → shows generic "Terjadi kesalahan" copy — AC11 PASS.
- Nationality toggle clears `identityNumber: ""` in `nationality-radio-group.tsx` `onChange` handler — AC9 clear confirmed.
- `submitAttempted` flag lives in `create-account.tsx` provider, surfaced through `usePersonalAccountData()`. `markSubmitAttempted()` called on form submit. `identity-number-input.tsx` reads `submitAttempted` in `showError` — error shown even if not touched after submit attempt.
- WNA option has `disabled: true` in `NATIONALITY_OPTIONS` — AC5/6 are structurally present but WNA flow is UI-blocked (disabled radio). Not a defect — WNA support is pending.
- Browser smoke: Clerk env gap (no `.env.local`) — `/onboarding/account` route blocked. Source-code static analysis used for all 12 ACs.

## LNS-254 Onboarding Submit Feedback (2026-05-26)

- `mapSubmitError()` at `src/app/(user)/onboarding/account/_lib/map-submit-error.ts` maps: `AbortError|TimeoutError` (DOMException) → `ERROR_COPY_NETWORK_TIMEOUT`; `ACCOUNT_CREATION_FAILED|DUPLICATE_ENTRY|DUPLICATE_IDENTITY|NO_VALID_SESSION` → dedicated copy; all other `ServerError` codes + non-ServerError → `ERROR_COPY_GENERIC`. NOTE: `HTTP_ERROR` and `UNKNOWN` codes fall through to `default` → `ERROR_COPY_GENERIC`. They are NOT missing — they are intentionally caught by the default branch.
- **AbortController signal NOT threaded to HTTP layer**: `runCreate()` builds an `AbortController` but does NOT pass `controller.signal` to `trigger()` (the SWR mutation). The 60s timeout fires via `Promise.race()` on the JS side — the user sees the error — but the underlying `fetch` continues in-flight. This means on timeout + retry, a second network request fires while the first may still be running. The `createdAccountId` guard partially mitigates double-create on retry (if first call succeeds while timed out, second submit skips create), but only if the in-flight request eventually resolves and `setCreatedAccountId` has been called. In practice this state is unreachable (JS race already threw, so `setCreatedAccountId` is never called on timeout). This is a yellow-severity behavioral gap — not a crash.
- **`disabled` logic in `SubmitButton`**: condition is `!isClean && !isCreating` (AND not OR). Correct intent would be `disabled={!isClean}` (disable when form is invalid). As written, when `isClean=false AND isCreating=true` → button is enabled. This state is practically unreachable in normal flow (form can't become invalid while submitting), but is logically incorrect. Low severity.
- **`ErrorCard` has no dismiss button**: `clearSubmitError` is exported but nothing calls it from the banner. Error clears only on next submit attempt (form `onSubmit` calls `clearSubmitError()` before `submit()`). This is a deliberate design choice — no manual dismiss needed.
- `PersonalSubmitErrorBanner` / `BusinessSubmitErrorBanner` — `role="status" aria-live="polite" aria-atomic="true"` wrapper is always rendered in the DOM (empty div when no error). Correct a11y pattern.
- Helper caption `"Unggah dokumen mungkin membutuhkan beberapa saat pada jaringan lambat."` is a static `<p>` below the button row — visible in ALL states (idle, loading, error) unconditionally.
- `aria-busy={isCreating}` placed on the `<form>` element (not just the button). Button also gets `aria-busy={loading}` and `aria-disabled={disabled || loading}` via `PrimaryButton` → `Button`.
- `cursor-wait` applied via `loading ? "cursor-wait opacity-100" : "disabled:cursor-not-allowed disabled:opacity-50"` in `PrimaryButton`. When loading, `disabled:opacity-50` is NOT active — overridden by `opacity-100`. Clean.
- Browser smoke BLOCKED: Clerk env gap (no `.env.local`) — `/onboarding/account` blocked. Source-code static analysis used for all ACs.

## LNS-384 JWT-Only Tenant Resolution (2026-06-14)

- `retrieveVerificationWork(session)` on `AccountService`/`AccountRepository`/`UseCase` all accept `session: SessionEntity` only — no `accountId` param on the wire path.
- `accountId` survives ONLY as a client-side SWR key discriminator + fetch gate in `use-get-account-verification-work.ts`: `shouldFetch = !!params.accountId`. It is NOT forwarded into the use case, repo, or service. Wire check: `retrieveVerificationWork(session)` is the entire call chain — no `accountId` in signature anywhere below the hook.
- `use-list-approved-accounts.ts` calls `verifyUseCase.execute(new RetrieveAccountVerificationWorkUseCaseParams())` per account in a `Promise.allSettled` loop — no `accountId` passed to execute. The result is used only for client-side filtering.
- Deprecated `AccountVerificationWorkProvider` retains `LocalStorageSessionService` (deprecated) — not a regression, no code changes there beyond existing compile fix. Flag for future cleanup.
- `/accounts/verification-works` path confirmed in `AccountServiceImpl.retrieveVerificationWork()` at line 137 of `account.ts`.
- `kyc-review` `internal/verification-works` paths are OUT OF SCOPE and remain untouched — confirmed via grep.
- Accounting `ledger-account` source uses `accountId` for `/accounting/accounts/${accountId}/balance` and `/accounting/accounts/${accountId}/ledger` — these are CHART-OF-ACCOUNTS account IDs (ledger accounts), NOT tenant IDs. Do not flag as AC violations.
- `journal.ts` source confirms `/accounting/journals` — no account param in path.
- No journal create/reverse FE endpoints exist anywhere in `src/features/accounting/`. AC-7 vacuously satisfied.
- `account-card-action.tsx` was a SECOND per-card caller that was missed in the initial QA pass — it also called `useGetAccountVerificationWork` and has since been fixed to read `props.account.latestStatus`/`props.account.verificationOutcome`. N+1 goal check: always grep the entire `src/app/(authenticated)/accounts` subtree, not just the named badge file.
- `ActionState` in `account-card-action.tsx` is now `"current" | "approved" | "disabled"` — `"loading"` member and "Memuat..." entry fully removed. Absent/unmapped status falls to `"disabled"` via ternary (no throw).
- `useGetCurrentAccount` is retained in `account-card-action.tsx` — it is NOT a verification-works caller; it resolves the currently active org account for the "Sedang Digunakan" badge.
- Template-literal className at line 66 of `account-card-action.tsx` is pre-existing debt, intentionally out of scope for LNS-389.
- Build output after fold-in fix: 44 pages, `/accounts` = 5.14 kB (down from 5.46 kB at LNS-384 baseline — both hook import trees removed). All three static gates exit 0.

## LNS-389 Account Picker Verification Status (2026-06-14)

- Accounts list badge moved from `useGetAccountVerificationWork` (N+1 per account, org-less failure) to reading `latestStatus`/`verificationOutcome` directly off `props.account`.
- Both `PersonalAccountEntity` + `BusinessAccountEntity` now carry `latestStatus?: VerificationStatus` and `verificationOutcome?: VerificationOutcome` as optional fields — added in this diff. NOTE: entity properties are `public` without `readonly` modifier (pre-existing pattern in these two entity files — not new in this diff). `PersonalAccountModel` already uses `public readonly`; `BusinessAccountModel` does NOT use `readonly` (pre-existing pattern as well — not introduced in this diff).
- `fromJson` parses `latest_status` / `verification_outcome` from JSON; `toEntity()` carries both fields forward. Verified for both PERSONAL and BUSINESS types.
- `AccountStatusBadge` uses `useMemo([props.account.latestStatus, props.account.verificationOutcome])` — no stale dep array risk.
- `useGetAccountVerificationWork` hook + `retrieve-account-verification-work.ts` usecase still exist (used by kyc-summary detail flow).
- `/accounts/[id]` detail page `AccountDetailLeftPanel` consumes `AccountStatusBadge` via `AccountTypeEntity` — same type union — no regression.
- Org-less multi-account picker with mixed verification states is **auth + state gated** — requires live Clerk session + seeded accounts. Headless QA cannot cover this path. Flag for manual smoke.
- Build output: 44 pages, `/accounts` = 5.44 kB (down from 5.46 kB — `useGetAccountVerificationWork` import tree gone). All three static gates exit 0.

## LNS-369 Journal Infra (2026-06-15)

- `JournalEntity` has 5 original fields (`id`, `date`, `memo`, `referenceType`, `referenceId`, `lines`, `createdAt`) without `readonly` — pre-existing pattern from before this diff (see `git show HEAD:src/features/accounting/domain/entities/journal.ts`). 5 NEW fields added in this diff (`postedBy`, `isReversal`, `reversedJournalId`, `supersededById`, `isReversedCurrently`) ARE `public readonly`. Mixed immutability is a pre-existing debt; the NEW fields conform to convention.
- `WarningEntryModel.fromJson` severity mapping: checks `INFO` and `HARD` explicitly, falls back to `WARNING` for anything else — correctly handles unknown/future enum values.
- `revalidateSWRKey()` is variadic (`...prefixes: string[]`) — reverse hook's two-arg call `revalidateSWRKey(LIST_JOURNALS, GET_JOURNAL)` is correct.
- `ACCOUNTING_SWR_KEYS.LIST_JOURNALS` constant value = `"list-journals"` — exact string match to the hardcoded string it replaced in `use-list-journals.ts`. No SWR key collision or isolation break.
- Discriminated-union type-narrowing (`CreateJournalResult`, `ReverseJournalResult`): tsc confirms accessing `.journal` on the `needs-acknowledge` branch is TS2339 compile error. Type safety verified via throwaway snippet.
- `domain/sources/journal.ts` importing param types from `domain/repositories/journal.ts` is an established codebase-wide pattern (confirmed across accounting, inventory, product, pos, fixed-cost features).
- All 3 use cases define their own param types (no `CreateJournalParams` etc. from repo imported directly). `JournalRepository` interface is imported but no repo param types are referenced in use case bodies.
- No-silent-post guarantee: `arbitrate()` returns `needs-acknowledge` when any unacknowledged HARD warning exists. Repo is called BEFORE arbitration — BE decides whether to post on their side (the front-end `acknowledgedWarningCodes` is passed in body). Revalidation of `LIST_JOURNALS` only fires in the `if (result.data.kind === "success")` guard. Reverse hook also revalidates `GET_JOURNAL` on success.

## LNS-373 Reports Hub + Neraca Viewer (2026-06-15)

- AC-7 retry is a known FAIL: `use-get-neraca-report.ts` returns `refresh: null` in `ErrorState`. The provider's `onRetry` guards with `if (hookResult.refresh)` — so when SWR is in error state, `onRetry` is a no-op. The retry button renders but clicking it does nothing. `mutate` is destructured from useSWR in scope but not exposed in error branch.
- AC-4 banner position: `ReportImbalanceBanner` renders at line 33 of `report-shell.tsx`, BEFORE `tabStrip` (line 35) and before content area (line 37). Banner is above the tab strip and statement — correct.
- AC-8 empty state: `neraca-impl.tsx` translates `shellState === "empty"` → passes `state="success"` to `ReportShell`, then renders `<NeracaEmptyBody/>` as children. `ReportShellEmpty` is never rendered for Neraca — the custom `NeracaEmptyBody` component with copy "Belum ada saldo per tanggal ini" is used inside `ReportShellSuccess`.
- AC-3 confirmed: `neraca-viewer.tsx` has exactly 2 `<th scope="col">` columns (Akun + Saldo). No `compareTo` column rendered anywhere in viewer/section/identity-row. Single-column always.
- Build output: `/finance/reports` = 14.6 kB, 45 pages total. Build time ~6.5s compile.
- `NeracaReportEntity` implements `AbstractEntity` (empty abstract class) — no `id` field required on the report itself. Line/bucket/section entities do have `id`.

## LNS-219 Refactor Structure (2026-05-21)

- `cart-summary.tsx` and `peek-strip.tsx` are now thin parent routers. All logic (disabled gate, context reads for Bayar) lives in sibling files.
- `cart-summary-bayar-button.tsx` and `peek-strip-bayar-button.tsx` are structurally identical: both derive `disabled` from `items.length === 0 || methodsLoading || hasCartWarnings || isCheckingOut`.
- `cart-summary-in-wizard-banner.tsx` and `peek-strip-in-wizard-label.tsx` are pure presentational components (no context reads, no "use client" directive).
- Parent `cart-summary.tsx` still has one `inWizard ? <CartSummaryInWizardBanner /> : <CartSummaryBayarButton />` ternary, gated under `{showCta && (…)}` — single-expression routing, not a multi-block conditional. Deliberate design.
- Browser smoke blocked on this machine: same Clerk env gap as LNS-197 — no `.env.local`, `CLERK_SECRET_KEY` absent.

## LNS-364 Journal Line Editor (2026-06-19)

- `_`-prefixed folders under Next.js App Router are NON-ROUTABLE ("private" convention). For QA throwaway harness pages, use a name WITHOUT leading underscore (e.g., `qa-lns364`, not `_qa-lns364`). Otherwise Turbopack compiles it as 404.
- The throwaway harness should be started AFTER the file is created (not before), otherwise Turbopack may still 404 — observed in this session.
- Browser smoke for authenticated pages is blocked by Clerk middleware even for QA throwaway pages under `(authenticated)/` — Clerk redirects to `/sign-in` before rendering. Source-level analysis is the only path for Clerk-gated routes.
- `aria-label` threading through `CurrencyInput` → `TextInput` → `<input>`: the `cleanedInputProps` destructure only removes `leftIcon, rightIcon, leftAddOn, rightAddOn, label, onChange, description, error, inputTextAlign` — `aria-label` survives and reaches the `<input>`. All a11y labels on money cells are correctly wired.
- `deEmphasized` in `JournalLineMoneyCell` sets `text-neutral-200` on the wrapper div, NOT on the `<input>`. The `disabled` prop is separate from `deEmphasized`. De-emphasized (inactive) money cells remain fully tab-reachable and interactive.
- `useEffect(() => {...}, [])` in `JournalLineRow` (mount-only, intentional) does NOT trigger lint failure because `react-hooks/exhaustive-deps` is NOT in the project's ESLint config. Confirmed exit 0 on `npm run lint`.
- `SearchCombobox` additive `autoFocus?: boolean` change: default `?? false` ensures zero regression to all 4 existing callers (none pass `autoFocus`). The existing callers: `raw-material-combobox.tsx`, `stock-item-combobox.tsx`, `manufactured-product-combobox.tsx`, `ledger-account-combobox.tsx`.
- `computeJournalLineBalance`: `isBalanced = totalDebit === totalCredit && totalDebit > 0` — all-zero explicitly NOT balanced (AC-7 correct). Uses strict integer equality so no float drift.
- `IDRFormatter.toNumber` strips all non-digits and `parseInt`s — no float drift. `1.500.000` → `1500000` (integer). `CurrencyInput` display uses `Intl.NumberFormat("id-ID")` which produces Indonesian thousands-dot format.
- `keys` array in `JournalLineEditor` is managed in parallel with `lines` — UUID keys prevent React from reusing DOM across add/remove operations. The `autoFocusKey` + `clearAutoFocus` pattern ensures focus is claimed only at the mount moment of the new row.
- **M1 focus fix (fix round)**: `isMobile` conditional render in `JournalLineRow` — `useState(false)` + `useEffect(window.matchMedia)` — guarantees exactly ONE `JournalLineAccountCombobox` instance in the DOM per row regardless of viewport. SSR-safe: defaults to desktop (false) on first paint, switches on hydration if viewport is <640px. `addEventListener("change", update)` ensures runtime resize updates the branch. The `removeButton` helper avoids code duplication across both branches.
- **m1 constant fix (fix round)**: `LEDGER_ACCOUNT_FETCH_LIMIT = 500` extracted to module scope in `journal-line-account-combobox.tsx`. Zero behavior change — same `{ limit: 500 }` value passed to `useListLedgerAccounts`.
- **Mobile footer fix (fix round)**: `JournalLineTotalsFooter` now has two sibling branches: `sm:hidden flex flex-col` (mobile — balance indicator full-width, then `grid-cols-2` debit/kredit) and `hidden sm:grid grid-cols-[1fr_1fr_1fr_auto]` (desktop — unchanged 4-col grid). `role="status"` and `aria-live="polite"` are on the shared `balanceIndicator` JSX variable, consumed by BOTH branches — a11y preserved. Transition classes (`transition-colors duration-200 motion-reduce:transition-none`) are on the `balanceIndicator` variable and therefore present in both branches.
- Build output (LNS-364 fix round, 2026-06-19): 45 pages (stale `qa-lns364` route cleared — back to baseline). All three static gates exit 0.

## LNS-371 Manual Journal Entry (2026-06-24)

- **PERIOD_CLOSED / DATE_IN_CLOSED_PERIOD not in ErrorCodes**: These two codes are checked in `journal-create-provider.tsx` `mapServerError()` by `serverError.code`, but neither is registered in `src/core/resources/server-error.ts`. `HttpRequest` falls through to the `UNKNOWN` path (httpCode 500) — the provider's period-closed branch is never reached. Inline date error "Periode untuk tanggal ini sudah ditutup." silently fails; user sees toast "Gagal menyimpan jurnal. Silakan coba lagi." instead. AC7 FAIL for PERIOD_CLOSED inline error path.
- **Toast copy mismatch**: Both success paths in provider show "Jurnal berhasil disimpan." (line 149, 181). AC1 specifies "Jurnal berhasil diposting". EL must confirm which is canonical.
- **JournalLineTotalsFooter dual-layout is JS-gated (not CSS-gated)**: `isMobile` boolean state switches between two exclusive early-return branches — only one `role="status"` is in the DOM at a time. NOT a dual-layout duplication issue (unlike CSS `hidden sm:grid`). This pattern is safe.
- **SWR key alignment**: `revalidateSWRKey(ACCOUNTING_SWR_KEYS.LIST_JOURNALS)` uses variadic prefix matcher `key[0] === prefix` — matches `useListJournals` array key `[ACCOUNTING_SWR_KEYS.LIST_JOURNALS, { clerk, params }]`. Works correctly.
- **Idempotency key A1–A4 chain confirmed clean**: usecase → repo → source all thread `idempotencyKey` parameter. Provider holds one `crypto.randomUUID()` in `useRef`, reused on ack, rotated only on terminal error.
- **Partial re-warn accumulation confirmed**: `handleConfirmWarnings` does NOT call `setWarningDialogOpen(false)` on second `needs-acknowledge` — dialog stays open, codes accumulate.
- Build output: `/finance/journals` = 7.06 kB, `/finance/journals/new` = 11.3 kB. 46 pages total. All three gates exit 0 after delta fix.
- **Resolution (delta pass 2026-06-24)**: PERIOD_CLOSED (httpCode 409) and DATE_IN_CLOSED_PERIOD (httpCode 422) added to ErrorCodes registry after NORMAL_BALANCE_HINT. mapServerError defensive fallback: `const code = err.code === "UNKNOWN" ? (err.details?.code ?? err.code) : err.code` — handles both registered-code path and any future unregistered fallback. Toast copy "Jurnal berhasil disimpan." → "Jurnal berhasil diposting." at both provider call sites. All ACs PASS after fix round.

## LNS-381 PPh Final UMKM Self-Setor (2026-06-25)

- **Build failure (pre-existing):** `npm run build` fails on this machine with `Cannot find module '../lightningcss.darwin-x64.node'` — a missing native binary in `node_modules/lightningcss/`. Confirmed pre-existing via `git stash -u` baseline run (same failure). NOT introduced by LNS-381. Report as environment-level; tsc + lint are the reliable gates here.
- **PERIOD_CLOSED detection via UNKNOWN wrapping:** `PERIOD_CLOSED` IS registered in `ErrorCodes` (httpCode 409), so `HttpRequest` will match it via `ErrorCodes.find(data.code)` and throw `new ServerError(ErrorCodes.PERIOD_CLOSED)`. The provider's defensive `err.code === "UNKNOWN" ? (err.details?.code ?? err.code) : err.code` is belt-and-suspenders for any future unregistered codes. Contrast with LNS-371 where PERIOD_CLOSED was NOT registered.
- **422 detection path for unknown codes:** `err.httpCode === 422` only fires when `ErrorCodes.find(data.code)` returns a match whose `httpCode === 422`. For unregistered 422 codes from the server, `HttpRequest` falls through to `new ServerError(ErrorCodes.UNKNOWN)` (httpCode 500) — `err.httpCode === 422` would NOT match. This is a theoretical gap: if the backend returns a 422 with an unregistered code string, the form-level error branch is skipped and user sees a toast instead. For the two registered 422 use cases in SETTLE flow this is fine.
- **idempotency key rotation:** Key rotated ONLY on error (any path through `catch` in `handleSubmit`). Success path does NOT rotate — correct. The fresh UUID on rotation ensures PERIOD_CLOSED retry (which also goes to catch) also rotates. EL should confirm whether PERIOD_CLOSED retry should preserve the key (idempotency reuse intent) vs. rotate (avoid replay on date-change retry). Current impl rotates on ALL errors including 409/PERIOD_CLOSED.

## LNS-344 Opening Balance Wizard Copy (2026-06-19)

- `HttpRequest` change is purely additive: adds `details: data.details` to `ServerError` constructor arg in both the known-code and unknown-code error paths. Existing callers that read `.details.code` / `.details.message` are unaffected. `ServerError.details` is `Object.assign({}, { code, message }, details_arg)` so the new field appears at `error.details.details`.
- `pos-provider.tsx` `handleStockErrorDetails` reads `error.details["items"]` (top-level). Before this change it was also undefined (no `items` in `{ code, message }` details). Pre-existing latent bug — not introduced or worsened by this diff. Handler early-returns gracefully on undefined.
- `resolveNormalBalanceOutcome` early-returns on first equity+debit line → correctly implements "mix → deficit wins" for all orderings.
- `useGetOpeningBalance` treats DataFailed as `null` (returns no migration) via `onErrorRetry: () => undefined`. 404 from the service is already absorbed as `null` before reaching the use case — double null-safe.
- `LabaRugiMigrationNotice` has `role="note"` (not `role="alert"` / `aria-live`) — informational callout, not an error. Correct choice per ARIA spec.
- `AccumulatedDeficitBlock` has `role="alert" aria-live="assertive"` + `tabIndex={-1}` + `useRef` focus-on-mount — all on a SINGLE layout branch (no dual-layout a11y risk).
- Browser smoke for `/finance/reports` (Laba Rugi tab) requires a live authenticated Clerk session + seeded opening-balance journal with `account_code === "3200"` — not achievable in headless QA. Page is auth-gated. Flag for manual smoke.
- Build output: `/finance/reports` = 22.3 kB (up from 14.6 kB at LNS-373 baseline — opening-balance read stack added to bundle). 45 pages total. All three gates exit 0.

## Shared Working Tree Race — Mid-Edit Stability (LNS-372)

- **Re-run tsc before asserting a hard FAIL when errors cluster on a single file under active SWE edit.** If tsc errors all point to one file that looks newly created or is being deleted/replaced by SWE, the first run may have captured a mid-edit snapshot. Run tsc a second time before issuing a definitive verdict. If the second run exits 0, note "initial run captured mid-edit tree — stable run exit 0" and report the stable result. Never issue a hard-FAIL off a single unstable run when error localization suggests concurrent edits.
- **Why:** LNS-372 — first QA report called tsc FAIL exit 2 citing errors in `journal-reverse-warning-dialog.tsx`, which SWE was deleting at that exact moment. EL verified ground truth, found tsc was exit 0, and the cited file no longer existed. The hard-FAIL caused a detour round-trip.

## Dialog-Split Refactor Focus-Trap Check (LNS-372)

- **When a dialog is refactored into chrome + sub-view components, always read the chrome file to count `LoonasDialog` instances.** Sub-view files (`journal-reverse-form.tsx`, `journal-reverse-ack-view.tsx`) are rendered inside the chrome and do not contain a `LoonasDialog` — only the chrome file (`journal-reverse-dialog.tsx`) is load-bearing for focus-trap count. Grepping sub-views alone cannot prove single-dialog conformance.
- **Why:** LNS-372 — the dialog was split into chrome + two sub-views. Correct verification required reading `journal-reverse-dialog.tsx` first to confirm one `LoonasDialog`, then the sub-views to confirm body-mode branching. The chrome is the only source of truth for focus-trap count.

## Shared Component Move — Consumer Grep (LNS-372)

- **When a shared component is relocated to a new path, grep ALL consumers and confirm they import from the new location.** tsc exit 0 confirms resolution, but grepping first surfaces the full consumer set for the report. Pattern: `grep -rn "ComponentName" src/` — review every import path in results before declaring clean.
- **Why:** LNS-372 — `JournalWarningItem` was moved from `/new/_components/` to `features/accounting/presentations/components/`. Both the `/[id]` ack-view and the `/new` create-flow warning dialog needed to import from the new path. tsc caught any remaining stale paths, but grepping confirmed the full consumer set explicitly.

## Provider Empty-State Parity Check (LNS-376)

- **When a report provider is added, always verify the shellState useMemo includes a `notes/sections/groups.length === 0 → "empty"` branch.** Every sibling report provider in this codebase gates "empty" explicitly on a data-presence check. Omitting this makes `*EmptyBody` components unreachable — the feature silently renders an empty viewer with no messaging instead.
- **Pattern to check:** `if (hookResult.data && hookResult.data.{collection}.length === 0) return "empty"` before the `return "success"` branch. LNS-376 calk-provider omitted this; notes array can be empty (0-note response for unseeded tenant periods) and the `CalkEmptyBody` was dead code as a result.
- **Also verify in the impl:** the `shellState === "empty"` branch is typically present in the impl file but is only reachable if the provider emits it. Both sides must match.

## Error-Branch refresh: null Pattern (LNS-372, LNS-373)

- **When verifying any get-hook, check BOTH the success branch AND the error branch for `refresh: mutate` vs `refresh: null`.** An error component's retry button is a no-op if the hook returns `refresh: null` in the error branch — the provider's `onRetry` guard (`if (hookResult.refresh)`) silently swallows the click.
- **Recurring pattern:** LNS-373 `use-get-neraca-report.ts` error branch returned `refresh: null` (AC-7 FAIL). LNS-372 `use-get-journal.ts` initially had the same gap (AC-8 PARTIAL → fixed to `refresh: mutate`). Check both branches on every get-hook review.

## LNS-459 Sidebar Icon Swap (2026-07-17)

- **Pure static-asset + prop-value swap, zero logic touched** — `accounting-navigation-menu.tsx` only swapped the `iconPath`/`selectedIconPath` literals on 5 `NavigationGroup`s (`chart-icon` → `book`/`coins`/`percent`/`list-tree`/`report`); the active/inactive selection logic (`navigation-group.tsx:43-44`) was untouched, so source-level confirmation is decisive (same principle as the LNS-402 "pure-refactor smoke non-blocking" rule in `qa.md`).
- **`curl` fallback for `next/image` static assets works great when Clerk blocks browser smoke.** `public/*.svg` files are served unauthenticated regardless of the Clerk wall — `curl -I http://localhost:3000/assets/images/{name}.svg` returns real HTTP 200 + `Content-Type: image/svg+xml` from the running dev server, which is stronger evidence than reading the file off disk alone (proves Next.js static serving actually works, not just that the file exists).
- **Desktop sidebar and mobile "Lainnya" sheet are the SAME component instance** (`navigation-menu.tsx` renders one `<AccountingNavigationMenu/>` for both, gated by route — confirmed via its own doc comment). A change to `AccountingNavigationMenu` cannot diverge between desktop/mobile; no separate mobile verification pass is needed beyond confirming this single-instance sharing, once per ticket.
- **`git diff dev --stat` can show files NOT in your working-tree diff** if the branch has prior commits ahead of `dev` unrelated to the current ticket (here: `journal-reverse-form.tsx` + `reopen-period-dialog.tsx`, already committed via 2 earlier commits on this branch before QA picked it up). Distinguish via `git status` (uncommitted) vs `git log dev..HEAD` (committed-but-unmerged) before scoping the review — don't grade unrelated already-committed work against the current ticket's ACs.
- Build failure = the same environmental `@clerk/clerk-react: Missing publishableKey` prerender pattern as LNS-402/411/381 (see the qa.md rule + "Clerk Environment Gotcha" above); this run additionally hit `/finance/ledger` + `/invoices/incoming/unpaid`. `Compiled successfully` completed clean before the prerender stage — the icon change introduced zero type/compile errors.

## Build Environment Note — `loonas-webapp` (this checkout) vs `loonas-webapp-2` (LNS-572, 2026-07-29)

- **This checkout (`/Users/fsiswanto/Documents/loonas-webapp`) has a working `.env` with Clerk keys and correct native binaries** — `npm run build` completed the FULL pipeline (compile → lint/typecheck → static prerender of all 53 routes) with exit 0, zero errors. No `lightningcss.darwin-x64.node` missing-module failure, no `Missing publishableKey` prerender failure. Do NOT assume the lightningcss/Clerk-keyless build failures documented elsewhere in this file apply here — those were observed on the sibling `loonas-webapp-2` checkout (see "SUPERSEDED" note under Clerk Environment Gotcha) or on an older state of this repo. Always verify fresh per run rather than assuming the failure mode; on this checkout as of 2026-07-29, build is a clean, reliable gate.

## State-Transition Render Check (LNS-378)

- **When a mutation flips a named boolean that gates which components render (e.g. `locked`, `isClosed`, `isActive`), enumerate which components are visible BEFORE vs AFTER the flip, and verify the post-success artifact (journal id, reversal id, etc.) is rendered in the AFTER set.** A returned value wired only to a pre-flip component is a surfacing gap even when the hook/provider wiring is technically correct — a static-gate-only or "does the hook return the id?" check passes while the user sees nothing.
- **Why:** LNS-378 — the `YearEndJournalReference` strip only renders when `isLocked=true`; reopen-year success sets `isLocked=false`, so the returned `reversalJournalId` was invisible (AC-5 gap). Caught only by tracing the post-transition render branch, not by static gates. Fix added a transient `reopenedReversalJournalId` strip in the `!isLocked` branch.

## Faithful Static-Preview Technique for Auth-Blocked Visual QA (uniform-stock-item-action-menu round)

- **Use the real Tailwind v4 browser CDN, not a hand-translated v3 config, for auth-blocked visual previews.** `<script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>` + `<style type="text/tailwindcss">@import "tailwindcss"; @theme {...}</style>` with the `@theme` block copied verbatim from `src/app/globals.css` lets the real Tailwind v4 engine resolve every class in the actual component source — including arbitrary-value classes like `grid-cols-[1.5fr_1fr_1.2fr_0.8fr_0.8fr_40px]` and `max-h-[90dvh]` — with zero manual translation risk. Superior to the Tailwind v3 Play CDN (`cdn.tailwindcss.com` + `tailwind.config`), which requires re-authoring the theme and can silently diverge on v4-only syntax. Requires network access (confirmed available this session via `curl`).
- **Headless UI `Menu`/`MenuItems anchor="..."` portals to `<body>` and uses Floating UI `flip()`+`shift()`+`autoUpdate`** — confirmed by grepping `node_modules/@headlessui/react/dist/components/menu/menu.js` (contains `Portal`, `anchor`) and `node_modules/@headlessui/react/dist/internal/floating.js` (contains `flip`, `shift`, `autoUpdate`). This means any `ActionMenu` (`core/presentations/components/action-menu.tsx`) placed inside a `TableContainer` (`core/presentations/components/table/table-container.tsx:42`, which is `overflow-hidden`) is NOT clipped by that ancestor, and a last-row popover auto-flips upward instead of overflowing the viewport — this is codebase-wide, pre-existing Headless UI behavior, not something each new menu placement needs to re-verify structurally. **When mocking an open popover in a static preview, do NOT copy the real ancestor's `overflow-hidden` verbatim** — doing so produces a misleadingly "broken/clipped" screenshot that doesn't reflect real rendering (caught mid-session: first pass showed the 4th menu item cut off; fix was dropping `overflow-hidden` from the mock container and documenting why in an HTML comment).
- **Don't stack multiple `fixed inset-0` dialog/modal scenarios in one static-preview HTML file** — `position: fixed` ignores document flow, so two `LoonasDialog`-style scenarios in the same file render on top of each other regardless of their DOM order. Split into separate `.html` files, one per scenario, and screenshot each independently.
- **Playwright cached-chromium version mismatch is a recurring setup snag across sessions/checkouts.** `~/Library/Caches/ms-playwright/` holds whatever revision the last CLI/version left behind (this session found `chromium-1228` cached, but `npx playwright` resolved to CLI v1.62.1 which expects revision 1234, producing `Error: Executable doesn't exist at .../chromium_headless_shell-1234/...`). Fix: `npx playwright install chromium` — safe, downloads the matching build to the same cache dir (~180MB, takes a minute or two on this network), no source changes. Don't waste time trying to pin an old CLI version to match a stale cache; the fresh install is faster and it's how the earlier "cached Playwright chromium" instruction is meant to keep working across sessions.
- **`npx playwright screenshot <url> <out.png> --viewport-size=W,H --wait-for-timeout=ms [--full-page]` is a lighter path than writing a Playwright script** when `require("playwright")` can't resolve cleanly (e.g. the only installed `playwright` package on the machine lives in a sibling project's `node_modules` at a different version than the cached browser, as observed this session with `torto-webapp`'s playwright 1.58.2 vs. the newly-installed chromium 1234). The CLI screenshot subcommand needs no `require()` resolution at all — it just works once the browser is installed.
