"use client";

import Image from "next/image";
import { PrimaryButton } from "@/core/presentations/components/buttons/primary-button";
import { useCoaAccounts } from "@/app/(authenticated)/chart-of-accounts/accounts/_providers/coa-accounts-provider";

export function CoaAccountsHeader() {
  const { meta, setCreatingOpen } = useCoaAccounts();

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-col gap-y-2">
        <h1 className="text-3xl leading-9 font-bold tracking-tight">Daftar Akun</h1>
        <p className="leading-6 text-neutral-300">{meta ? `${meta.total} akun` : "Memuat..."}</p>
      </div>
      <PrimaryButton
        label="Tambah Akun"
        leftIcon={<Image src="/assets/images/plus-icon-white-w16-h16.svg" alt="" width={16} height={16} />}
        onClick={() => setCreatingOpen(true)}
        className="w-full sm:w-auto"
      />
    </div>
  );
}
