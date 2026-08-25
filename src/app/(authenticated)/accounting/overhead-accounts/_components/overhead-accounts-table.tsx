"use client";

import { useOverheadAccounts } from "@/app/(authenticated)/accounting/overhead-accounts/_providers/overhead-accounts-provider";
import { OverheadAccountRow } from "@/app/(authenticated)/accounting/overhead-accounts/_components/overhead-account-row";

const COLUMNS = ["Kode", "Nama", "Tipe", ""];

export function OverheadAccountsTable() {
  const { bufferAccounts, removeAccount, isSaving } = useOverheadAccounts();

  return (
    <div className="flex flex-col">
      <div className="grid grid-cols-[100px_1fr_160px_48px] gap-x-4 border-b border-neutral-100 pb-2">
        {COLUMNS.map((label) => (
          <span key={label} className="text-xs leading-4 font-medium tracking-wider text-neutral-300 uppercase">
            {label}
          </span>
        ))}
      </div>
      <div className="flex flex-col divide-y divide-neutral-100">
        {bufferAccounts.map((account) => (
          <OverheadAccountRow
            key={account.id}
            account={account}
            onRemove={() => removeAccount(account.id)}
            disabled={isSaving}
          />
        ))}
      </div>
    </div>
  );
}
