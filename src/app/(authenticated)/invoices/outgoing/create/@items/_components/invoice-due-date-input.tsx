import { DateInput } from "@/core/presentations/components/date-input";
import {
  useCreateOutgoingInvoice
} from "@/app/(authenticated)/invoices/outgoing/create/_providers/create-outgoing-invoice";

export function InvoiceDueDateInput() {
  const { dueDate, setDueDate } = useCreateOutgoingInvoice();

  return (
    <DateInput
      title="Tanggal Jatuh Tempo"
      value={dueDate}
      onChange={setDueDate}
      required
    />
  );
}
