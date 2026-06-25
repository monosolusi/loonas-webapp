"use client";

import { PrimaryButton } from "@/core/presentations/components/buttons/primary-button";
import { useCoaAccounts } from "@/app/(authenticated)/settings/chart-of-accounts/accounts/_providers/coa-accounts-provider";

type CoaAccountsTableEmptyProps = {
  isFiltered: boolean;
  showSeeded: boolean;
};

export function CoaAccountsTableEmpty({ isFiltered, showSeeded }: CoaAccountsTableEmptyProps) {
  const { setCreatingOpen } = useCoaAccounts();

  if (isFiltered) {
    return (
      <div className="overflow-hidden rounded-xl border border-neutral-100">
        <div className="flex flex-col items-center justify-center gap-y-2 py-16">
          <p className="text-sm text-neutral-300">Tidak ditemukan akun dengan pencarian tersebut.</p>
        </div>
      </div>
    );
  }

  if (showSeeded) {
    return (
      <div className="overflow-hidden rounded-xl border border-neutral-100">
        <div className="flex flex-col items-center justify-center gap-y-2 py-16">
          <p className="text-sm text-neutral-300">Belum ada akun bawaan yang tersedia.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-xl border border-neutral-100">
      <div className="flex flex-col items-center justify-center gap-y-4 py-16">
        <div className="flex flex-col items-center gap-y-1">
          <p className="text-sm font-semibold text-neutral-400">Belum ada akun yang ditambahkan.</p>
          <p className="text-sm text-neutral-300">
            Tambah akun pertama untuk mulai mencatat transaksi bisnis Anda.
          </p>
        </div>
        <PrimaryButton label="Tambah Akun" onClick={() => setCreatingOpen(true)} className="w-auto px-6" />
      </div>
    </div>
  );
}
