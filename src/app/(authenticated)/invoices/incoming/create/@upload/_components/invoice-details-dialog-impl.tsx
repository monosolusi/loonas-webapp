import React, {useState} from "react";
import {
  InvoiceDetailsDialog,
  InvoiceDetailsDialogOnSubmitParams
} from "@/app/(authenticated)/invoices/incoming/create/@upload/_components/invoice-details-dialog";
import {useCreateIncomingInvoice} from "@/features/invoice/presentations/providers/create-incoming-invoice";
import {ErrorCodes, ServerError} from "@/core/resources/server-error";


interface InvoiceDetailsDialogImplProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selectedFile?: File | null;
}

export function InvoiceDetailsDialogImpl(props: InvoiceDetailsDialogImplProps) {
  const {addInvoiceDocument} = useCreateIncomingInvoice();
  const [error, setError] = useState<ServerError>();

  const handleSubmit = (params: InvoiceDetailsDialogOnSubmitParams) => {
    try {
      if (!props.selectedFile) return false;
      if (!addInvoiceDocument) return false;

      addInvoiceDocument({
        file: props.selectedFile,
        invoiceNumber: params.invoiceNumber,
        amount: params.amount,
        dueDate: params.dueDate,
        invoiceDate: params.invoiceDate,
        note: params.note,
      });

      return true;
    } catch (err) {
      if (err instanceof ServerError) setError(err);
      else setError(new ServerError(ErrorCodes.UNKNOWN, {error: err}))
      return false;
    }
  }

  const handleCancel = () => {
    setError(undefined);
    props.setOpen(false);
  }

  return (
    <InvoiceDetailsDialog
      open={props.open}
      setOpen={props.setOpen}
      onSubmit={handleSubmit}
      onCancel={handleCancel}
      error={error}
    />
  );
}
