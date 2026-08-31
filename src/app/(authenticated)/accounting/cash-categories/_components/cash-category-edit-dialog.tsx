"use client";

import { useEffect, useState } from "react";
import { LedgerAccountEntity } from "@/features/accounting/domain/entities/ledger-account";
import { CashEntryDirection } from "@/features/accounting/domain/enums/cash-entry-direction";
import { useListAllLedgerAccounts } from "@/features/accounting/presentations/hooks/use-list-all-ledger-accounts";
import { useLatchedValue } from "@/core/presentations/hooks/use-latched-value";
import { useCashCategoriesProvider } from "@/app/(authenticated)/accounting/cash-categories/_providers/cash-categories-provider";
import { CashCategoryEditFormDialog } from "@/app/(authenticated)/accounting/cash-categories/_components/cash-category-edit-form-dialog";

export function CashCategoryEditDialog() {
  const { editingCategory, closeEdit, submitEdit, isUpdating, editError } = useCashCategoriesProvider();
  const { accounts } = useListAllLedgerAccounts();

  const [name, setName] = useState("");
  // `null` = the picker was left untouched, so the PATCH omits `accountId` and the server keeps
  // the current account. Only an explicit pick is sent.
  const [accountId, setAccountId] = useState<string | null>(null);

  useEffect(() => {
    if (editingCategory) {
      setName(editingCategory.name);
      setAccountId(null);
    }
  }, [editingCategory]);

  // Resolve the displayed account by id from the loaded CoA list — `CashCategoryAccountEntity`
  // carries no `type`, so it can never be passed to the combobox as a fabricated account. If the
  // list has not loaded yet this is null and the picker shows its placeholder until it has.
  const currentAccountId = accountId ?? editingCategory?.account.id ?? null;
  const selectedAccount: LedgerAccountEntity | null =
    accounts?.find((account) => account.id === currentAccountId) ?? null;

  // `LoonasDialog`'s panel stays mounted through its 200ms `data-leave` fade while the provider
  // has already nulled `editingCategory` — latch the last non-null values so the closing dialog
  // keeps showing the direction and account the user was just looking at, instead of snapping to
  // the "Kas Masuk" fallback and the picker placeholder mid-fade.
  const direction = useLatchedValue(editingCategory?.direction ?? null);
  const account = useLatchedValue(selectedAccount);

  return (
    <CashCategoryEditFormDialog
      open={!!editingCategory}
      // Only read while the dialog is open (editingCategory is non-null whenever open is true);
      // the fallback keeps the closed render type-safe without inventing visible state.
      direction={direction ?? CashEntryDirection.In}
      name={name}
      account={account}
      loading={isUpdating}
      error={editError?.message ?? null}
      onNameChange={setName}
      onAccountChange={(account) => setAccountId(account?.id ?? null)}
      onSubmit={() => void submitEdit({ name, accountId })}
      onClose={closeEdit}
    />
  );
}
