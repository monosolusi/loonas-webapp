"use client";

import { useGetInvoice } from "@/features/invoice/presentations/hooks/use-get-invoice";
import { useGetInvoiceTimeline } from "@/features/invoice/presentations/hooks/use-get-invoice-timeline";
import { StatusBanner } from "@/app/(authenticated)/invoices/[id]/disbursement-status/_components/status-banner";
import { IDRFormatter } from "@/core/utilities/currency/domain/formatters/idr-formatter";

type StatusBannerVariant = "pending" | "received" | "processing" | "completed";

const STATUS_VARIANT_MAP: Record<string, StatusBannerVariant> = {
  INVOICE_CREATED: "pending",
  PAYMENT_RECEIVED: "received",
  DISBURSEMENT_PROCESSING: "processing",
  DISBURSEMENT_COMPLETED: "completed",
};

interface StatusBannerImplProps {
  id: string;
}

export function StatusBannerImpl({ id }: StatusBannerImplProps) {
  const { invoice, loading: invoiceLoading } = useGetInvoice({ id });
  const { timeline, loading: timelineLoading } = useGetInvoiceTimeline({ id });

  if (invoiceLoading || timelineLoading || !invoice || !timeline) {
    return (
      <div className="h-[88px] animate-pulse rounded-lg border border-neutral-200 bg-neutral-100" />
    );
  }

  const { lastCompletedStatus } = timeline;
  const variant = STATUS_VARIANT_MAP[lastCompletedStatus.status] ?? "pending";
  return (
    <StatusBanner
      variant={variant}
      title={lastCompletedStatus.name}
      description={lastCompletedStatus.description}
      totalAmount={IDRFormatter.toCurrency(invoice.total)}
    />
  );
}
