"use client";

import { PencilSquareIcon } from "@heroicons/react/24/outline";
import React from "react";
import { DiscountType } from "@/features/invoice/domain/enums/discount-type";
import { TaxType } from "@/features/tax/domain/enums/tax-type";
import { AddItemDialog } from "@/app/(authenticated)/invoices/outgoing/create/@items/_components/add-item-dialog";
import { useCreateOutgoingInvoice } from "@/app/(authenticated)/invoices/outgoing/create/_providers/create-outgoing-invoice";

type Data = {
  name: string;
  description?: string;
  qty: number;
  price: number;
  discountType: DiscountType;
  discount: number;
  taxBase: number;
  tax: number;
  taxType: TaxType;
  total: number;
};

type EditRowButtonProps = {
  data: Data;
  dataIndex: number;
};

export function EditRowButton(props: EditRowButtonProps) {
  const { updateInvoiceItem } = useCreateOutgoingInvoice();
  const [dialogOpen, setDialogOpen] = React.useState(false);

  const toggleDialog = () => setDialogOpen((prev) => !prev);
  const onSubmit = (newData: Data) => {
    updateInvoiceItem?.({ index: props.dataIndex, newData: newData });
    toggleDialog();
  };

  return (
    <>
      <AddItemDialog
        open={dialogOpen}
        onClose={toggleDialog}
        title={"Ubah Detail Item"}
        initialValue={props.data}
        onSubmit={onSubmit}
      />
      <PencilSquareIcon className="size-5 text-gray-500" onClick={() => toggleDialog()} />
    </>
  );
}
