"use client";

import { NavigationItem } from "@/app/(authenticated)/_components/navigation-item";
import { ACCOUNTING_ENTRY } from "@/app/(authenticated)/_components/accounting-routes";
import { useGetCurrentAccount } from "@/features/account/presentation/hooks/use-get-current-account";

/**
 * The single top-level "Akuntansi" launcher shown in the main menu (replacing the
 * old separate Keuangan + Bagan Akun groups). Navigating to it flips the sidebar
 * into accounting mode. Gated by the `accounting` feature — the same gate the
 * retired accounting nav groups used.
 */
export function AccountingNavEntry() {
  const { account } = useGetCurrentAccount();
  if (!account?.hasFeature("accounting")) return null;

  return (
    <NavigationItem
      href={ACCOUNTING_ENTRY}
      label="Akuntansi"
      iconPath="/assets/images/chart-icon-neutral-300-w16-h16.svg"
      selectedIconPath="/assets/images/chart-icon-primary-300-w16-h16.svg"
    />
  );
}
