"use client";

import { useGetInvoice } from "@/features/invoice/presentations/hooks/use-get-invoice";
import { StatusBanner } from "@/app/(authenticated)/invoices/[id]/disbursement-status/_components/status-banner";
import { IDRFormatter } from "@/core/utilities/currency/domain/formatters/idr-formatter";
import { PaymentRequestStatus } from "@/features/payment/domain/enums/payment-request";
import { InvoiceStatus } from "@/features/invoice/domain/entities/invoice";

type StatusBannerVariant = "pending" | "received" | "processing" | "completed";

interface StatusMapping {
  variant: StatusBannerVariant;
  iconSrc: string;
  title: string;
  description: string;
}

const STATUS_MAP: Record<PaymentRequestStatus, StatusMapping> = {
  [PaymentRequestStatus.PENDING_INVOICE]: {
    variant: "pending",
    title: "Menunggu Pembayaran",
    description: "Silakan unggah faktur",
    iconSrc: "/assets/images/clock-icon-neutral-300-w20-h20.svg",
  },
  [PaymentRequestStatus.PENDING_PAYMENT]: {
    variant: "pending",
    title: "Menunggu Pembayaran",
    description: "Silakan selesaikan pembayaran",
    iconSrc: "/assets/images/clock-icon-neutral-300-w20-h20.svg",
  },
  [PaymentRequestStatus.PAYMENT_RECEIVED_PENDING_DELIVERY]: {
    variant: "processing",
    title: "Sedang Diproses",
    description: "Proses pencairan dana",
    iconSrc: "/assets/images/progress-circle-icon-neutral-500-w28-h28.svg",
  },
  [PaymentRequestStatus.COMPLETED]: {
    variant: "completed",
    title: "Pencairan Selesai",
    description: "Dana berhasil dicairkan",
    iconSrc: "/assets/images/double-check-icon-neutral-500-w18-h18.svg",
  },
  [PaymentRequestStatus.EXPIRED]: {
    variant: "pending",
    title: "Menunggu Pembayaran",
    description: "Silakan selesaikan pembayaran",
    iconSrc: "/assets/images/clock-icon-neutral-300-w20-h20.svg",
  },
  [PaymentRequestStatus.FAILED]: {
    variant: "pending",
    title: "Menunggu Pembayaran",
    description: "Silakan selesaikan pembayaran",
    iconSrc: "/assets/images/clock-icon-neutral-300-w20-h20.svg",
  },
  [PaymentRequestStatus.CANCELLED]: {
    variant: "pending",
    title: "Menunggu Pembayaran",
    description: "Silakan selesaikan pembayaran",
    iconSrc: "/assets/images/clock-icon-neutral-300-w20-h20.svg",
  },
};

const FALLBACK: StatusMapping = {
  variant: "pending",
  title: "Menunggu Pembayaran",
  description: "Silakan selesaikan pembayaran",
  iconSrc: "/assets/images/clock-icon-neutral-300-w20-h20.svg",
};

function getStatusMapping(status: InvoiceStatus): StatusMapping {
  return STATUS_MAP[status as PaymentRequestStatus] ?? FALLBACK;
}

interface StatusBannerImplProps {
  id: string;
}

export function StatusBannerImpl({ id }: StatusBannerImplProps) {
  const { invoice, loading } = useGetInvoice({ id });

  if (loading || !invoice) {
    return (
      <div className="h-[88px] animate-pulse rounded-lg border border-neutral-200 bg-neutral-100" />
    );
  }

  const mapping = getStatusMapping(invoice.status);

  return (
    <StatusBanner
      variant={mapping.variant}
      iconSrc={mapping.iconSrc}
      title={mapping.title}
      description={mapping.description}
      totalAmount={IDRFormatter.toCurrency(invoice.total)}
    />
  );
}
