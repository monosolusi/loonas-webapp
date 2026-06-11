"use client";

import { NavigationGroup } from "@/app/(authenticated)/_components/navigation-group";
import { NavigationChildItem } from "@/app/(authenticated)/_components/navigation-child-item";
import { useGetCurrentAccount } from "@/features/account/presentation/hooks/use-get-current-account";

export function PurchasingNavGroup() {
  const { account } = useGetCurrentAccount();

  return (
    <NavigationGroup
      label="Pembelian"
      iconPath="/assets/images/invoice-in-icon-neutral-300-w16-h16.svg"
      selectedIconPath="/assets/images/invoice-in-icon-primary-300-w16-h16.svg"
      matchPrefixes={["/purchasing", "/invoices/incoming"]}
    >
      <NavigationChildItem href="/purchasing" label="Order Pembelian" />
      { account?.hasFeature("legacy_invoicing") && (
        <NavigationChildItem href="/invoices/incoming" label="Faktur Masukan" />
      )}
    </NavigationGroup>
  );
}