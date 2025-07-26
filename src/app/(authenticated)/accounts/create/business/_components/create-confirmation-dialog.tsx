"use client";

import { CreateAccountConfirmationDialog } from "@/features/account/presentation/components/create-account-confirmation-dialog";
import { useCreateBusinessAccountState } from "@/features/account/presentation/providers/create-business-account";
import { useRouter } from "next/navigation";

export function CreateConfirmationDialog() {
  const { openConfirmationDialog, setOpenConfirmationDialog, createAccount } = useCreateBusinessAccountState();
  const router = useRouter();

  const handleCreateAccount = async () => {
    if (!createAccount) return;
    await createAccount();
  };

  return (
    <CreateAccountConfirmationDialog
      open={openConfirmationDialog}
      onCloseClick={() => setOpenConfirmationDialog?.(false)}
      onConfirm={handleCreateAccount}
    />
  );
}
