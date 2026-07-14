"use client";

import { NavigationGroup } from "@/app/(authenticated)/_components/navigation-group";
import { NavigationChildItem } from "@/app/(authenticated)/_components/navigation-child-item";
import { useGetCurrentAccount } from "@/features/account/presentation/hooks/use-get-current-account";

type ChartOfAccountsNavGroupProps = {
  id: string;
  openGroup: string | null;
  onOpenChange: (id: string) => void;
};

export function ChartOfAccountsNavGroup({ id, openGroup, onOpenChange }: ChartOfAccountsNavGroupProps) {
  const { account } = useGetCurrentAccount();
  if (!account?.hasFeature("accounting")) return null;

  return (
    <NavigationGroup
      id={id}
      label="Bagan Akun"
      iconPath="/assets/images/chart-icon-neutral-300-w16-h16.svg"
      selectedIconPath="/assets/images/chart-icon-primary-300-w16-h16.svg"
      matchPrefixes={["/chart-of-accounts"]}
      openGroup={openGroup}
      onOpenChange={onOpenChange}
    >
      <NavigationChildItem href="/chart-of-accounts/accounts" label="Daftar Akun" />
      <NavigationChildItem href="/chart-of-accounts/mappings" label="Pemetaan Akun" />
    </NavigationGroup>
  );
}
