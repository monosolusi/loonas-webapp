"use client";

import { useMemo } from "react";
import {
  SearchCombobox,
  SearchComboboxOption,
} from "@/core/presentations/components/search-combobox";
import { LedgerAccountEntity } from "@/features/accounting/domain/entities/ledger-account";
import { useListLedgerAccounts } from "@/features/accounting/presentations/hooks/use-list-ledger-accounts";

type LedgerAccountOption = SearchComboboxOption & { entity: LedgerAccountEntity };

type LedgerAccountComboboxProps = {
  value: LedgerAccountEntity | null;
  onChange: (value: LedgerAccountEntity | null) => void;
  label?: string;
  noLabel?: boolean;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
};

export function LedgerAccountCombobox(props: LedgerAccountComboboxProps) {
  const { accounts, loading } = useListLedgerAccounts({ limit: 500 });

  const options = useMemo<LedgerAccountOption[]>(
    () =>
      accounts.map((a) => ({
        id: a.id,
        label: `${a.code} — ${a.name}`,
        description: a.type,
        entity: a,
      })),
    [accounts],
  );

  const selected = useMemo<LedgerAccountOption | null>(() => {
    if (!props.value) return null;
    const found = options.find((o) => o.id === props.value!.id);
    if (found) return found;
    // Fallback: build from entity directly so the input shows the current value
    // even before the list of accounts has finished loading.
    return {
      id: props.value.id,
      label: `${props.value.code} — ${props.value.name}`,
      description: props.value.type,
      entity: props.value,
    };
  }, [options, props.value]);

  const handleChange = (option: LedgerAccountOption | null) => {
    props.onChange(option ? option.entity : null);
  };

  if (props.noLabel) {
    return (
      <SearchCombobox<LedgerAccountOption>
        noLabel
        options={options}
        value={selected}
        onChange={handleChange}
        placeholder={props.placeholder ?? "Pilih akun"}
        required={props.required}
        disabled={props.disabled || loading}
      />
    );
  }

  return (
    <SearchCombobox<LedgerAccountOption>
      label={props.label ?? "Akun"}
      options={options}
      value={selected}
      onChange={handleChange}
      placeholder={props.placeholder ?? "Pilih akun"}
      required={props.required}
      disabled={props.disabled || loading}
    />
  );
}
