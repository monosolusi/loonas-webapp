---
name: authenticated-chrome-widths
description: Authenticated chrome uses a fixed 256px sidebar + p-8 content padding, no global max-w; design assumptions for content width at common viewports
metadata:
  type: project
---

The `(authenticated)` layout (`src/app/(authenticated)/layout.tsx` + `_components/navigation-bar.tsx`) uses:
- **Sidebar:** fixed `w-[256px] shrink-0` — always rendered, no responsive hide, no mobile drawer.
- **Content column:** `flex-1` with `p-8` (32px all sides) — no `max-w` constraint, stretches to fill remaining width.
- App is **desktop-first**; mobile/tablet are not first-class targets for authenticated routes.

**Content-width math** = viewport − 256 (sidebar) − 64 (padding):

| Viewport | Content width |
|---|---|
| 1280 (small laptop) | 960 |
| 1440 (15" laptop) | 1120 |
| 1920 (desktop) | 1600 |
| 2560 (large monitor) | 2240 |

**Why:** unconstrained content + fixed nav is the project's intended pattern — tables and dashboards stretch across the available width.

**How to apply:**
- When asking UID to spec a layout/component, anchor the worst-case to **1280px viewport / 960px content width** for legibility. That's the lower bound to design for.
- For `md:grid-cols-3` widget tracks (used by `DashboardRangeSection`), the per-cell width at 1280px is ~310px — relevant for any chart x-axis density planning.
- Don't introduce a global `max-w` to the content column without explicit design sign-off — the project explicitly stretches.

Related: [[date-range-picker-shared]].
