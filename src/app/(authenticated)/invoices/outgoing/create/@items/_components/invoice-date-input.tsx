import { DateInput } from "@/core/presentations/components/date-input";
import {
  useCreateOutgoingInvoice
} from "@/app/(authenticated)/invoices/outgoing/create/_providers/create-outgoing-invoice";

export function InvoiceDateInput() {
  const { invoiceDate, setInvoiceDate } = useCreateOutgoingInvoice();

  return (
    <DateInput
      title="Tanggal Faktur"
      value={invoiceDate}
      onChange={setInvoiceDate}
      required
    />
  );
}
