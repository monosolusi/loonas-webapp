"use client";

import { useEffect, useState } from "react";
import { ServerError } from "@/core/resources/server-error";
import { useToast } from "@/core/presentations/hooks/use-toast";
import { revalidateSWRKey } from "@/core/helpers/revalidate-swr-key";
import { ACCOUNTING_SWR_KEYS } from "@/features/accounting/presentations/constants/swr-keys";
import { useCreateLedgerAccount } from "@/features/accounting/presentations/hooks/use-create-ledger-account";
import { LedgerAccountEntity } from "@/features/accounting/domain/entities/ledger-account";
import { AccountType } from "@/features/accounting/domain/enums/account-type";
import { CoaAccountFormDialog } from "@/app/(authenticated)/chart-of-accounts/accounts/_components/coa-account-form-dialog";
import { useCoaAccounts } from "@/app/(authenticated)/chart-of-accounts/accounts/_providers/coa-accounts-provider";

export function CoaAccountCreateDialog() {
  const { showToast } = useToast();
  const { creatingOpen, setCreatingOpen } = useCoaAccounts();
  const { trigger, isMutating } = useCreateLedgerAccount();

  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const [type, setType] = useState<AccountType | "">("");
  const [parentAccount, setParentAccount] = useState<LedgerAccountEntity | null>(null);
  const [fieldError, setFieldError] = useState<string | null>(null);

  useEffect(() => {
    if (!creatingOpen) {
      setCode("");
      setName("");
      setType("");
      setParentAccount(null);
      setFieldError(null);
    }
  }, [creatingOpen]);

  const handleClose = () => {
    if (isMutating) return;
    setCreatingOpen(false);
  };

  const handleSubmit = async () => {
    if (isMutating || !code.trim() || !name.trim() || !type) return;
    setFieldError(null);
    try {
      await trigger({
        code: code.trim(),
        name: name.trim(),
        type: type as AccountType,
        parentId: parentAccount?.id,
      });
      await revalidateSWRKey(ACCOUNTING_SWR_KEYS.LIST_LEDGER_ACCOUNTS);
      showToast("Akun berhasil ditambahkan.", "success");
      setCreatingOpen(false);
    } catch (err) {
      if (err instanceof ServerError && err.code === "CODE_RESERVED") {
        setFieldError(err.message);
      } else {
        const message = err instanceof ServerError ? err.message : "Terjadi kesalahan jaringan. Silakan coba lagi.";
        showToast(message, "error");
      }
    }
  };

  return (
    <CoaAccountFormDialog
      open={creatingOpen}
      mode="create"
      values={{ code, name, type, parentAccount }}
      isSystem={false}
      submitting={isMutating}
      fieldError={fieldError}
      onChangeCode={setCode}
      onChangeName={setName}
      onChangeType={(v) => { setType(v as AccountType | ""); setFieldError(null); }}
      onChangeParent={setParentAccount}
      onSubmit={handleSubmit}
      onClose={handleClose}
    />
  );
}
