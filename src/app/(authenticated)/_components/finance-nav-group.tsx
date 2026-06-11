"use client";

import { NavigationGroup } from "@/app/(authenticated)/_components/navigation-group";
import { NavigationChildItem } from "@/app/(authenticated)/_components/navigation-child-item";
import { useGetCurrentAccount } from "@/features/account/presentation/hooks/use-get-current-account";

export function FinanceNavGroup() {
  const { account } = useGetCurrentAccount();
  if (!account?.hasFeature("accounting")) return null;

  return (
    <NavigationGroup
      label="Keuangan"
      iconPath="/assets/images/chart-icon-neutral-300-w16-h16.svg"
      selectedIconPath="/assets/images/chart-icon-primary-300-w16-h16.svg"
      matchPrefixes={["/finance/ledger", "/finance/journals", "/finance/fixed-costs"]}
    >
      <NavigationChildItem href="/finance/ledger" label="Buku Besar" />
      <NavigationChildItem href="/finance/journals" label="Jurnal Umum" />
      <NavigationChildItem href="/finance/fixed-costs" label="Biaya Tetap" />
    </NavigationGroup>
  );
}
