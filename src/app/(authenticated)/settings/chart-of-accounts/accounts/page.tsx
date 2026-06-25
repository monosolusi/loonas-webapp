"use client";

import { useGetCurrentAccount } from "@/features/account/presentation/hooks/use-get-current-account";
import { CoaAccountsProvider } from "@/app/(authenticated)/settings/chart-of-accounts/accounts/_providers/coa-accounts-provider";
import { CoaAccountsHeader } from "@/app/(authenticated)/settings/chart-of-accounts/accounts/_components/coa-accounts-header";
import { CoaAccountsToolbar } from "@/app/(authenticated)/settings/chart-of-accounts/accounts/_components/coa-accounts-toolbar";
import { CoaAccountsTable } from "@/app/(authenticated)/settings/chart-of-accounts/accounts/_components/coa-accounts-table";
import { CoaAccountsAccessDenied } from "@/app/(authenticated)/settings/chart-of-accounts/accounts/_components/coa-accounts-access-denied";
import { CoaAccountCreateDialog } from "@/app/(authenticated)/settings/chart-of-accounts/accounts/_components/coa-account-create-dialog";
import { CoaAccountEditDialog } from "@/app/(authenticated)/settings/chart-of-accounts/accounts/_components/coa-account-edit-dialog";
import { CoaAccountDeleteDialog } from "@/app/(authenticated)/settings/chart-of-accounts/accounts/_components/coa-account-delete-dialog";

export default function CoaAccountsPage() {
  const { account, loading: accountLoading } = useGetCurrentAccount();

  if (accountLoading) return null;
  if (!account?.hasFeature("accounting")) return <CoaAccountsAccessDenied />;

  return (
    <CoaAccountsProvider>
      <div className="flex flex-col gap-y-6">
        <CoaAccountsHeader />
        <CoaAccountsToolbar />
        <CoaAccountsTable />
      </div>
      <CoaAccountCreateDialog />
      <CoaAccountEditDialog />
      <CoaAccountDeleteDialog />
    </CoaAccountsProvider>
  );
}
