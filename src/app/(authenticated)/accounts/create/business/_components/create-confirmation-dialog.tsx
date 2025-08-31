"use client";

import { CreateAccountConfirmationDialog } from "@/features/account/presentation/components/create-account-confirmation-dialog";
import { useCreateBusinessAccountState } from "@/features/account/presentation/providers/create-business-account";

export function CreateConfirmationDialog() {
  const { openConfirmationDialog, setOpenConfirmationDialog, createAccount, isCreating } =
    useCreateBusinessAccountState();

  const handleCreateAccount = async () => {
    if (!createAccount) return;
    await createAccount();
  };

  return (
    <CreateAccountConfirmationDialog
      open={openConfirmationDialog}
      onCloseClick={() => setOpenConfirmationDialog?.(false)}
      onConfirm={handleCreateAccount}
      loading={isCreating}
    />
  );
}
