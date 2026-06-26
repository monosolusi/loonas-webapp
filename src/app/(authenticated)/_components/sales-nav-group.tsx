"use client";

import { NavigationGroup } from "@/app/(authenticated)/_components/navigation-group";
import { NavigationChildItem } from "@/app/(authenticated)/_components/navigation-child-item";
import { useGetCurrentAccount } from "@/features/account/presentation/hooks/use-get-current-account";

type SalesNavGroupProps = {
  id: string;
  openGroup: string | null;
  onOpenChange: (id: string) => void;
};

export function SalesNavGroup({ id, openGroup, onOpenChange }: SalesNavGroupProps) {
  const { account } = useGetCurrentAccount();

  return (
    <NavigationGroup
      id={id}
      label="Penjualan"
      iconPath="/assets/images/invoice-out-icon-neutral-300-w16-h16.svg"
      selectedIconPath="/assets/images/invoice-out-icon-primary-300-w16-h16.svg"
      matchPrefixes={["/pos", "/sales/pos", "/invoices/outgoing"]}
      openGroup={openGroup}
      onOpenChange={onOpenChange}
    >
      <NavigationChildItem href="/pos" label="POS" />
      <NavigationChildItem href="/sales/pos" label="Riwayat POS" />
      { account?.hasFeature("legacy_invoicing") && (
        <NavigationChildItem href="/invoices/outgoing" label="Faktur Keluaran" />
      )}
    </NavigationGroup>
  );
}