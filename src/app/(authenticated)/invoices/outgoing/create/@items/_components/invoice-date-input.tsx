"use client";

import { DatePickerInput } from "@/core/presentations/components/text-inputs/date-picker-input";
import { useCreateOutgoingInvoice } from "@/app/(authenticated)/invoices/outgoing/create/_providers/create-outgoing-invoice";
import { DateTime } from "luxon";

export function InvoiceDateInput() {
  const { dueDate, invoiceDate, setInvoiceDate } = useCreateOutgoingInvoice();

  const handleDateChange = (date?: DateTime) => {
    if (!setInvoiceDate) return;
    if (!date) return;
    if (!dueDate) {
      setInvoiceDate(date.startOf("day"));
      return;
    }

    const normalizedInvoiceDate = date.startOf("day");
    const normalizedDueDate = dueDate.startOf("day");
    if (normalizedInvoiceDate > normalizedDueDate) return;
    setInvoiceDate(date.startOf("day"));
  };

  return (
    <DatePickerInput
      label="Tanggal Faktur"
      value={invoiceDate}
      onChange={handleDateChange}
      required
    />
  );
}
