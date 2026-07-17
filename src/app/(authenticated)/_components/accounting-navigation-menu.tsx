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
          iconPath="/assets/images/chart-icon-neutral-300-w16-h16.svg"
          selectedIconPath="/assets/images/chart-icon-primary-300-w16-h16.svg"
          matchPrefixes={["/accounting/journals", "/accounting/ledger", "/accounting/opening-balance"]}
          openGroup={openGroup}
          onOpenChange={handleOpenChange}
        >
          <NavigationChildItem href="/accounting/journals" label="Jurnal Umum" />
          <NavigationChildItem href="/accounting/ledger" label="Buku Besar" />
          <NavigationChildItem href="/accounting/opening-balance" label="Saldo Awal" />
        </NavigationGroup>

        <NavigationGroup
          id="acc-costs-profitability"
          label="Biaya & Profitabilitas"
          iconPath="/assets/images/chart-icon-neutral-300-w16-h16.svg"
          selectedIconPath="/assets/images/chart-icon-primary-300-w16-h16.svg"
          matchPrefixes={["/accounting/fixed-costs", "/accounting/fixed-cost-types", "/accounting/profitability"]}
          openGroup={openGroup}
          onOpenChange={handleOpenChange}
        >
          <NavigationChildItem href="/accounting/fixed-costs" label="Biaya Tetap" />
          <NavigationChildItem href="/accounting/fixed-cost-types" label="Jenis Biaya Tetap" />
          <NavigationChildItem href="/accounting/profitability" label="Profitabilitas" />
        </NavigationGroup>

        <NavigationGroup
          id="acc-tax"
          label="Pajak"
          iconPath="/assets/images/chart-icon-neutral-300-w16-h16.svg"
          selectedIconPath="/assets/images/chart-icon-primary-300-w16-h16.svg"
          matchPrefixes={["/accounting/pph-final", "/accounting/tax-posture"]}
          openGroup={openGroup}
          onOpenChange={handleOpenChange}
        >
          <NavigationChildItem href="/accounting/pph-final" label="PPh Final UMKM" />
          <NavigationChildItem href="/accounting/tax-posture" label="Postur Pajak" />
        </NavigationGroup>

        <NavigationGroup
          id="acc-chart-of-accounts"
          label="Bagan Akun"
          iconPath="/assets/images/chart-icon-neutral-300-w16-h16.svg"
          selectedIconPath="/assets/images/chart-icon-primary-300-w16-h16.svg"
          matchPrefixes={["/accounting/accounts", "/accounting/mappings"]}
          openGroup={openGroup}
          onOpenChange={handleOpenChange}
        >
          <NavigationChildItem href="/accounting/accounts" label="Daftar Akun" />
          <NavigationChildItem href="/accounting/mappings" label="Pemetaan Akun" />
        </NavigationGroup>

        <NavigationGroup
          id="acc-period-reports"
          label="Periode & Laporan"
          iconPath="/assets/images/chart-icon-neutral-300-w16-h16.svg"
          selectedIconPath="/assets/images/chart-icon-primary-300-w16-h16.svg"
          matchPrefixes={["/accounting/periods", "/accounting/reports"]}
          openGroup={openGroup}
          onOpenChange={handleOpenChange}
        >
          <NavigationChildItem href="/accounting/periods" label="Periode Akuntansi" />
          <NavigationChildItem href="/accounting/reports" label="Laporan Keuangan" />
        </NavigationGroup>
      </div>
    </div>
  );
}
