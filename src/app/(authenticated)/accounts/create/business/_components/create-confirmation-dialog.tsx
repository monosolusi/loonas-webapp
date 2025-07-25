"use client";

import { CreateAccountConfirmationDialog } from "@/features/account/presentation/components/create-account-confirmation-dialog";
import { useCreateBusinessAccountState } from "@/features/account/presentation/providers/create-business-account";

export function CreateConfirmationDialog() {
  const { openConfirmationDialog, setOpenConfirmationDialog } = useCreateBusinessAccountState();

  return (
    <CreateAccountConfirmationDialog
      open={openConfirmationDialog}
      onCloseClick={() => setOpenConfirmationDialog?.(false)}
    />
  );
}
