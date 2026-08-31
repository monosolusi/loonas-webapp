"use client";

import { useMemo } from "react";
import { SearchCombobox, SearchComboboxOption } from "@/core/presentations/components/search-combobox";
import { TextInput } from "@/core/presentations/components/text-inputs/text-input";
import { LoonasDialog } from "@/core/presentations/components/loonas-dialog";
import { DialogFooter } from "@/core/presentations/components/dialog-footer";
import { PrimaryButton } from "@/core/presentations/components/buttons/primary-button";
import { SecondaryButton } from "@/core/presentations/components/buttons/secondary-button";
import { LedgerAccountEntity } from "@/features/accounting/domain/entities/ledger-account";
import { ACCOUNT_TYPE_LABELS } from "@/features/accounting/domain/enums/account-type";
import { CashEntryDirection } from "@/features/accounting/domain/enums/cash-entry-direction";

type LedgerAccountOption = SearchComboboxOption & { entity: LedgerAccountEntity };

type CashCategoryCreateFormDialogProps = {
  open: boolean;
  direction: CashEntryDirection;
  name: string;
  account: LedgerAccountEntity | null;
  /** Already narrowed to the account types eligible for `direction` by the caller. */
  accounts: LedgerAccountEntity[];
  accountsLoading: boolean;
  /** Copy for a failed account-list fetch — surfaced instead of leaving an enabled-empty combobox. */
  accountsError: string | null;
  formError: string | null;
  loading: boolean;
  onNameChange: (value: string) => void;
  onAccountChange: (value: LedgerAccountEntity | null) => void;
  onSubmit: () => void;
  onClose: () => void;
};

const DIRECTION_LABELS: Record<CashEntryDirection, string> = {
  [CashEntryDirection.In]: "Kas Masuk",
  [CashEntryDirection.Out]: "Kas Keluar",
};

export function CashCategoryCreateFormDialog({
  open,
  direction,
  name,
  account,
  accounts,
  accountsLoading,
  accountsError,
  formError,
  loading,
  onNameChange,
  onAccountChange,
  onSubmit,
  onClose,
}: CashCategoryCreateFormDialogProps) {
  const accountOptions = useMemo<LedgerAccountOption[]>(
    () =>
      accounts.map((a) => ({
        id: a.id,
        label: `${a.code} — ${a.name}`,
        description: ACCOUNT_TYPE_LABELS[a.type],
        entity: a,
      })),
    [accounts],
  );

  const selectedAccount = useMemo<LedgerAccountOption | null>(
    () => (account ? (accountOptions.find((option) => option.id === account.id) ?? null) : null),
    [account, accountOptions],
  );

  return (
    <LoonasDialog title="Tambah Kategori Kas" width="sm" open={open} onClose={onClose} allowDismiss={!loading}>
      <div className="mt-2 flex flex-col gap-y-4">
        <p className="text-sm text-neutral-500">
          Kategori ini akan tersedia untuk arah <span className="font-medium">{DIRECTION_LABELS[direction]}</span>.
        </p>

        <TextInput
          label="Nama Kategori"
          placeholder="Masukkan nama kategori"
          value={name}
          onChange={onNameChange}
          required
        />

        <div className="flex flex-col gap-y-2">
          <SearchCombobox<LedgerAccountOption>
            label="Akun"
            options={accountOptions}
            value={selectedAccount}
            onChange={(option) => onAccountChange(option ? option.entity : null)}
            placeholder="Pilih akun"
            required
            disabled={accountsLoading || !!accountsError}
            emptyMessage={
              accountsError ? "Akun tidak dapat dimuat" : accountsLoading ? "Memuat akun..." : "Tidak ditemukan"
            }
          />
          {accountsError && <span className="text-xs leading-4 font-normal text-red-500">{accountsError}</span>}
        </div>

        {formError && (
          <div className="border-error-300 bg-error-50 rounded-lg border px-4 py-3">
            <p className="text-error-500 text-sm">{formError}</p>
          </div>
        )}

        <DialogFooter>
          <SecondaryButton outlined type="button" label="Batal" disabled={loading} onClick={onClose} />
          <PrimaryButton
            type="button"
            label="Simpan"
            loading={loading}
            loadingLabel="Menyimpan..."
            disabled={!name.trim() || !account || loading}
            onClick={onSubmit}
            className="px-6"
          />
        </DialogFooter>
      </div>
    </LoonasDialog>
  );
}
