---
name: settings-page-tile-pattern
description: Settings index page tile grid, feature-gating, and active/inactive card states — needed when adding new settings tiles
metadata:
  type: project
---

Location: `src/app/(authenticated)/settings/page.tsx`

- Grid: `grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3`
- `SettingsCategoryCard`: active card links to `href`, inactive shows "Segera Hadir" badge with opacity-50 + cursor-not-allowed
- Tiles can have a `feature` key; filtered via `account?.hasFeature(feature)`
- Active card: `bg-primary-300/10` icon container, `hover:border-primary-300/30 hover:shadow-sm` transition
- Inactive card: `bg-neutral-50` icon container, `text-neutral-300` description, neutral badge

New accounting tile to add:
- href: `/settings/accounting`
- title: "Akuntansi"
- description: "Atur informasi pajak dan pengaturan akuntansi bisnis Anda."
- feature: `"accounting"` (INTERNAL-role-only via feature flag)
- active: true
- Place after "Pemetaan Akun" tile
