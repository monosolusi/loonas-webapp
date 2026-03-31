"use client";

import { useMemo, useState } from "react";
import { PrimaryButton } from "@/core/presentations/components/buttons/primary-button";
import { SecondaryButton } from "@/core/presentations/components/buttons/secondary-button";
import { LoonasDialog } from "@/core/presentations/components/loonas-dialog";
import { DialogFooter } from "@/core/presentations/components/dialog-footer";
import { SelectInput } from "@/core/presentations/components/select-input";
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

type CoaMappingCreateDialogProps = {
  open: boolean;
  onClose: () => void;
};

export function CoaMappingCreateDialog({ open, onClose }: CoaMappingCreateDialogProps) {
  const { entityTypes, accounts, handleCreate } = useCoaMappings();
  const [entityType, setEntityType] = useState("");
  const [debitAccount, setDebitAccount] = useState<AccountOption | null>(null);
  const [creditAccount, setCreditAccount] = useState<AccountOption | null>(null);
  const [saving, setSaving] = useState(false);

  const accountOptions = useMemo(() => accounts.map(toAccountOption), [accounts]);

  const entityTypeOptions = useMemo(
    () => entityTypes.map((et) => ({ label: et.label, value: et.type })),
    [entityTypes],
  );

  const handleClose = () => {
    setEntityType("");
    setDebitAccount(null);
    setCreditAccount(null);
    onClose();
  };

  const handleSave = async () => {
    if (!entityType || !debitAccount || !creditAccount || saving) return;
    setSaving(true);
    try {
      await handleCreate(entityType, debitAccount.id, creditAccount.id);
      handleClose();
    } finally {
      setSaving(false);
    }
  };

  const isValid = entityType !== "" && debitAccount !== null && creditAccount !== null;

  return (
    <LoonasDialog title="Tambah Pemetaan Akun" width="md" open={open} onClose={handleClose}>
      <div className="mt-2 flex flex-col gap-y-4">
        <SelectInput
          label="Jenis Transaksi"
          options={entityTypeOptions}
          onChange={setEntityType}
          placeholder="Pilih jenis transaksi..."
          required
        />
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
