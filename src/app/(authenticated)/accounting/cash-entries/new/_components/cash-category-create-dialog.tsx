"use client";

import { useEffect, useMemo, useState } from "react";
import { ServerError } from "@/core/resources/server-error";
import { useToast } from "@/core/presentations/hooks/use-toast";
import { LedgerAccountEntity } from "@/features/accounting/domain/entities/ledger-account";
import { eligibleAccountTypesFor } from "@/features/accounting/domain/helpers/cash-category-eligibility";
import { useListAllLedgerAccounts } from "@/features/accounting/presentations/hooks/use-list-all-ledger-accounts";
import { useCreateCashCategory } from "@/features/accounting/presentations/hooks/use-create-cash-category";
import { useCashEntryCreate } from "@/app/(authenticated)/accounting/cash-entries/new/_providers/cash-entry-create-provider";
import { classifyCreateCategoryError } from "@/app/(authenticated)/accounting/cash-entries/new/_utils/classify-create-error";
import { CashCategoryCreateFormDialog } from "@/app/(authenticated)/accounting/cash-entries/new/_components/cash-category-create-form-dialog";

// Recovery is SWR's own auto-retry (errorRetryInterval backoff) plus revalidateOnFocus — closing and
// reopening this dialog re-mounts nothing, so the copy must promise the automatic reload, not a manual action.
const ACCOUNTS_FETCH_ERROR =
  "Gagal memuat daftar akun. Daftar akan dimuat ulang otomatis beberapa saat lagi, atau saat halaman ini kembali aktif.";

export function CashCategoryCreateDialog() {
  const { showToast } = useToast();
  const { trigger, isMutating } = useCreateCashCategory();
  const { accounts, loading: accountsLoading, error: accountsError } = useListAllLedgerAccounts();
  const { direction, createCategoryDialogOpen, closeCreateCategoryDialog, onCategoryCreated } = useCashEntryCreate();

  const [name, setName] = useState("");
  const [account, setAccount] = useState<LedgerAccountEntity | null>(null);
  const [formError, setFormError] = useState<string | null>(null);

  // ADVISORY pre-filter only — the server owns the real gate (422
  // CASH_CATEGORY_ACCOUNT_TYPE_MISMATCH), so this narrows the picker, it never validates the submit.
  const eligibleTypes = useMemo(() => new Set(eligibleAccountTypesFor(direction)), [direction]);
  const eligibleAccounts = useMemo(
    () => (accounts ?? []).filter((a) => eligibleTypes.has(a.type)),
    [accounts, eligibleTypes],
  );

  // Fresh fields on every open — a cancelled dialog must not leave its half-typed category behind.
  useEffect(() => {
    if (createCategoryDialogOpen) {
      setName("");
      setAccount(null);
      setFormError(null);
    }
  }, [createCategoryDialogOpen]);

  const handleClose = () => {
    if (isMutating) return;
    closeCreateCategoryDialog();
  };

  const handleSubmit = async () => {
    if (isMutating || !name.trim() || !account) return;
    setFormError(null);

    try {
      const created = await trigger({ name: name.trim(), accountId: account.id, direction });
      showToast("Kategori kas berhasil ditambahkan.", "success");
      onCategoryCreated(created);
      closeCreateCategoryDialog();
    } catch (err) {
      if (!(err instanceof ServerError)) {
        showToast("Gagal menambahkan kategori kas. Silakan coba lagi.", "error");
        return;
      }

      const classified = classifyCreateCategoryError(err);
      if (classified.placement === "inline") {
        setFormError(classified.message);
      } else {
        showToast(classified.message, "error");
      }
    }
  };

  return (
    <CashCategoryCreateFormDialog
      open={createCategoryDialogOpen}
      direction={direction}
      name={name}
      account={account}
      accounts={eligibleAccounts}
      accountsLoading={accountsLoading}
      accountsError={accountsError ? ACCOUNTS_FETCH_ERROR : null}
      formError={formError}
      loading={isMutating}
      onNameChange={setName}
      onAccountChange={setAccount}
      onSubmit={handleSubmit}
      onClose={handleClose}
    />
  );
}
