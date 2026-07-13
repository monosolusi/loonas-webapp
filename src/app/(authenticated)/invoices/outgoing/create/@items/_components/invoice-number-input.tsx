import { TextInput } from "@/core/presentations/components/text-inputs/text-input";
import { useCreateOutgoingInvoice } from "@/app/(authenticated)/invoices/outgoing/create/_providers/create-outgoing-invoice";

export function InvoiceNumberInput() {
  const { invoiceNumber, setInvoiceNumber, isEditMode } = useCreateOutgoingInvoice();

  return (
    <TextInput
      placeholder="cth. INV/2025/05/0001"
      label="No. Faktur"
      value={invoiceNumber}
      onChange={setInvoiceNumber}
      disabled={isEditMode}
      description={isEditMode ? "Nomor faktur tidak dapat diubah." : undefined}
    />
  );
}
