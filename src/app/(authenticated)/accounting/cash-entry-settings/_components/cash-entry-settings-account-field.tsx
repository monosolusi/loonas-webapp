"use client";

import { useMemo } from "react";
import { LedgerAccountEntity } from "@/features/accounting/domain/entities/ledger-account";
import { LedgerAccountCombobox } from "@/features/accounting/presentations/components/ledger-account-combobox";
import { CashEntrySettingsSelection } from "@/app/(authenticated)/accounting/cash-entry-settings/_utils/resolve-settings-form-state";
import { resolveAccountFieldState } from "@/app/(authenticated)/accounting/cash-entry-settings/_utils/resolve-account-field-state";
import { CashEntrySettingsMissingAccountNotice } from "@/app/(authenticated)/accounting/cash-entry-settings/_components/cash-entry-settings-missing-account-notice";
import { CashEntrySettingsFieldError } from "@/app/(authenticated)/accounting/cash-entry-settings/_components/cash-entry-settings-field-error";
import { CashEntrySettingsClearAccountButton } from "@/app/(authenticated)/accounting/cash-entry-settings/_components/cash-entry-settings-clear-account-button";

type CashEntrySettingsAccountFieldProps = {
  label: string;
  placeholder: string;
  /** The provider's resolved selection — the field never re-derives what it means. */
  selection: CashEntrySettingsSelection;
  accounts: ReadonlyArray<LedgerAccountEntity> | null;
  errorMessage: string | null;
  filter: (account: LedgerAccountEntity) => boolean;
  onSelect: (account: LedgerAccountEntity | null) => void;
  /** The account-type constraint this field's picker is pre-filtered to — renders above the error slot. */
  hint?: string;
};

/**
 * Composition only: every display decision comes from `resolveAccountFieldState`, and each
 * state's presentation is its own component that renders nothing when it does not apply.
 */
export function CashEntrySettingsAccountField(props: CashEntrySettingsAccountFieldProps) {
  const state = useMemo(
    () => resolveAccountFieldState(props.selection, props.accounts),
    [props.selection, props.accounts],
  );

  return (
    <div className="flex flex-col gap-y-2">
      <LedgerAccountCombobox
        label={props.label}
        placeholder={props.placeholder}
        value={state.account}
        onChange={props.onSelect}
        filter={props.filter}
      />
      <CashEntrySettingsMissingAccountNotice savedId={state.missingSavedId} />
      {props.hint && <p className="text-xs leading-4 text-neutral-300">{props.hint}</p>}
      <CashEntrySettingsFieldError message={props.errorMessage} />
      <CashEntrySettingsClearAccountButton canClear={state.canClear} onClear={() => props.onSelect(null)} />
    </div>
  );
}
