"use client";

import { FilledButton } from "@/core/presentations/components/filled-button";
import React, { useMemo, useState } from "react";
import { useCreateOutgoingInvoice } from "@/app/(authenticated)/invoices/outgoing/create/_providers/create-outgoing-invoice";
import { SendOptionsDialog } from "@/app/(authenticated)/invoices/outgoing/create/@review/_components/send-options-dialog";

export function SendOptionsButton() {
  const { recipient, items, paymentConfiguration } = useCreateOutgoingInvoice();
  const [dialogOpen, setDialogOpen] = useState<boolean>(false);

  const isDisabled = useMemo(() => {
    if (!recipient) return true;
    if (items.length === 0) return true;
    if (paymentConfiguration.length === 0) return true;
    return false;
  }, [recipient, items, paymentConfiguration]);

  const handleClick = () => {
    if (isDisabled) return;
    setDialogOpen(true);
  };

  const handleClose = () => {
    setDialogOpen(false);
  };

  return (
    <>
      <FilledButton disabled={isDisabled} onClick={handleClick}>
        Kirim Faktur
      </FilledButton>
      <SendOptionsDialog open={dialogOpen} onClose={handleClose} />
    </>
  );
}
