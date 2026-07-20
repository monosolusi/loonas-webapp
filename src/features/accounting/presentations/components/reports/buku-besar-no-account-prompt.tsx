"use client";

import { BookOpenIcon } from "@heroicons/react/24/outline";
import { LedgerAccountCombobox } from "@/features/accounting/presentations/components/ledger-account-combobox";
import { LedgerAccountEntity } from "@/features/accounting/domain/entities/ledger-account";

type BukuBesarNoAccountPromptProps = {
  account: LedgerAccountEntity | null;
  onAccountChange: (account: LedgerAccountEntity | null) => void;
};

export function BukuBesarNoAccountPrompt({ account, onAccountChange }: BukuBesarNoAccountPromptProps) {
  return (
    <div className="flex flex-col items-center gap-y-6 px-6 py-12 text-center">
      <BookOpenIcon className="size-8 text-neutral-200" aria-hidden="true" />
      <div className="flex flex-col gap-y-1">
        <p className="text-sm font-semibold text-neutral-300">Pilih akun untuk melihat Buku Besar</p>
        <p className="max-w-sm text-sm text-neutral-300">
          Gunakan pencarian di bawah untuk memilih akun yang ingin Anda lihat.
        </p>
      </div>
      <div className="w-full max-w-xs" role="status">
        <LedgerAccountCombobox
          value={account}
          onChange={onAccountChange}
          label="Akun"
          placeholder="Cari kode atau nama akun..."
        />
      </div>
    </div>
  );
}
