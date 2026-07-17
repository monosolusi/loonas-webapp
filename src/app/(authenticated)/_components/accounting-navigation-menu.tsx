"use client";

import { useState } from "react";
import { NavigationItem } from "@/app/(authenticated)/_components/navigation-item";
import { NavigationGroup } from "@/app/(authenticated)/_components/navigation-group";
import { NavigationChildItem } from "@/app/(authenticated)/_components/navigation-child-item";
import { AccountingBackButton } from "@/app/(authenticated)/_components/accounting-back-button";

/**
 * The "Akuntansi" workspace sidebar. Rendered by `NavigationMenu` (desktop
 * sidebar + mobile "Lainnya" sheet) whenever the current route is an accounting
 * path — see `accounting-routes.ts`. Groups the accounting menus by an
 * accounting operator's daily workflow. Reuses the same `NavigationGroup` /
 * `NavigationChildItem` primitives as the main menu so behaviour stays identical.
 *
 * The exit control sits in its own zone above a hairline divider, set apart from
 * the menu so "leave the workspace" and "navigate within it" never blur together.
 */
export function AccountingNavigationMenu() {
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const handleOpenChange = (id: string) => setOpenGroup((current) => (current === id ? null : id));

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-y-auto scrollbar-hide">
      <AccountingBackButton />
      <hr className="my-3 border-neutral-100" />

      <div className="flex flex-col gap-y-1">
        <NavigationItem
          href="/accounting"
          label="Ringkasan"
          iconPath="/assets/images/dashboard-icon-neutral-300-w16-h16.svg"
          selectedIconPath="/assets/images/dashboard-icon-primary-300-w16-h16.svg"
        />

        <NavigationGroup
          id="acc-journals-ledger"
          label="Jurnal & Buku Besar"
          iconPath="/assets/images/book-icon-neutral-300-w16-h16.svg"
          selectedIconPath="/assets/images/book-icon-primary-300-w16-h16.svg"
          matchPrefixes={["/finance/journals", "/finance/ledger", "/finance/opening-balance"]}
          openGroup={openGroup}
          onOpenChange={handleOpenChange}
        >
          <NavigationChildItem href="/finance/journals" label="Jurnal Umum" />
          <NavigationChildItem href="/finance/ledger" label="Buku Besar" />
          <NavigationChildItem href="/finance/opening-balance" label="Saldo Awal" />
        </NavigationGroup>

        <NavigationGroup
          id="acc-costs-profitability"
          label="Biaya & Profitabilitas"
          iconPath="/assets/images/coins-icon-neutral-300-w16-h16.svg"
          selectedIconPath="/assets/images/coins-icon-primary-300-w16-h16.svg"
          matchPrefixes={["/finance/fixed-costs", "/settings/fixed-costs", "/finance/profitability"]}
          openGroup={openGroup}
          onOpenChange={handleOpenChange}
        >
          <NavigationChildItem href="/finance/fixed-costs" label="Biaya Tetap" />
          <NavigationChildItem href="/settings/fixed-costs" label="Jenis Biaya Tetap" />
          <NavigationChildItem href="/finance/profitability" label="Profitabilitas" />
        </NavigationGroup>

        <NavigationGroup
          id="acc-tax"
          label="Pajak"
          iconPath="/assets/images/percent-icon-neutral-300-w16-h16.svg"
          selectedIconPath="/assets/images/percent-icon-primary-300-w16-h16.svg"
          matchPrefixes={["/finance/pph-final", "/settings/tax-posture"]}
          openGroup={openGroup}
          onOpenChange={handleOpenChange}
        >
          <NavigationChildItem href="/finance/pph-final" label="PPh Final UMKM" />
          <NavigationChildItem href="/settings/tax-posture" label="Postur Pajak" />
        </NavigationGroup>

        <NavigationGroup
          id="acc-chart-of-accounts"
          label="Bagan Akun"
          iconPath="/assets/images/list-tree-icon-neutral-300-w16-h16.svg"
          selectedIconPath="/assets/images/list-tree-icon-primary-300-w16-h16.svg"
          matchPrefixes={["/chart-of-accounts"]}
          openGroup={openGroup}
          onOpenChange={handleOpenChange}
        >
          <NavigationChildItem href="/chart-of-accounts/accounts" label="Daftar Akun" />
          <NavigationChildItem href="/chart-of-accounts/mappings" label="Pemetaan Akun" />
        </NavigationGroup>

        <NavigationGroup
          id="acc-period-reports"
          label="Periode & Laporan"
          iconPath="/assets/images/report-icon-neutral-300-w16-h16.svg"
          selectedIconPath="/assets/images/report-icon-primary-300-w16-h16.svg"
          matchPrefixes={["/finance/periods", "/finance/reports"]}
          openGroup={openGroup}
          onOpenChange={handleOpenChange}
        >
          <NavigationChildItem href="/finance/periods" label="Periode Akuntansi" />
          <NavigationChildItem href="/finance/reports" label="Laporan Keuangan" />
        </NavigationGroup>
      </div>
    </div>
  );
}
