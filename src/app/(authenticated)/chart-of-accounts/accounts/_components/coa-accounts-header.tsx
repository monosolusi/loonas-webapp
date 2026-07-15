"use client";

import Image from "next/image";
import { ListPageHeader } from "@/core/presentations/components/list-page-header";
import { PrimaryButton } from "@/core/presentations/components/buttons/primary-button";
import { useCoaAccounts } from "@/app/(authenticated)/chart-of-accounts/accounts/_providers/coa-accounts-provider";

export function CoaAccountsHeader() {
  const { meta, setCreatingOpen } = useCoaAccounts();

  return (
    <ListPageHeader
      title="Daftar Akun"
      subtitle={meta ? `${meta.total} akun` : "Memuat..."}
      action={
        <PrimaryButton
          label="Tambah Akun"
          leftIcon={<Image src="/assets/images/plus-icon-white-w16-h16.svg" alt="" width={16} height={16} />}
          onClick={() => setCreatingOpen(true)}
          className="w-full sm:w-auto"
        />
      }
    />
  );
}
