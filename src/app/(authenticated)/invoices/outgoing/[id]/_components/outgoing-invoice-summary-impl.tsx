"use client";

import { useParams } from "next/navigation";
import { useGetInvoice } from "@/features/invoice/presentations/hooks/use-get-invoice";
import { OutgoingInvoiceEntity } from "@/features/invoice/domain/entities/outgoing-invoice";
import { SectionCard } from "@/core/presentations/components/section-card";
import { OutgoingInvoiceSummary } from "@/app/(authenticated)/invoices/outgoing/[id]/_components/outgoing-invoice-summary";
import { IDRFormatter } from "@/core/utilities/currency/domain/formatters/idr-formatter";

export function OutgoingInvoiceSummaryImpl() {
  const { id } = useParams<{ id: string }>();
  const { invoice, loading } = useGetInvoice({ id });

  if (loading || !invoice || !(invoice instanceof OutgoingInvoiceEntity)) {
    return (
      <SectionCard title="Ringkasan Faktur" iconSrc="/assets/images/wallet-icon-primary-300-w16-h16.svg">
        <div className="flex flex-col gap-y-5">
          {/* Status Banner Skeleton */}
          <div className="h-14 w-full animate-pulse rounded-lg bg-neutral-100" />

          {/* Total Skeleton */}
          <div className="flex flex-col gap-y-1">
            <div className="h-4 w-24 animate-pulse rounded bg-neutral-100" />
            <div className="h-8 w-40 animate-pulse rounded bg-neutral-100" />
          </div>

          {/* Breakdown Card Skeleton */}
          <div className="flex flex-col gap-y-3 rounded-lg border border-neutral-100 p-4">
            <div className="flex flex-col gap-y-0.5">
              <div className="h-4 w-20 animate-pulse rounded bg-neutral-100" />
              <div className="h-5 w-32 animate-pulse rounded bg-neutral-100" />
            </div>
            <div className="flex flex-col gap-y-0.5">
              <div className="h-4 w-24 animate-pulse rounded bg-neutral-100" />
              <div className="h-5 w-28 animate-pulse rounded bg-neutral-100" />
            </div>
            <div className="flex flex-col gap-y-0.5">
              <div className="h-4 w-20 animate-pulse rounded bg-neutral-100" />
              <div className="h-5 w-28 animate-pulse rounded bg-neutral-100" />
            </div>
            <div className="flex flex-col gap-y-0.5">
              <div className="h-4 w-16 animate-pulse rounded bg-neutral-100" />
              <div className="h-5 w-24 animate-pulse rounded bg-neutral-100" />
            </div>
            <div className="flex flex-col gap-y-0.5">
              <div className="h-4 w-12 animate-pulse rounded bg-neutral-100" />
              <div className="h-5 w-20 animate-pulse rounded bg-neutral-100" />
            </div>
          </div>
        </div>
      </SectionCard>
    );
  }

  return (
    <SectionCard title="Ringkasan Faktur" iconSrc="/assets/images/wallet-icon-primary-300-w16-h16.svg">
      <OutgoingInvoiceSummary
        total={IDRFormatter.toCurrency(invoice.summary.total)}
        invoiceNumber={invoice.invoiceNumber}
        invoiceDate={invoice.invoiceDate.setLocale("id").toFormat("dd LLLL yyyy")}
        dueDate={invoice.dueDate.setLocale("id").toFormat("dd LLLL yyyy")}
        subtotal={IDRFormatter.toCurrency(invoice.summary.amountBeforeTax)}
        tax={IDRFormatter.toCurrency(invoice.summary.totalTax)}
        status={invoice.status}
        createdAt={invoice.createdAt.setLocale("id").toFormat("dd LLLL yyyy, HH:mm")}
      />
    </SectionCard>
  );
}
