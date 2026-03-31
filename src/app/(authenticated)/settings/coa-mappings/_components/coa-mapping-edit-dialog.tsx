"use client";

import { useEffect, useMemo, useState } from "react";
import { PrimaryButton } from "@/core/presentations/components/buttons/primary-button";
import { SecondaryButton } from "@/core/presentations/components/buttons/secondary-button";
import { LoonasDialog } from "@/core/presentations/components/loonas-dialog";
import { DialogFooter } from "@/core/presentations/components/dialog-footer";
import { SearchCombobox, SearchComboboxOption } from "@/core/presentations/components/search-combobox";
import { ACCOUNT_TYPE_LABELS } from "@/features/accounting/domain/enums/account-type";
import { LedgerAccountEntity } from "@/features/accounting/domain/entities/ledger-account";
import { useCoaMappings } from "@/app/(authenticated)/settings/coa-mappings/_providers/coa-mappings-provider";

type AccountOption = SearchComboboxOption & { entity: LedgerAccountEntity };

function toAccountOption(account: LedgerAccountEntity): AccountOption {
  return {
    id: account.id,
    label: `${account.code} ${account.name}`,
    description: ACCOUNT_TYPE_LABELS[account.type],
    entity: account,
  };
}

export function CoaMappingEditDialog() {
  const { editingMapping, setEditingMapping, accounts, handleUpdate } = useCoaMappings();
  const [debitAccount, setDebitAccount] = useState<AccountOption | null>(null);
  const [creditAccount, setCreditAccount] = useState<AccountOption | null>(null);
  const [saving, setSaving] = useState(false);

  const accountOptions = useMemo(() => accounts.map(toAccountOption), [accounts]);

  useEffect(() => {
    if (editingMapping) {
      const debit = accountOptions.find((o) => o.id === editingMapping.debitAccount.id) ?? null;
      const credit = accountOptions.find((o) => o.id === editingMapping.creditAccount.id) ?? null;
      setDebitAccount(debit);
      setCreditAccount(credit);
    }
  }, [editingMapping, accountOptions]);

  const handleClose = () => {
    setDebitAccount(null);
    setCreditAccount(null);
    setEditingMapping(null);
  };

  const handleSave = async () => {
    if (!editingMapping || !debitAccount || !creditAccount || saving) return;
    setSaving(true);
    try {
      await handleUpdate(editingMapping.id, debitAccount.id, creditAccount.id);
    } finally {
      setSaving(false);
    }
  };

  const isValid = debitAccount !== null && creditAccount !== null;

  return (
    <LoonasDialog title="Edit Pemetaan Akun" width="md" open={!!editingMapping} onClose={handleClose}>
      <div className="mt-2 flex flex-col gap-y-4">
        <SearchCombobox
          label="Akun Debit"
          options={accountOptions}
          value={debitAccount}
          onChange={setDebitAccount}
          placeholder="Pilih akun debit..."
        />
        <SearchCombobox
          label="Akun Kredit"
          options={accountOptions}
          value={creditAccount}
          onChange={setCreditAccount}
          placeholder="Pilih akun kredit..."
        />
        <DialogFooter>
          <SecondaryButton outlined label="Batal" onClick={handleClose} />
          <PrimaryButton
            label="Simpan"
            disabled={!isValid}
            loading={saving}
            onClick={handleSave}
            className="w-auto px-6"
          />
        </DialogFooter>
      </div>
    </LoonasDialog>
  );
}
