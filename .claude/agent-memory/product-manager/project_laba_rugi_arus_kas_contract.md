---
name: project-laba-rugi-arus-kas-contract
description: LNS-374 — Laba Rugi (POST) + Arus Kas (GET) report endpoints; FE plumbing shipped by LNS-365; tab-strip + page-router unions must be widened to enable the two tabs
metadata:
  type: project
---

LNS-374 ("FE: Laba Rugi + Arus Kas report viewers"). Both compute endpoints shipped (read-only, JSON). FE module-layer plumbing already exists from LNS-365 — viewer work is typed-shape + bespoke body + tab-enable only. Grounded from FE source on `dev` 2026-06-16, not memory.

**Service contract (confirmed in `data/sources/report.ts`):**
- `getLabaRugi` → **POST** `/accounting/reports/laba-rugi`, JSON body `{ from, to, compare_from?, compare_to? }`, returns `{ data }`. The ONE report that breaks the GET-with-query pattern. SWR key must serialize body: `[GET_LABA_RUGI_REPORT, from, to, compare_from, compare_to]`. Response shape `{ meta, current, compare }` (compare nullable). 
- `getArusKas` → **GET** `/accounting/reports/arus-kas`, searchParams `{ from, to }`, returns `{ data }`. Shape `{ meta, operasi, investasi, pendanaan, _imbalance, non_cash_transactions[] }` (indirect method).
- Both JWT-resolved tenant (session-only, no account id). Param types already typed; response `data` still `Record<string,any>` passthrough — typed model/entity is the viewer work.

**Tab enablement is MODIFICATION work, not just additions (enumerate explicitly per LNS-230 rule):**
- `reports-tab-strip.tsx`: `TABS` array already lists `laba-rugi` + `arus-kas` as `disabled: true` ("Segera hadir"). Flip both to `false`; widen `ReportsTabStripProps.activeTab` union (currently `"neraca"|"trial-balance"|"buku-besar"`) to add the two ids. CaLK stays disabled.
- `page.tsx` (tab router): widen `ActiveTab` union + `handleTabChange` guard + add two conditional `<Provider><Impl/></Provider>` mounts. Inactive tabs unmounted (no bg fetch).

**Pattern to mirror (LNS-373 Neraca trio):** `_providers/{report}-provider.tsx` (state + hook + derived shellState + onRetry) → `_components/{report}-impl.tsx` (adapter: provider ctx → ReportShell props, mounts ReportsTabStrip into `tabStrip` slot, wraps `role=tabpanel`) → `presentations/components/reports/{report}-viewer.tsx` (bespoke body). Bespoke `*-empty-body.tsx` page-local; Neraca impl maps `empty→success` and renders bespoke empty inside shell.

**Deep nested shapes (current/compare lines; arus-kas section lines, net-change/opening/closing field names, _imbalance shape, non_cash item) NOT confirmed** — WebFetch truncates before report endpoints on this large spec; no FE typed consumer yet → delegated to EL to fetch/parse raw spec (do not assume from Neraca pattern). See [[project-report-shell-contract]], [[project-neraca-contract]].
