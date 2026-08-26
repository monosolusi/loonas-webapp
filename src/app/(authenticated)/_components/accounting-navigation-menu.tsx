"use client";

import { useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { NavigationItem } from "@/app/(authenticated)/_components/navigation-item";
import { NavigationGroup } from "@/app/(authenticated)/_components/navigation-group";
import { NavigationChildItem } from "@/app/(authenticated)/_components/navigation-child-item";
import { AccountingBackButton } from "@/app/(authenticated)/_components/accounting-back-button";
import { useGetCurrentAccount } from "@/features/account/presentation/hooks/use-get-current-account";
import { CASH_ENTRY_FEATURE } from "@/app/(authenticated)/accounting/_components/cash-entry-feature-gate";

type AccountingNavGroup = {
  id: string;
  label: string;
  iconPath: string;
  selectedIconPath: string;
  matchPrefixes: string[];
  items: { href: string; label: string }[];
  /** Optional account feature required to render this group. Omitted = always shown. */
  feature?: string;
};

/**
 * Every accounting menu, grouped by an accounting operator's daily workflow.
 * `matchPrefixes` drives both the group's active state and which group auto-opens
 * for the current route (see the sync effect below).
 */
const ACCOUNTING_NAV_GROUPS: AccountingNavGroup[] = [
  {
    id: "acc-journals-ledger",
    label: "Jurnal & Buku Besar",
    iconPath: "/assets/images/book-icon-neutral-300-w16-h16.svg",
    selectedIconPath: "/assets/images/book-icon-primary-300-w16-h16.svg",
    matchPrefixes: ["/accounting/journals", "/accounting/ledger", "/accounting/opening-balance"],
    items: [
      { href: "/accounting/journals", label: "Jurnal Umum" },
      { href: "/accounting/ledger", label: "Buku Besar" },
      { href: "/accounting/opening-balance", label: "Saldo Awal" },
    ],
  },
  {
    id: "acc-cash",
    label: "Kas",
    iconPath: "/assets/images/banknote-icon-neutral-300-w16-h16.svg",
    selectedIconPath: "/assets/images/banknote-icon-primary-300-w16-h16.svg",
    matchPrefixes: ["/accounting/cash-entries", "/accounting/cash-categories", "/accounting/cash-entry-settings"],
    feature: CASH_ENTRY_FEATURE,
    items: [
      { href: "/accounting/cash-entries", label: "Kas Masuk & Kas Keluar" },
      { href: "/accounting/cash-categories", label: "Kategori" },
      { href: "/accounting/cash-entry-settings", label: "Pengaturan" },
    ],
  },
  {
    id: "acc-costs-profitability",
    label: "Biaya & Profitabilitas",
    iconPath: "/assets/images/coins-icon-neutral-300-w16-h16.svg",
    selectedIconPath: "/assets/images/coins-icon-primary-300-w16-h16.svg",
    matchPrefixes: ["/accounting/fixed-costs", "/accounting/fixed-cost-types", "/accounting/profitability"],
    items: [
      { href: "/accounting/fixed-costs", label: "Biaya Tetap" },
      { href: "/accounting/fixed-cost-types", label: "Jenis Biaya Tetap" },
      { href: "/accounting/profitability", label: "Profitabilitas" },
    ],
  },
  {
    id: "acc-tax",
    label: "Pajak",
    iconPath: "/assets/images/percent-icon-neutral-300-w16-h16.svg",
    selectedIconPath: "/assets/images/percent-icon-primary-300-w16-h16.svg",
    matchPrefixes: ["/accounting/pph-final", "/accounting/tax-posture"],
    items: [
      { href: "/accounting/pph-final", label: "PPh Final UMKM" },
      { href: "/accounting/tax-posture", label: "Postur Pajak" },
    ],
  },
  {
    id: "acc-chart-of-accounts",
    label: "Bagan Akun",
    iconPath: "/assets/images/list-tree-icon-neutral-300-w16-h16.svg",
    selectedIconPath: "/assets/images/list-tree-icon-primary-300-w16-h16.svg",
    matchPrefixes: ["/accounting/accounts", "/accounting/mappings"],
    items: [
      { href: "/accounting/accounts", label: "Daftar Akun" },
      { href: "/accounting/mappings", label: "Pemetaan Akun" },
    ],
  },
  {
    id: "acc-period-reports",
    label: "Periode & Laporan",
    iconPath: "/assets/images/report-icon-neutral-300-w16-h16.svg",
    selectedIconPath: "/assets/images/report-icon-primary-300-w16-h16.svg",
    matchPrefixes: ["/accounting/periods", "/accounting/reports"],
    items: [
      { href: "/accounting/periods", label: "Periode Akuntansi" },
      { href: "/accounting/reports", label: "Laporan Keuangan" },
      { href: "/accounting/reports/cost-valuation-gaps", label: "HPP Belum Tercatat" },
    ],
  },
];

/**
 * The "Akuntansi" workspace sidebar. Rendered by `NavigationMenu` (desktop
 * sidebar + mobile "Lainnya" sheet) whenever the current route is an accounting
 * path — see `accounting-routes.ts`. Reuses the same `NavigationGroup` /
 * `NavigationChildItem` primitives as the main menu so behaviour stays identical.
 *
 * The exit control sits in its own zone above a hairline divider, set apart from
 * the menu so "leave the workspace" and "navigate within it" never blur together.
 */
export function AccountingNavigationMenu() {
  const pathname = usePathname();
  const { account } = useGetCurrentAccount();

  const visibleNavGroups = useMemo(
    () => ACCOUNTING_NAV_GROUPS.filter((group) => !group.feature || account?.hasFeature(group.feature)),
    [account],
  );

  const activeGroupId = useMemo(
    () => visibleNavGroups.find((group) => group.matchPrefixes.some((p) => pathname.startsWith(p)))?.id ?? null,
    [pathname, visibleNavGroups],
  );

  const [openGroup, setOpenGroup] = useState<string | null>(activeGroupId);

  // Keep the open group in sync with the route: navigating into a group opens it
  // so its active item is always visible. A manual header toggle doesn't change
  // the pathname, so `activeGroupId` is stable and the user's choice is preserved
  // until the next navigation.
  useEffect(() => {
    setOpenGroup(activeGroupId);
  }, [activeGroupId]);

  const handleOpenChange = (id: string) => setOpenGroup((current) => (current === id ? null : id));

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto scrollbar-hide">
      <AccountingBackButton />
      <hr className="my-3 border-neutral-100" />

      <div className="flex flex-col gap-y-1">
        <NavigationItem
          href="/accounting"
          exact
          label="Ringkasan"
          iconPath="/assets/images/dashboard-icon-neutral-300-w16-h16.svg"
          selectedIconPath="/assets/images/dashboard-icon-primary-300-w16-h16.svg"
        />

        {visibleNavGroups.map((group) => (
          <NavigationGroup
            key={group.id}
            id={group.id}
            label={group.label}
            iconPath={group.iconPath}
            selectedIconPath={group.selectedIconPath}
            matchPrefixes={group.matchPrefixes}
            openGroup={openGroup}
            onOpenChange={handleOpenChange}
          >
            {group.items.map((item) => (
              <NavigationChildItem key={item.href} href={item.href} label={item.label} />
            ))}
          </NavigationGroup>
        ))}
      </div>
    </div>
  );
}
