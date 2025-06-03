import { InvoiceStatus } from "@/features/invoice/domain/entities/invoice";
import React from "react";

interface InvoiceStatusChipProps {
  status: InvoiceStatus;
}

export function InvoiceStatusChip(props: InvoiceStatusChipProps) {
  const statusChips: Record<InvoiceStatus, { label: string; className: string }> = {
    PENDING_INVOICE: { label: "Menunggu Invoice", className: "bg-gray-300 text-gray-800" },
    PENDING_PAYMENT: { label: "Menunggu Pembayaran", className: "bg-yellow-100 text-yellow-700" },
    PAYMENT_RECEIVED_PENDING_DELIVERY: { label: "Dana Diterima", className: "bg-blue-100 text-blue-700" },
    COMPLETED: { label: "Selesai", className: "bg-emerald-100 text-emerald-700" },
    EXPIRED: { label: "Kedaluwarsa", className: "bg-gray-100 text-gray-500" },
    FAILED: { label: "Gagal", className: "bg-red-100 text-red-700" },
    CANCELLED: { label: "Dibatalkan", className: "bg-pink-100 text-pink-700" },
    DRAFT: { label: "Draft", className: "bg-gray-100 text-gray-500" },
    READY_TO_SEND: { label: "Invoice Siap", className: "bg-gray-100 text-gray-500" },
    SENT: { label: "Invoice Terkirim", className: "bg-gray-100 text-gray-500" },
    PAID: { label: "Sudah Dibayar", className: "bg-gray-100 text-gray-500" },
  };

  return (
    <span className={`rounded px-2 py-1 ${statusChips[props.status].className}`}>
      {statusChips[props.status].label}
    </span>
  );
}
