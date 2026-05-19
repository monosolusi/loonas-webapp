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
