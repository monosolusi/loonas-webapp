"use client";

import { ListPageHeader } from "@/core/presentations/components/list-page-header";
import { PrimaryButton } from "@/core/presentations/components/buttons/primary-button";
import { useOverheadAccounts } from "@/app/(authenticated)/accounting/overhead-accounts/_providers/overhead-accounts-provider";

export function OverheadAccountsHeader() {
  const { bufferAccounts, isDirty, isSaving, handleSave } = useOverheadAccounts();

  return (
    <ListPageHeader
      title="Akun Overhead"
      subtitle={isDirty ? "Ada perubahan yang belum disimpan" : `${bufferAccounts.length} akun dipilih`}
      action={
        <PrimaryButton
          label="Simpan"
          loading={isSaving}
          loadingLabel="Menyimpan…"
          disabled={!isDirty}
          onClick={handleSave}
          className="w-full sm:w-auto"
        />
      }
    />
  );
}
