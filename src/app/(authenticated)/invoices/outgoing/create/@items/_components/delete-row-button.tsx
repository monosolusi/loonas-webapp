"use client";

import { TrashIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { DeleteItemConfirmationDialog } from "@/core/presentations/components/delete-item-confirmation-dialog";
import {
  useCreateOutgoingInvoice
} from "@/app/(authenticated)/invoices/outgoing/create/_providers/create-outgoing-invoice";

type DeleteRowButtonProps = {
  data: { name: string };
  dataIndex: number;
};

export function DeleteRowButton(props: DeleteRowButtonProps) {
  const { deleteInvoiceItem } = useCreateOutgoingInvoice();
  const [dialogOpen, setDialogOpen] = useState(false);

  const toggleDialog = () => setDialogOpen((prev) => !prev);
  const onSubmit = (args: { index: number }) => {
    deleteInvoiceItem?.({ index: args.index });
    toggleDialog();
  };

  return (
    <>
      <DeleteItemConfirmationDialog
        open={dialogOpen}
        onClose={toggleDialog}
        onSubmit={onSubmit}
        data={props.data}
        dataIndex={props.dataIndex}
      />
      <TrashIcon className="size-5 text-neutral-300" onClick={toggleDialog} />
    </>
  );
}
