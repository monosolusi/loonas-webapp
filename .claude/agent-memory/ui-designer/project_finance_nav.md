---
name: finance-nav-group
description: FinanceNavGroup structure and gating — needed when adding new finance routes to sidebar navigation
metadata:
  type: project
---

Location: `src/app/(authenticated)/_components/finance-nav-group.tsx`

- Entire group gated: `if (!account?.hasFeature("accounting")) return null`
- Uses `NavigationGroup` + `NavigationChildItem`
- `NavigationGroup` props: `label`, `iconPath`, `selectedIconPath`, `matchPrefixes` (array of route prefixes that keep the group open)
- Current items: Buku Besar (`/finance/ledger`), Jurnal Umum (`/finance/journals`), Biaya Tetap (`/finance/fixed-costs`)
- New items to add: Catat Biaya (CTA on Jurnal Umum, not a nav item), Pajak (`/finance/tax` — CPO pending)
- Must add `/finance/tax` to `matchPrefixes` when new route is confirmed
