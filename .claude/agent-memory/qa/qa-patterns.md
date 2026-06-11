---
name: qa-patterns
description: Recurring build warnings, CI ticket scope rules, build perf baseline, JSON validity gate, Playwright session/backend patterns, SWR key isolation, LNS-232 widget migration
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

## Clerk Environment Gotcha (LNS-197, 2026-05-21)

- `.env.local` does NOT exist on this machine. Only `.env` exists, which is missing `CLERK_SECRET_KEY`.
- Server boots and reports "Ready" but all pages throw `Runtime Error: @clerk/nextjs: Missing secretKey` in the browser overlay.
- Playwright browser smoke tests are BLOCKED by this — the POS page (and all authenticated routes) cannot render at all in headless browser without valid Clerk keys.
- **Mitigation**: Switch to source-code static analysis (read files, grep) for structural AC verification when Clerk env is missing. Note the environment gap in the report to EL.
- **Playwright note**: `playwright` package is NOT in the project's `node_modules`. It is only available globally via `npx` cache at `~/.npm/_npx/`. Run smoke scripts from a directory that contains the `playwright` package, e.g., `cd ~/.npm/_npx/<hash> && node script.mjs`.

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

## LNS-219 Refactor Structure (2026-05-21)

- `cart-summary.tsx` and `peek-strip.tsx` are now thin parent routers. All logic (disabled gate, context reads for Bayar) lives in sibling files.
- `cart-summary-bayar-button.tsx` and `peek-strip-bayar-button.tsx` are structurally identical: both derive `disabled` from `items.length === 0 || methodsLoading || hasCartWarnings || isCheckingOut`.
- `cart-summary-in-wizard-banner.tsx` and `peek-strip-in-wizard-label.tsx` are pure presentational components (no context reads, no "use client" directive).
- Parent `cart-summary.tsx` still has one `inWizard ? <CartSummaryInWizardBanner /> : <CartSummaryBayarButton />` ternary, gated under `{showCta && (…)}` — single-expression routing, not a multi-block conditional. Deliberate design.
- Browser smoke blocked on this machine: same Clerk env gap as LNS-197 — no `.env.local`, `CLERK_SECRET_KEY` absent.
