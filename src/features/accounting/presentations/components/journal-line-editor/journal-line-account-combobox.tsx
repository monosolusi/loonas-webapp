"use client";

import { useMemo } from "react";
import { SearchCombobox, SearchComboboxOption } from "@/core/presentations/components/search-combobox";
import { LedgerAccountEntity } from "@/features/accounting/domain/entities/ledger-account";
import { toLedgerAccountOptionParts } from "@/features/accounting/domain/helpers/ledger-account-option";
import { useListAllLedgerAccounts } from "@/features/accounting/presentations/hooks/use-list-all-ledger-accounts";
import { AccountFilter } from "@/features/accounting/presentations/components/journal-line-editor/journal-line-editor.types";

type LedgerAccountOption = SearchComboboxOption & { entity: LedgerAccountEntity };

type JournalLineAccountComboboxProps = {
  /** The currently selected account ID (from JournalLineDraft.account_id), or null if unselected. */
  value: string | null;
  onChange: (value: LedgerAccountEntity | null) => void;
  accountFilter?: AccountFilter;
  disabled?: boolean;
  ariaLabel: string;
  autoFocus?: boolean;
};

export function JournalLineAccountCombobox({
  value,
  onChange,
  accountFilter,
  disabled,
  ariaLabel,
  autoFocus,
}: JournalLineAccountComboboxProps) {
  const { accounts, loading } = useListAllLedgerAccounts();

  const options = useMemo<LedgerAccountOption[]>(() => {
    const filtered = accountFilter ? (accounts ?? []).filter(accountFilter) : (accounts ?? []);
    return filtered.map((a) => ({ ...toLedgerAccountOptionParts(a), entity: a }));
  }, [accounts, accountFilter]);

  const selected = useMemo<LedgerAccountOption | null>(() => {
    if (!value) return null;
    // First look in filtered options
    const found = options.find((o) => o.id === value);
    if (found) return found;
    // Fall back to full unfiltered list to keep stale selection visible
    const unfiltered = (accounts ?? []).find((a) => a.id === value);
    if (unfiltered) return { ...toLedgerAccountOptionParts(unfiltered), entity: unfiltered };
    return null;
  }, [options, accounts, value]);

  const handleChange = (option: LedgerAccountOption | null) => {
    onChange(option ? option.entity : null);
  };

  return (
    <div role="group" aria-label={ariaLabel}>
      <SearchCombobox<LedgerAccountOption>
        noLabel
        options={options}
        value={selected}
        onChange={handleChange}
        placeholder="Pilih akun"
        disabled={disabled || loading}
        autoFocus={autoFocus}
      />
    </div>
  );
}
