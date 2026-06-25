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
      matchPrefixes={["/finance/ledger", "/finance/journals", "/finance/fixed-costs", "/finance/reports", "/finance/periods", "/finance/pph-final", "/finance/profitability"]}
    >
      <NavigationChildItem href="/finance/profitability" label="Profitabilitas" />
      <NavigationChildItem href="/finance/ledger" label="Buku Besar" />
      <NavigationChildItem href="/finance/journals" label="Jurnal Umum" />
      <NavigationChildItem href="/finance/pph-final" label="PPh Final UMKM" />
      <NavigationChildItem href="/finance/fixed-costs" label="Biaya Tetap" />
      <NavigationChildItem href="/finance/periods" label="Periode Akuntansi" />
      <hr className="my-1 border-neutral-100" />
      <NavigationChildItem href="/finance/reports" label="Laporan" />
    </NavigationGroup>
  );
}
