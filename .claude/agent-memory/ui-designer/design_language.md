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
