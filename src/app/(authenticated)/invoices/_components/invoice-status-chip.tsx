import { InvoiceStatus } from "@/features/invoice/domain/entities/incoming-invoice";
import React from "react";

interface InvoiceStatusChipProps {
  status: InvoiceStatus;
}

export function InvoiceStatusChip(props: InvoiceStatusChipProps) {
  const statusChips: Record<InvoiceStatus, { label: string; className: string }> = {
    PENDING_INVOICE: { label: "Menunggu Invoice", className: "bg-neutral-100 text-neutral-400" },
    PENDING_PAYMENT: { label: "Menunggu Pembayaran", className: "bg-warning-50 text-warning-500" },
    PAYMENT_RECEIVED_PENDING_DELIVERY: { label: "Dana Diterima", className: "bg-primary-50 text-primary-500" },
    COMPLETED: { label: "Selesai", className: "bg-success-50 text-success-500" },
    EXPIRED: { label: "Kedaluwarsa", className: "bg-neutral-100 text-neutral-400" },
    FAILED: { label: "Gagal", className: "bg-error-50 text-error-500" },
    CANCELLED: { label: "Dibatalkan", className: "bg-error-50 text-error-500" },
    DRAFT: { label: "Draft", className: "bg-neutral-100 text-neutral-400" },
    READY_TO_SEND: { label: "Dalam Antrian Kirim", className: "bg-neutral-100 text-neutral-400" },
    PENDING_BANK_TRANSFER: { label: "Menunggu Transfer", className: "bg-warning-50 text-warning-500" },
    SENT: { label: "Invoice Terkirim", className: "bg-primary-50 text-primary-400" },
    PAID: { label: "Selesai", className: "bg-success-50 text-success-500" },
  };

  return (
    <span className={`rounded px-2 py-1 ${statusChips[props.status].className}`}>
      {statusChips[props.status].label}
    </span>
  );
}
