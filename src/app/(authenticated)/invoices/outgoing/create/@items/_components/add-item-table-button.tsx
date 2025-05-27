"use client";

import React, { useState } from "react";
import {
  AddItemDialog,
  ItemDetail
} from "@/app/(authenticated)/invoices/outgoing/create/@items/_components/add-item-dialog";
import {
  useCreateOutgoingInvoice
} from "@/app/(authenticated)/invoices/outgoing/create/_providers/create-outgoing-invoice";

export function AddItemTableButton() {
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
      <div
        className="flex flex-col items-center justify-center"
        onClick={handleClick}
      >
        <div
          className="group flex flex-row items-center space-x-1 rounded-sm px-6 py-3 hover:bg-gray-50"
        >
          <div className="text-primary-default">
            Tambah Item
          </div>
        </div>
      </div>
      <AddItemDialog
        open={open}
        onSubmit={handleSubmit}
        onClose={() => setOpen(false)}
      />
    </>
  );
}
