"use client";

import { useParams } from "next/navigation";
import { useGetOutgoingInvoice } from "@/features/invoice/presentations/hooks/use-get-outgoing-invoice";
import { InvoicePreview } from "@/app/(authenticated)/invoices/_components/invoice-preview";

export function InvoicePreviewImpl() {
  const { id } = useParams<{ id: string }>();
  const { invoice, loading } = useGetOutgoingInvoice({ id });

  if (!invoice || loading) return null;
  return (
    <InvoicePreview
      invoice={{
        id: invoice.id,
        invoiceNumber: invoice.invoiceNumber,
        invoiceDate: invoice?.invoiceDate,
        dueDate: invoice?.dueDate,
        note: invoice?.note,
        tnc: invoice?.tnc,
      }}
      items={invoice.items.map((item) => ({
        name: item.name,
        description: item.description,
        qty: item.qty,
        price: item.price,
        taxType: item.taxType,
        tax: item.tax,
        taxBase: item.taxBase,
        total: item.total,
        discountType: item.discountType,
        discount: item.discount,
      }))}
      recipient={{
        name: invoice.recipient.fullName,
        email: invoice.recipient.email ?? "",
        phoneNumber: invoice.recipient.phoneNumber ?? "",
      }}
      sender={{
        name: invoice.sender.fullName,
        address: invoice.sender.address,
      }}
      signature={{
        signerName: invoice.sender.fullName,
        url: invoice.signature?.publicUrl,
      }}
    />
  );
}
