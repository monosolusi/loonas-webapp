import React from "react";
import { PageContent } from "@/core/presentations/components/page-content";
import { AccountListProvider } from "@/features/account/presentation/providers/account-list";
import { PageHeading } from "@/core/presentations/components/page-heading";
import { Accounts } from "@/app/(authenticated)/accounts/select/_components/accounts";


export default function SelectAccountPage() {
  return (
    <AccountListProvider>
      <PageHeading>Akun Kamu</PageHeading>
      <PageContent>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <Accounts />
        </div>
      </PageContent>
    </AccountListProvider>
  );
}