"use client";

import React from "react";
import { useCreateOutgoingInvoice } from "@/app/(authenticated)/invoices/outgoing/create/_providers/create-outgoing-invoice";

export function AddItemTableButton() {
  const { setCurrentStep } = useCreateOutgoingInvoice();

  const handleClick = () => {
    setCurrentStep?.("invoice-details.add-item");
  };

  return (
    <div className="flex flex-col items-center justify-center" onClick={handleClick}>
      <div className="group flex flex-row items-center space-x-1 rounded-sm px-6 py-3 hover:bg-gray-50">
        <div className="text-primary-default">Tambah Item</div>
      </div>
    </div>
  );
}
