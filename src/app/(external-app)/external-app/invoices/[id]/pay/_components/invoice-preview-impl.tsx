"use client";

import { InvoicePreview } from "@/app/(authenticated)/invoices/_components/invoice-preview";
import { useGetPublicOutgoingInvoice } from "@/features/invoice/presentations/hooks/use-get-public-outgoing-invoice";
import { useParams } from "next/navigation";

export function InvoicePreviewImpl() {
  const { id } = useParams<{ id: string }>();
  const { loading, invoice } = useGetPublicOutgoingInvoice({ id });

  if (loading || !invoice) return null;
  return (
    <InvoicePreview
      invoice={{
        id: invoice.id,
        invoiceNumber: invoice.invoiceNumber,
        invoiceDate: invoice.invoiceDate,
        dueDate: invoice.dueDate,
        note: invoice.note,
        tnc: invoice.tnc,
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
        name: invoice.recipient.name,
        email: invoice.recipient.email,
        phoneNumber: invoice.recipient.phoneNumber,
      }}
      sender={{
        name: invoice.sender.name,
        address: invoice.sender.address,
      }}
      signature={{
        signerName: invoice.signature.signerName,
        url: invoice.signature.url,
      }}
    />
  );
}
