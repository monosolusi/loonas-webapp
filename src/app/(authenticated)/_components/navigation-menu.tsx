"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import { NavigationItem } from "@/app/(authenticated)/_components/navigation-item";
import { NavigationGroup } from "@/app/(authenticated)/_components/navigation-group";
import { NavigationChildItem } from "@/app/(authenticated)/_components/navigation-child-item";
import { KycReviewNavItem } from "@/app/(authenticated)/_components/kyc-review-nav-item";
import { PurchasingNavGroup } from "@/app/(authenticated)/_components/purchasing-nav-group";
import { SalesNavGroup } from "@/app/(authenticated)/_components/sales-nav-group";
import { AccountingNavEntry } from "@/app/(authenticated)/_components/accounting-nav-entry";
import { AccountingNavigationMenu } from "@/app/(authenticated)/_components/accounting-navigation-menu";
import { isAccountingPath } from "@/app/(authenticated)/_components/accounting-routes";
import { InventoryNavGroup } from "@/app/(authenticated)/_components/inventory-nav-group";

/**
 * The full authenticated navigation tree. Shared by the desktop sidebar
 * (`NavigationBar`) and the mobile "Lainnya" bottom sheet (`MobileMoreSheet`)
 * so both surfaces present one identical information architecture.
 *
 * On accounting routes the sidebar swaps into the focused "Akuntansi" workspace
 * (`AccountingNavigationMenu`); everywhere else it shows the main menu, where the
 * accounting groups collapse into a single "Akuntansi" launcher. Both surfaces
 * inherit the swap automatically because they render this one component.
 */
export function NavigationMenu() {
  const pathname = usePathname();
  const [openGroup, setOpenGroup] = useState<string | null>(null);
  const handleOpenChange = (id: string) => setOpenGroup((current) => (current === id ? null : id));

  if (isAccountingPath(pathname)) {
    return <AccountingNavigationMenu />;
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-y-1 overflow-y-auto scrollbar-hide">
      <NavigationItem
        href="/home"
        label="Dashboard"
        iconPath="/assets/images/dashboard-icon-neutral-300-w16-h16.svg"
        selectedIconPath="/assets/images/dashboard-icon-primary-300-w16-h16.svg"
      />
      <PurchasingNavGroup id="purchasing" openGroup={openGroup} onOpenChange={handleOpenChange} />
      <SalesNavGroup id="sales" openGroup={openGroup} onOpenChange={handleOpenChange} />
      <NavigationGroup
        id="products"
        label="Produk"
        iconPath="/assets/images/box-icon-neutral-300-w16-h16.svg"
        selectedIconPath="/assets/images/box-icon-primary-300-w16-h16.svg"
        matchPrefixes={["/products", "/productions"]}
        openGroup={openGroup}
        onOpenChange={handleOpenChange}
      >
        <NavigationChildItem href="/products" label="Semua Produk" />
        <NavigationChildItem href="/productions" label="Produksi" />
      </NavigationGroup>
      <InventoryNavGroup id="inventory" openGroup={openGroup} onOpenChange={handleOpenChange} />
      <AccountingNavEntry />
      <NavigationItem
        href="/accounts"
        label="Manajemen Akun"
        iconPath="/assets/images/people-icon-neutral-300-w16-h16.svg"
        selectedIconPath="/assets/images/people-icon-primary-300-w16-h16.svg"
      />
      <KycReviewNavItem />
      <NavigationItem
        href="/settings"
        label="Pengaturan"
        iconPath="/assets/images/gear-icon-neutral-300-w16-h16.svg"
        selectedIconPath="/assets/images/gear-icon-primary-300-w16-h16.svg"
      />
    </div>
  );
}
