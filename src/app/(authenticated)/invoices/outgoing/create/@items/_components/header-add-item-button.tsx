"use client";

import { FilledButton } from "@/core/presentations/components/filled-button";
import {
  AddItemDialog,
  ItemDetail
} from "@/app/(authenticated)/invoices/outgoing/create/@items/_components/add-item-dialog";
import { useState } from "react";
import {
  useCreateOutgoingInvoice
} from "@/app/(authenticated)/invoices/outgoing/create/_providers/create-outgoing-invoice";

export function HeaderAddItemButton() {
  const { addInvoiceItem } = useCreateOutgoingInvoice();
  const [open, setOpen] = useState(false);

  const handleClick = () => {
    setOpen(true);
  };

  const handleSubmit = (item: ItemDetail) => {
    addInvoiceItem?.(item);
    setOpen(false);
  };

  return (
    <>
      <FilledButton onClick={handleClick}>
        Tambah Item
      </FilledButton>
      <AddItemDialog
        open={open}
        onSubmit={handleSubmit}
      />
    </>
  );
}
