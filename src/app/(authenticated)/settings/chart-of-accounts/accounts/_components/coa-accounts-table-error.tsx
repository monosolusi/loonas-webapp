"use client";

import { revalidateSWRKey } from "@/core/helpers/revalidate-swr-key";
import { ACCOUNTING_SWR_KEYS } from "@/features/accounting/presentations/constants/swr-keys";
import { PrimaryButton } from "@/core/presentations/components/buttons/primary-button";

export function CoaAccountsTableError() {
  return (
    <div className="overflow-hidden rounded-xl border border-neutral-100">
      <div className="flex flex-col items-center justify-center gap-y-4 py-16">
        <p className="text-sm font-semibold text-neutral-400">Gagal memuat daftar akun.</p>
        <PrimaryButton
          label="Coba Lagi"
          onClick={() => revalidateSWRKey(ACCOUNTING_SWR_KEYS.LIST_LEDGER_ACCOUNTS)}
          className="w-auto px-6"
        />
      </div>
    </div>
  );
}
