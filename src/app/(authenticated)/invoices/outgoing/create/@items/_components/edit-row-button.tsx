"use client";

import { PencilSquareIcon } from "@heroicons/react/24/outline";
import React from "react";
import { useCreateOutgoingInvoice } from "@/app/(authenticated)/invoices/outgoing/create/_providers/create-outgoing-invoice";

type EditRowButtonProps = {
  dataIndex: number;
};

export function EditRowButton(props: EditRowButtonProps) {
  const { setCurrentStep, setEditingItemIndex } = useCreateOutgoingInvoice();

  const handleClick = () => {
    setEditingItemIndex?.(props.dataIndex);
    setCurrentStep?.("invoice-details.edit-item");
  };

  return <PencilSquareIcon className="size-5 text-gray-500" onClick={handleClick} />;
}
