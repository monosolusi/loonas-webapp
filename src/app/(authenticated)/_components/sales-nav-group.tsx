"use client";

import { NavigationGroup } from "@/app/(authenticated)/_components/navigation-group";
import { NavigationChildItem } from "@/app/(authenticated)/_components/navigation-child-item";
import { useGetCurrentAccount } from "@/features/account/presentation/hooks/use-get-current-account";

export function SalesNavGroup() {
  const { account } = useGetCurrentAccount();

  return (
    <NavigationGroup
      label="Penjualan"
      iconPath="/assets/images/invoice-out-icon-neutral-300-w16-h16.svg"
      selectedIconPath="/assets/images/invoice-out-icon-primary-300-w16-h16.svg"
      matchPrefixes={["/pos", "/sales/pos", "/invoices/outgoing"]}
    >
      <NavigationChildItem href="/pos" label="POS" />
      <NavigationChildItem href="/sales/pos" label="Riwayat POS" />
      { account?.hasFeature("legacy_invoicing") && (
        <NavigationChildItem href="/invoices/outgoing" label="Faktur Keluaran" />
      )}
    </NavigationGroup>
  );
}