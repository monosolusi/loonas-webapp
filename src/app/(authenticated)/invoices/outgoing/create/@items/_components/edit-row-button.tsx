"use client";

import { PencilSquareIcon } from "@heroicons/react/24/solid";
import React from "react";
import { DiscountType } from "@/features/invoice/domain/enums/discount-type";
import { TaxType } from "@/features/tax/domain/enums/tax-type";
import { AddItemDialog } from "@/app/(authenticated)/invoices/outgoing/create/@items/_components/add-item-dialog";

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
};

export function EditRowButton(props: EditRowButtonProps) {
  const [dialogOpen, setDialogOpen] = React.useState(false);

  const toggleDialog = () => setDialogOpen((prev) => !prev);

  return (
    <>
      <AddItemDialog open={dialogOpen} onClose={toggleDialog} title={"Ubah Detail Item"} initialValue={props.data} />
      <div className="flex justify-center" onClick={() => toggleDialog()}>
        <PencilSquareIcon className="size-5 text-gray-500" />
      </div>
    </>
  );
}
