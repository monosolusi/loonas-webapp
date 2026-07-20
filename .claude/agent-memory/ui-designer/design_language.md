---
name: design-language-conventions
description: Core design system primitives, sizing tokens, palette rules, and loading patterns used across Loonas webapp
metadata:
  type: reference
---

## Components
- `SectionCard` — `rounded-lg border-neutral-200` card with icon header; standard for all detail surfaces
- `PrimaryButton` / `SecondaryButton` / `DangerButton` — from `core/presentations/components/buttons/`; `h-11` (44px) height standard
- `ActionMenu` — 3-dot menu for table row actions; replaces inline icon buttons
- `StatusChip` — success/warning/error/primary/neutral variants
- `NumberDisplay` — IDR formatting with thousand separators
- `TablePagination`, `TableContainer`, `TableToolbar`, `TableSearch`, `TableHeader` — standard table shell (replaces deprecated `InvoiceTableShell`)
- `LedgerAccountCombobox` — existing combobox for picking GL accounts

## Sizing & Spacing
- Interactive elements: `h-11` (44px)
- Table icon-only actions: `size-8` (32px)
- Dialog widths via `LoonasDialog` `width` prop (e.g., `"2xl"`)

## Palette (diverges from Tailwind defaults)
- `neutral-50` = #FFFFFF (pure white)
- `neutral-100` = #D9DADA (lightest visible grey — use for chips, borders, backgrounds)
- Use `neutral-300` for placeholder/secondary text
- `primary-300/10` for icon container backgrounds on active tiles

## Patterns
- Skeleton loading: `animate-pulse` placeholder divs inside SectionCard (no Lottie)
- className composition: `clsx()` only (no template literals)
- Provider guarantee pattern: provider accepts `loading` prop and renders until data is ready; children never null-check
- One component per file; no conditional rendering of multiple states in return — split into separate components
- Page-level providers in `_providers/`; components in `_components/`

## Deprecated (never use)
- `InvoiceTableShell` → use `TableToolbar`/`TableContainer`/`TableHeader`
- `Card` → `SectionCard`
- `FilledButton` / `OutlinedButton` → `PrimaryButton` / `SecondaryButton`
- Inline edit/delete icon buttons → `ActionMenu`
- Template literal classNames → `clsx()`

## POS terminal screens — established pattern (from qris-paid-splash, qris-creation-failed)
- Container: `flex flex-1 flex-col items-center justify-center gap-y-4 px-6 py-10 text-center`
- `aria-live="polite"` on the container root
- Icon circle: `size-16 rounded-full flex items-center justify-center bg-{color}-100 text-{color}-500`
- Icon inside: `size-8` Heroicon with `aria-hidden`
- Heading: `text-lg font-semibold text-neutral-500`
- Body: `text-sm text-neutral-300`
- Button group: `flex w-full max-w-xs flex-col gap-y-2 pt-2`

## POS terminal icon families (must differentiate on new screens)
- Creation-failed: `ExclamationTriangleIcon` (24/outline) — bg-error-100 / text-error-500
- Paid: `CheckIcon` (24/solid) — bg-success-100 / text-success-500
- Creating: no icon — animate-pulse skeleton block

## Button base API (core/presentations/components/buttons/button.tsx)
- Props: `label`, `loading?`, `leftIcon?`, `rightIcon?`, disabled, className, all native button attrs
- `loading` prop: renders Spinner inline and sets button to disabled automatically — no need to manually disable
- `leftIcon` / `rightIcon` accept ReactNode (16x16 icon recommended)

## Color tokens (globals.css — canonical)
- neutral-50=#FFFFFF, neutral-100=#D9DADA, neutral-200=#BDBDBD, neutral-300=#323636, neutral-400=#1B1B1B, neutral-500=#0D0E0E
- warning-200=#FDB022, warning-300=#F79009, warning-400=#DC6803, warning-500=#B54708
- error-100=#FEE4E2, error-500=#B42318
- success-100=#DCFAE6, success-500=#067647
- primary-300=#007BFF
- Lightest tint fills (chips, callouts, severity blocks): `primary-50` (#F0F7FF), `success-50`, `warning-50`, `error-50` — plus `neutral-50` = #FFFFFF (white). These `-50` tokens are the canonical pale fills.

## Token verification rule
- Before naming ANY color token in a spec, verify it exists in `globals.css @theme` (or the DESIGN.md YAML frontmatter) — grep it first. This project's lightest tint suffix is `-50`; there are NO `-pale`, `-light`, or `-muted` suffix tokens. A wrong primary token name forces EL/SWE to remap and is a silent spec defect. (LNS-371: spec named `warning-pale`/`error-pale`, which don't exist → remapped to `warning-50`/`error-50`.)

## 16×16 sidebar icon family — authoring conventions (LNS-459)
Established while replacing 5 shared `chart-icon` uses in `accounting-navigation-menu.tsx` with distinct icons (`book-icon`, `coins-icon`, `percent-icon`, `list-tree-icon`, `report-icon`).
- All existing family members (`chart-icon`, `box-icon`, `dashboard-icon`, `gear-icon`, `wallet-icon`, `dollar-icon`, `clock-icon`, `document-icon`, `people-icon`, `invoice-in/out-icon`) live in `public/assets/images/`, filename pattern `{name}-icon-{neutral-300|primary-300}-w16-h16.svg` — the two variants differ ONLY in `stroke` color (`#323636` neutral / `#007BFF` primary); no hover-state asset exists because hover only tints the nav-item background (`bg-primary-300/20`), never the icon color (confirmed against `NavigationGroup`/`NavigationItem`).
- **Never a native `<circle>`/`<ellipse>` element.** Every circular shape in the whole family (clock-icon, dollar-icon) is a hand-authored 4-arc cubic-Bézier `<path>`. Formula for a circle at `(cx,cy)` radius `r`: control offset `k = r × 0.55228`. Starting at top `(cx, cy-r)`, clockwise: `C(cx+k,cy-r)(cx+r,cy-k)(cx+r,cy) C(cx+r,cy+k)(cx+k,cy+r)(cx,cy+r) C(cx-k,cy+r)(cx-r,cy+k)(cx-r,cy) C(cx-r,cy-k)(cx-k,cy-r)(cx,cy-r) Z`. Verified digit-for-digit against `clock-icon-primary-300-w16-h16.svg`'s real path before relying on it.
- **Rounded corners come from `stroke-linejoin="round"` on sharp right-angle polylines**, not from `rx`/`ry` radii — `box-icon`/`chart-icon`/`list-tree-icon`/`report-icon` are all plain orthogonal paths that render soft purely from the mandated linecap/linejoin.
- Content bounding box sits inset ~1.33–2.67px from the 16×16 edge across the family (a 12-unit grid inside the 16-unit viewBox, i.e. multiples of 16/12 ≈ 1.333). Snap new icon coordinates to this grid (0, 1.333, 2.667, 4, 5.333, 6.667, 8, 9.333, 10.667, 12, 13.333, 14.667, 16) for visual harmony with the rest of the set.
- **Family coherence tactic:** spread new icons across the family's existing shape vocabulary (circle-based / orthogonal-line / organic-curve) rather than letting them cluster into one silhouette class — makes a same-glance scan easier and avoids two new icons reading as variants of each other.
