"use client";

import { NavigationGroup } from "@/app/(authenticated)/_components/navigation-group";
import { NavigationChildItem } from "@/app/(authenticated)/_components/navigation-child-item";
import { useGetCurrentAccount } from "@/features/account/presentation/hooks/use-get-current-account";

export function ChartOfAccountsNavGroup() {
  const { account } = useGetCurrentAccount();
  if (!account?.hasFeature("accounting")) return null;

  return (
    <NavigationGroup
      label="Bagan Akun"
      iconPath="/assets/images/chart-icon-neutral-300-w16-h16.svg"
      selectedIconPath="/assets/images/chart-icon-primary-300-w16-h16.svg"
      matchPrefixes={["/settings/chart-of-accounts"]}
    >
      <NavigationChildItem href="/settings/chart-of-accounts/accounts" label="Daftar Akun" />
      <NavigationChildItem href="/settings/chart-of-accounts/mappings" label="Pemetaan Akun" />
    </NavigationGroup>
  );
}
