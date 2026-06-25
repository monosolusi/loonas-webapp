"use client";

import { useEffect, useMemo, useState } from "react";
import { ServerError } from "@/core/resources/server-error";
import { useToast } from "@/core/presentations/hooks/use-toast";
import { revalidateSWRKey } from "@/core/helpers/revalidate-swr-key";
import { ACCOUNTING_SWR_KEYS } from "@/features/accounting/presentations/constants/swr-keys";
import { useUpdateLedgerAccount } from "@/features/accounting/presentations/hooks/use-update-ledger-account";
import { LedgerAccountEntity } from "@/features/accounting/domain/entities/ledger-account";
import { AccountType } from "@/features/accounting/domain/enums/account-type";
import { CoaAccountFormDialog } from "@/app/(authenticated)/settings/chart-of-accounts/accounts/_components/coa-account-form-dialog";
import { useCoaAccounts } from "@/app/(authenticated)/settings/chart-of-accounts/accounts/_providers/coa-accounts-provider";

export function CoaAccountEditDialog() {
  const { showToast } = useToast();
  const { editingItem, setEditingItem, accounts } = useCoaAccounts();
  const { trigger, isMutating } = useUpdateLedgerAccount();

  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [type, setType] = useState<AccountType | "">("");
  const [parentAccount, setParentAccount] = useState<LedgerAccountEntity | null>(null);
  const [fieldError, setFieldError] = useState<string | null>(null);

  useEffect(() => {
    if (editingItem) {
      setCode(editingItem.code);
      setName(editingItem.name);
      setType(editingItem.type);
      const parent = editingItem.parentId ? (accounts.find((a) => a.id === editingItem.parentId) ?? null) : null;
      setParentAccount(parent);
      setFieldError(null);
    } else {
      setCode("");
      setName("");
      setType("");
      setParentAccount(null);
      setFieldError(null);
    }
  }, [editingItem, accounts]);

  // Block circular self-parent: exclude the account being edited and all its children
  const excludeIds = useMemo<string[]>(() => {
    if (!editingItem) return [];
    return [editingItem.id];
  }, [editingItem]);

  const handleClose = () => {
    if (isMutating) return;
    setEditingItem(null);
  };

  const handleSubmit = async () => {
    if (!editingItem || isMutating || !code.trim() || !name.trim() || !type) return;
    setFieldError(null);

    // Compute parent sentinel: undefined=unchanged, null=clear, {id}=set new parent
    let parent: { id: string } | null | undefined;
    if (parentAccount === null && editingItem.parentId !== null) {
      parent = null; // clear
    } else if (parentAccount !== null && parentAccount.id !== editingItem.parentId) {
      parent = { id: parentAccount.id }; // set new
    } else {
      parent = undefined; // unchanged
    }

    try {
      await trigger({
        id: editingItem.id,
        name: name.trim() !== editingItem.name ? name.trim() : undefined,
        code: !editingItem.isSystem && code.trim() !== editingItem.code ? code.trim() : undefined,
        type: !editingItem.isSystem && type !== editingItem.type ? (type as AccountType) : undefined,
        parent,
      });
      await revalidateSWRKey(ACCOUNTING_SWR_KEYS.LIST_LEDGER_ACCOUNTS);
      showToast("Akun berhasil diperbarui.", "success");
      setEditingItem(null);
    } catch (err) {
      if (err instanceof ServerError && err.code === "CODE_RESERVED") {
        setFieldError(err.message);
      } else if (err instanceof ServerError && err.code === "SEEDED_ACCOUNT_IMMUTABLE_FIELDS") {
        showToast(err.message, "error");
      } else {
        const message = err instanceof ServerError ? err.message : "Terjadi kesalahan jaringan. Silakan coba lagi.";
        showToast(message, "error");
      }
    }
  };

  return (
    <CoaAccountFormDialog
      open={!!editingItem}
      mode="edit"
      values={{ code, name, type, parentAccount }}
      isSystem={editingItem?.isSystem ?? false}
      submitting={isMutating}
      fieldError={fieldError}
      excludeIds={excludeIds}
      onChangeCode={(v) => { setCode(v); setFieldError(null); }}
      onChangeName={setName}
      onChangeType={(v) => { setType(v as AccountType | ""); setFieldError(null); }}
      onChangeParent={setParentAccount}
      onSubmit={handleSubmit}
      onClose={handleClose}
    />
  );
}
