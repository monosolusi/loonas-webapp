"use client";

import { useMemo } from "react";
import { LedgerAccountCombobox } from "@/features/accounting/presentations/components/ledger-account-combobox";
import { useOverheadAccounts } from "@/app/(authenticated)/accounting/overhead-accounts/_providers/overhead-accounts-provider";

export function OverheadAccountPicker() {
  const { bufferAccounts, addAccount, isSaving } = useOverheadAccounts();

  const excludeIds = useMemo(() => bufferAccounts.map((a) => a.id), [bufferAccounts]);

  return (
    <LedgerAccountCombobox
      noLabel
      value={null}
      onChange={(account) => {
        if (account) addAccount(account);
      }}
      excludeIds={excludeIds}
      placeholder="Cari kode atau nama akun untuk ditambahkan"
      disabled={isSaving}
    />
  );
}
