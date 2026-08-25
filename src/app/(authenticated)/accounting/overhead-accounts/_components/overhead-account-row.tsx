"use client";

import { XMarkIcon } from "@heroicons/react/20/solid";
import { LedgerAccountEntity } from "@/features/accounting/domain/entities/ledger-account";
import { ACCOUNT_TYPE_LABELS } from "@/features/accounting/domain/enums/account-type";

type OverheadAccountRowProps = {
  account: LedgerAccountEntity;
  onRemove: () => void;
  disabled?: boolean;
};

export function OverheadAccountRow({ account, onRemove, disabled }: OverheadAccountRowProps) {
  return (
    <div className="grid grid-cols-[100px_1fr_160px_48px] items-center gap-x-4 py-3">
      <span className="text-sm text-neutral-400">{account.code}</span>
      <span className="text-sm font-medium text-neutral-500">{account.name}</span>
      <span className="text-sm text-neutral-400">{ACCOUNT_TYPE_LABELS[account.type]}</span>
      <button
        type="button"
        onClick={onRemove}
        disabled={disabled}
        aria-label={`Hapus ${account.name} dari akun overhead`}
        className="flex size-8 items-center justify-center justify-self-end rounded-lg text-neutral-200 transition-colors hover:bg-neutral-50 hover:text-error-300 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <XMarkIcon className="size-4" />
      </button>
    </div>
  );
}
