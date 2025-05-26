"use client";

import React, { useState } from "react";
import { FilledButton } from "@/core/presentations/components/filled-button";
import { NewClientDialog } from "@/features/partner/presentation/components/new-client-dialog";
import { useListPartner } from "@/features/partner/presentation/hooks/use-list-partner";

export function NewClientButton() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const { refreshPartners } = useListPartner();

  const handleCreated = async () => {
    await refreshPartners();
    setDialogOpen(false);
  };

  const handleNewClientClick = () => {
    setDialogOpen(true);
  };

  return (
    <>
      <FilledButton onClick={handleNewClientClick}>
        Tambah Klien Baru
      </FilledButton>
      <NewClientDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onCreated={handleCreated}
      />
    </>
  );
}
