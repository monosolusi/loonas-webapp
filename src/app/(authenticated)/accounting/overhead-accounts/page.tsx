"use client";

import { useGetCurrentAccount } from "@/features/account/presentation/hooks/use-get-current-account";
import { OverheadAccountsProvider } from "@/app/(authenticated)/accounting/overhead-accounts/_providers/overhead-accounts-provider";
import { OverheadAccountsLoading } from "@/app/(authenticated)/accounting/overhead-accounts/_components/overhead-accounts-loading";
import { OverheadAccountsAccessDenied } from "@/app/(authenticated)/accounting/overhead-accounts/_components/overhead-accounts-access-denied";
import { OverheadAccountsHeader } from "@/app/(authenticated)/accounting/overhead-accounts/_components/overhead-accounts-header";
import { OverheadAccountsAdvisoryNote } from "@/app/(authenticated)/accounting/overhead-accounts/_components/overhead-accounts-advisory-note";
import { OverheadAccountsRejectionBanner } from "@/app/(authenticated)/accounting/overhead-accounts/_components/overhead-accounts-rejection-banner";
import { OverheadAccountsCard } from "@/app/(authenticated)/accounting/overhead-accounts/_components/overhead-accounts-card";
import { OverheadAccountsClearAllDialog } from "@/app/(authenticated)/accounting/overhead-accounts/_components/overhead-accounts-clear-all-dialog";

export default function OverheadAccountsPage() {
  const { account, loading: accountLoading } = useGetCurrentAccount();

  if (accountLoading) return null;
  if (!account?.hasFeature("accounting")) return <OverheadAccountsAccessDenied />;

  return (
    <OverheadAccountsProvider loading={<OverheadAccountsLoading />}>
      <div className="flex flex-col gap-y-6">
        <OverheadAccountsHeader />
        <OverheadAccountsAdvisoryNote />
        <OverheadAccountsRejectionBanner />
        <OverheadAccountsCard />
      </div>
      <OverheadAccountsClearAllDialog />
    </OverheadAccountsProvider>
  );
}
