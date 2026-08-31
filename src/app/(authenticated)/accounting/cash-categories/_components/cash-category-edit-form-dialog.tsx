"use client";

import { PrimaryButton } from "@/core/presentations/components/buttons/primary-button";
import { SecondaryButton } from "@/core/presentations/components/buttons/secondary-button";
import { TextInput } from "@/core/presentations/components/text-inputs/text-input";
import { LoonasDialog } from "@/core/presentations/components/loonas-dialog";
import { DialogFooter } from "@/core/presentations/components/dialog-footer";
import { LedgerAccountCombobox } from "@/features/accounting/presentations/components/ledger-account-combobox";
import { LedgerAccountEntity } from "@/features/accounting/domain/entities/ledger-account";
import { CashEntryDirection } from "@/features/accounting/domain/enums/cash-entry-direction";
import { eligibleAccountTypesFor } from "@/features/accounting/domain/helpers/cash-category-eligibility";
import { directionLabel } from "@/app/(authenticated)/accounting/cash-categories/_utils/direction-label";

type CashCategoryEditFormDialogProps = {
  open: boolean;
  /** Fixed at create time — displayed read-only, never sent on the PATCH. */
  direction: CashEntryDirection;
  name: string;
  /** The currently-resolved account, or null while the CoA list is loading. */
  account: LedgerAccountEntity | null;
  loading: boolean;
  /** Server copy for a rejected update (409 referenced / 422 account-type mismatch). */
  error: string | null;
  onNameChange: (value: string) => void;
  onAccountChange: (account: LedgerAccountEntity | null) => void;
  onSubmit: () => void;
  onClose: () => void;
};

export function CashCategoryEditFormDialog({
  open,
  direction,
  name,
  account,
  loading,
  error,
  onNameChange,
  onAccountChange,
  onSubmit,
  onClose,
}: CashCategoryEditFormDialogProps) {
  const directionLabelText = directionLabel(direction);

  return (
    <LoonasDialog title="Ubah Kategori Kas" width="sm" open={open} onClose={onClose}>
      <div className="mt-2 flex flex-col gap-y-4">
        {error && (
          <div className="border-error-300/20 bg-error-300/5 rounded-lg border px-4 py-3">
            <p className="text-error-500 text-sm">{error}</p>
          </div>
        )}

        <div className="flex min-w-0 flex-col gap-2">
          <span className="text-base">Arah</span>
          <p className="text-base text-neutral-400">{directionLabelText}</p>
          <p className="text-xs leading-4 text-neutral-300">
            Arah kategori ditentukan saat pembuatan dan tidak dapat diubah.
          </p>
        </div>

        <TextInput
          label="Nama Kategori"
          placeholder="Masukkan nama kategori"
          value={name}
          onChange={onNameChange}
          required
        />

        {/* Advisory pre-filter only: the server still owns the real gate (422 on a mismatched
            account type), so an incompatible pick is a server-authoritative error, never a
            silently diverging FE rule. */}
        <LedgerAccountCombobox
          label="Akun"
          value={account}
          onChange={onAccountChange}
          filter={(candidate) => eligibleAccountTypesFor(direction).includes(candidate.type)}
        />

        <DialogFooter>
          <SecondaryButton outlined label="Batal" onClick={onClose} />
          <PrimaryButton label="Simpan" disabled={!name.trim()} loading={loading} onClick={onSubmit} className="px-6" />
        </DialogFooter>
      </div>
    </LoonasDialog>
  );
}
