"use client";

import { FilledButton } from "@/core/presentations/components/filled-button";
import React from "react";
import { CreateConfirmationDialog } from "@/app/(authenticated)/accounts/create/business/_components/create-confirmation-dialog";
import { useCreateBusinessAccountState } from "@/features/account/presentation/providers/create-business-account";

export function CreateButton() {
  const { setOpenConfirmationDialog, isInputClean } = useCreateBusinessAccountState();

  const handleClick = () => {
    if (!setOpenConfirmationDialog) return;
    if (!isInputClean) return;
    if (isInputClean()) setOpenConfirmationDialog(true);
  };

  return (
    <>
      <CreateConfirmationDialog />
      <FilledButton type="button" onClick={handleClick}>
        Buat Akun Bisnis
      </FilledButton>
      ;
    </>
  );
}
