"use client";

import { DetailPageHeader } from "@/core/presentations/components/detail-page-header";
import { useCoaAccounts } from "@/app/(authenticated)/settings/chart-of-accounts/accounts/_providers/coa-accounts-provider";

export function CoaAccountsHeader() {
  const { meta } = useCoaAccounts();

  return (
    <DetailPageHeader
      backHref="/settings"
      title="Daftar Akun"
      subtitle={meta ? `${meta.total} akun` : undefined}
    />
  );
}
