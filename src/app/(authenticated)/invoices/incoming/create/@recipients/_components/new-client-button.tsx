"use client";

import React, { useState } from "react";
import { FilledButton } from "@/core/presentations/components/filled-button";
import { CreateNewPartnerProvider } from "@/features/partner/presentation/providers/create-new-partner";
import {
  NewClientDialog
} from "@/app/(authenticated)/invoices/incoming/create/@recipients/_components/new-client-dialog";
import { useListPartner } from "@/features/partner/presentation/hooks/use-list-partner";


export function NewClientButton() {
  const [open, setOpen] = useState(false);
  const { refreshPartners } = useListPartner();

  function handleNewClientClick() {
    setOpen(true);
  }

  async function handleCreated() {
    // We need to refresh the data
    await refreshPartners?.();
    setOpen(false);
  }

  return (
    <>
      <FilledButton onClick={handleNewClientClick}>
        Buat Klien Baru
      </FilledButton>
      <CreateNewPartnerProvider>
        <NewClientDialog open={open} setOpen={setOpen} onCreated={handleCreated} />
      </CreateNewPartnerProvider>
    </>
  );
}
