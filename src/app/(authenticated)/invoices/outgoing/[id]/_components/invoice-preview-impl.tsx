"use client";

import { useParams } from "next/navigation";
import { useGetInvoice } from "@/features/invoice/presentations/hooks/use-get-invoice";
import { OutgoingInvoiceEntity } from "@/features/invoice/domain/entities/outgoing-invoice";
import { InvoicePreview } from "@/app/(authenticated)/invoices/_components/invoice-preview";
import { SectionCard } from "@/core/presentations/components/section-card";

export function InvoicePreviewImpl() {
  const { id } = useParams<{ id: string }>();
  const { invoice, loading } = useGetInvoice({ id });

  if (!invoice || loading || !(invoice instanceof OutgoingInvoiceEntity)) {
    return (
      <SectionCard title="Pratinjau Faktur" iconSrc="/assets/images/wallet-icon-primary-300-w16-h16.svg">
        <div className="flex flex-col gap-y-4">
          <div className="h-6 w-48 animate-pulse rounded bg-neutral-100" />
          <div className="h-4 w-full animate-pulse rounded bg-neutral-100" />
          <div className="h-4 w-3/4 animate-pulse rounded bg-neutral-100" />
          <div className="h-64 w-full animate-pulse rounded bg-neutral-100" />
        </div>
      </SectionCard>
    );
  }
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
