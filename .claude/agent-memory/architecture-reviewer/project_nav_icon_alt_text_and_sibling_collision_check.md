---
name: nav-icon-alt-text-and-sibling-collision-check
description: NavigationGroup/NavigationItem set Image alt=label (duplicates adjacent visible text) across ~13 icon pairs; reusable grep method to check for nav-sibling icon collisions
metadata:
  type: project
---

Two things learned reviewing LNS icon-dedup commit `cee5d5c4` (Produk vs Inventaris sidebar icon collision fix, `archive-icon-*` replacing reused `box-icon-*` on `InventoryNavGroup`):

**1. Systemic pre-existing a11y pattern**: `NavigationGroup` (`src/app/(authenticated)/_components/navigation-group.tsx:57`) and
`NavigationItem` (`.../navigation-item.tsx:44`) both render `<Image src={icon} alt={label} .../>` immediately next to a
sibling text node (`<span>{label}</span>` / `<div>{props.label}</div>`) that shows the same string. Per WCAG (PRODUCT.md's
stated AA bar), a decorative icon adjacent to its own visible label should carry `alt=""` — `alt={label}` makes
screen readers announce the label twice. This affects ALL ~13 nav icon pairs in the tree (box, dashboard, chart,
people, document, gear, invoice-in, invoice-out, book, coins, percent, list-tree, report, archive), not just
whichever icon a given commit touches. **Fix belongs in `NavigationGroup.tsx`/`NavigationItem.tsx` once** (change
`alt={label}` → `alt=""`), not per-consumer — flag as pre-existing tech debt on any nav-icon commit, never as
change-introduced, unless the diff actually touches one of those two shared components.

**2. Sibling-icon-collision check method**: to verify "is icon X now unique among its nav siblings," grep
`iconPath\|selectedIconPath\|iconSrc` across every `*-nav-group.tsx` / `*-nav-entry.tsx` / `*-nav-item.tsx` file
under `src/app/(authenticated)/_components/` plus the two `NavigationMenu`/`AccountingNavigationMenu` array literals
that mount them. Compare the resulting icon-noun list within each sibling set (main menu vs. accounting-focused
menu are two SEPARATE sibling sets, mutually exclusive renders via `isAccountingPath` — a shared icon across the
two sets is not a collision). This is a cheap, complete check — no need to eyeball SVGs.

Also confirmed as a general fact for this feature area: `box-icon-*` remains referenced by ~17 other call sites
(SectionCard `iconSrc` across products/purchasing/productions/settings, plus Produk's own nav entry) — a healthy
signal to check blast-radius on any icon-file rename/replace in this tree.
