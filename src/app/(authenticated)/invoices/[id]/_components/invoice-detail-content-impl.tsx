"use client";

import {
  InvoiceDetailContent,
  InvoiceDetailItem
} from "@/app/(authenticated)/invoices/[id]/_components/invoice-detail-content";
import { useMemo } from "react";
import { useGetInvoice } from "@/features/invoice/presentations/providers/get-invoice";

export function InvoiceDetailContentImpl() {
  const { invoice } = useGetInvoice();

  const invoiceDetail: InvoiceDetailItem | null = useMemo(() => {
    if (!invoice) return null;
    if (!invoice.documents) return null;
    return {
      id: invoice.id,
      documents: invoice.documents.map((doc, idx) => ({
        id: doc.id,
        name: doc.file?.name ?? `Dokumen ${idx}`,
        invoiceNumber: doc.invoiceNumber,
        invoiceDate: doc.invoiceDate,
        dueDate: doc.dueDate,
        amount: doc.amount,
        note: doc.note
      })),
      status: invoice.status,
      paymentDetail: {
        receiverName: invoice.receiver.name,
        bankName: invoice.bankAccount.bankName,
        accountNumber: invoice.bankAccount.accountNumber,
        accountHolderName: invoice.bankAccount.accountHolderName,
        total: invoice.amount,
        fee: invoice.fee
      }
    };
  }, [invoice]);

  if (!invoice) return null;
  if (!invoiceDetail) return null;
  return <InvoiceDetailContent data={invoiceDetail} />;
}
