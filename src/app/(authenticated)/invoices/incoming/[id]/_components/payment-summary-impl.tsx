"use client";

import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { useGetInvoice } from "@/features/invoice/presentations/hooks/use-get-invoice";
import { useGetInvoiceTimeline } from "@/features/invoice/presentations/hooks/use-get-invoice-timeline";
import { SectionCard } from "@/core/presentations/components/section-card";
import { PaymentSummary } from "@/app/(authenticated)/invoices/incoming/[id]/_components/payment-summary";
import { PaymentRequestStatus } from "@/features/payment/domain/enums/payment-request";
import { IDRFormatter } from "@/core/utilities/currency/domain/formatters/idr-formatter";
import { InvoiceStatus } from "@/features/invoice/domain/entities/incoming-invoice";
import { InvoiceTimelineStepEntity } from "@/features/invoice/domain/entities/invoice-timeline";
import { isIncomingInvoice } from "@/features/invoice/domain/guards/invoice-guards";
import { PayInType } from "@/features/payment/domain/enums/pay-in-type";

interface PaymentSummaryImplProps {
  id: string;
}

function mapStatus(status: InvoiceStatus): "pending" | "processing" | "completed" {
  switch (status) {
    case PaymentRequestStatus.PAYMENT_RECEIVED_PENDING_DELIVERY:
      return "processing";
    case PaymentRequestStatus.COMPLETED:
      return "completed";
    default:
      return "pending";
  }
}

function getCompletedAt(steps: InvoiceTimelineStepEntity[]): string | undefined {
  const completedSteps = steps.filter((s) => s.isCompleted && s.completedAt);
  if (completedSteps.length === 0) return undefined;

  const lastStep = completedSteps[completedSteps.length - 1];
  if (!lastStep.completedAt) return undefined;

  return lastStep.completedAt.toFormat("dd LLLL yyyy, HH:mm", { locale: "id" });
}

function getPaymentPath(invoiceId: string, type: string): string | null {
  switch (type) {
    case PayInType.VIRTUAL_ACCOUNT:
      return `/invoices/incoming/${invoiceId}/va-pay-in-detail`;
    case PayInType.QRIS:
      return `/invoices/incoming/${invoiceId}/qris-pay-in-detail`;
    case PayInType.CREDIT_CARD_FULL_REDIRECT:
    case PayInType.CREDIT_CARD_FULL_REDIRECT_INSTALLMENT_3_MONTHS:
    case PayInType.CREDIT_CARD_FULL_REDIRECT_INSTALLMENT_6_MONTHS:
    case PayInType.CREDIT_CARD_FULL_REDIRECT_INSTALLMENT_12_MONTHS:
      return `/invoices/incoming/${invoiceId}/cc-enter-card-detail`;
    default:
      return null;
  }
}

export function PaymentSummaryImpl({ id }: PaymentSummaryImplProps) {
  const router = useRouter();
  const { invoice, loading: invoiceLoading } = useGetInvoice({ id });
  const { timeline, loading: timelineLoading } = useGetInvoiceTimeline({ id });

  const handleContinuePayment = useCallback(() => {
    if (!invoice || !isIncomingInvoice(invoice)) return;
    const path = getPaymentPath(id, invoice.paymentMethod.type);
    if (path) router.push(path);
  }, [id, invoice, router]);

  if (invoiceLoading || timelineLoading || !invoice || !timeline || !isIncomingInvoice(invoice)) {
    return (
      <SectionCard title="Ringkasan Pembayaran" iconSrc="/assets/images/wallet-icon-primary-300-w16-h16.svg">
        <div className="flex flex-col gap-y-5">
          {/* Total Tagihan Skeleton */}
          <div className="flex flex-col gap-y-1">
            <div className="h-4 w-24 animate-pulse rounded bg-neutral-100" />
            <div className="h-8 w-40 animate-pulse rounded bg-neutral-100" />
          </div>

          {/* Breakdown Card Skeleton */}
          <div className="flex flex-col gap-y-3 rounded-lg border border-neutral-100 p-4">
            <div className="flex flex-col gap-y-0.5">
              <div className="h-4 w-16 animate-pulse rounded bg-neutral-100" />
              <div className="h-5 w-28 animate-pulse rounded bg-neutral-100" />
            </div>
            <div className="flex flex-col gap-y-0.5">
              <div className="h-4 w-20 animate-pulse rounded bg-neutral-100" />
              <div className="h-5 w-20 animate-pulse rounded bg-neutral-100" />
            </div>
            <div className="flex flex-col gap-y-0.5">
              <div className="h-4 w-28 animate-pulse rounded bg-neutral-100" />
              <div className="h-5 w-36 animate-pulse rounded bg-neutral-100" />
            </div>
          </div>

          {/* Notice Skeleton */}
          <div className="h-9 w-full animate-pulse rounded-lg bg-neutral-100" />

          {/* Button Skeleton */}
          <div className="h-11 w-full animate-pulse rounded-lg bg-neutral-100" />
        </div>
      </SectionCard>
    );
  }

  const uiStatus = mapStatus(invoice.status);
  const completedAt = uiStatus === "completed" ? getCompletedAt(timeline.steps) : undefined;

  return (
    <SectionCard title="Ringkasan Pembayaran" iconSrc="/assets/images/wallet-icon-primary-300-w16-h16.svg">
      <PaymentSummary
        total={IDRFormatter.toCurrency(invoice.total)}
        subtotal={IDRFormatter.toCurrency(invoice.amount)}
        adminFee={IDRFormatter.toCurrency(invoice.fee)}
        paymentMethod={invoice.paymentMethod.title}
        status={uiStatus}
        completedAt={completedAt}
        onContinuePayment={handleContinuePayment}
      />
    </SectionCard>
  );
}
