"use client";

import { LedgerAccountEntity } from "@/features/accounting/domain/entities/ledger-account";
import { LedgerAccountCombobox } from "@/features/accounting/presentations/components/ledger-account-combobox";
import { SecondaryButton } from "@/core/presentations/components/buttons/secondary-button";

type CashEntrySettingsAccountFieldProps = {
  label: string;
  placeholder: string;
  account: LedgerAccountEntity | null;
  /** Non-null when the saved default's id is absent from the ledger-account list. */
  missingSavedId: string | null;
  errorMessage: string | null;
  filter: (account: LedgerAccountEntity) => boolean;
  onSelect: (account: LedgerAccountEntity | null) => void;
};

export function CashEntrySettingsAccountField(props: CashEntrySettingsAccountFieldProps) {
  // A stale saved id is clearable even though no account is displayed — clearing it is the
  // remedy that unblocks the save.
  const canClear = props.account !== null || props.missingSavedId !== null;

  return (
    <div className="flex flex-col gap-y-2">
      <LedgerAccountCombobox
        label={props.label}
        placeholder={props.placeholder}
        value={props.account}
        onChange={props.onSelect}
        filter={props.filter}
      />

      {props.missingSavedId && (
        <p role="alert" className="text-xs leading-4 font-normal text-red-500">
          Akun default yang tersimpan tidak ditemukan di daftar akun.
        </p>
      )}
      {props.errorMessage && (
        <p role="alert" className="text-xs leading-4 font-normal text-red-500">
          {props.errorMessage}
        </p>
      )}

      {canClear && (
        <SecondaryButton
          outlined
          type="button"
          label="Kosongkan"
          onClick={() => props.onSelect(null)}
          className="w-auto self-start px-4"
        />
      )}
    </div>
  );
}
