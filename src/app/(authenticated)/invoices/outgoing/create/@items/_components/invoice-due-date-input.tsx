"use client";

import { DatePickerInput } from "@/core/presentations/components/text-inputs/date-picker-input";
import { useCreateOutgoingInvoice } from "@/app/(authenticated)/invoices/outgoing/create/_providers/create-outgoing-invoice";
import { DateTime } from "luxon";

export function InvoiceDueDateInput() {
  const { invoiceDate, dueDate, setDueDate } = useCreateOutgoingInvoice();

  const handleDateChange = (date?: DateTime) => {
    if (!setDueDate) return;
    if (!date) return;
    if (!invoiceDate) {
      setDueDate(date.startOf("day"));
      return;
    }

    const normalizedInvoiceDate = invoiceDate.startOf("day");
    const normalizedDueDate = date.startOf("day");

    if (normalizedDueDate < normalizedInvoiceDate) return;
    setDueDate(date.startOf("day"));
  };

  return (
    <DatePickerInput
      label="Tanggal Jatuh Tempo"
      value={dueDate}
      onChange={handleDateChange}
      required
    />
  );
}
