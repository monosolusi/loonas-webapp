"use client";

import { OutgoingInvoiceStatus } from "@/features/invoice/domain/enums/outgoing-invoice-status";

interface OutgoingInvoiceSummaryProps {
  total: string;
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  subtotal: string;
  tax: string;
  status: OutgoingInvoiceStatus;
  createdAt: string;
}

const statusBanners: Record<OutgoingInvoiceStatus, { label: string; bgClass: string; textClass: string; dotClass: string }> = {
  [OutgoingInvoiceStatus.DRAFT]: {
    label: "Draft",
    bgClass: "bg-neutral-50",
    textClass: "text-neutral-400",
    dotClass: "bg-neutral-300",
  },
  [OutgoingInvoiceStatus.READY_TO_SEND]: {
    label: "Dalam Antrian Kirim",
    bgClass: "bg-neutral-50",
    textClass: "text-neutral-400",
    dotClass: "bg-neutral-300",
  },
  [OutgoingInvoiceStatus.SENT]: {
    label: "Invoice Terkirim",
    bgClass: "bg-primary-50",
    textClass: "text-primary-400",
    dotClass: "bg-primary-300",
  },
  [OutgoingInvoiceStatus.PENDING_BANK_TRANSFER]: {
    label: "Menunggu Transfer",
    bgClass: "bg-warning-50",
    textClass: "text-warning-500",
    dotClass: "bg-warning-400",
  },
  [OutgoingInvoiceStatus.PAID]: {
    label: "Selesai",
    bgClass: "bg-success-50",
    textClass: "text-success-500",
    dotClass: "bg-success-400",
  },
  [OutgoingInvoiceStatus.CANCELLED]: {
    label: "Dibatalkan",
    bgClass: "bg-red-50",
    textClass: "text-red-500",
    dotClass: "bg-red-400",
  },
};

export function OutgoingInvoiceSummary({
  total,
  invoiceNumber,
  invoiceDate,
  dueDate,
  subtotal,
  tax,
  status,
  createdAt,
}: OutgoingInvoiceSummaryProps) {
  const banner = statusBanners[status];

  return (
    <div className="flex flex-col gap-y-5">
      {/* Status Banner */}
      <div className={`flex flex-col gap-y-1 rounded-lg px-3 py-2.5 ${banner.bgClass}`}>
        <div className="flex flex-row items-center gap-x-2">
          <span className={`size-2 rounded-full ${banner.dotClass}`} />
          <span className={`text-xs leading-4 font-semibold ${banner.textClass}`}>{banner.label}</span>
        </div>
        <span className={`pl-4 text-xs leading-4 ${banner.textClass}`}>{createdAt}</span>
      </div>

      {/* Total */}
      <div className="flex flex-col gap-y-1">
        <span className="text-xs leading-4 text-neutral-200">Total Faktur</span>
        <span className="text-2xl leading-8 font-semibold tracking-tight">{total}</span>
      </div>

      {/* Breakdown Card */}
      <div className="flex flex-col gap-y-3 rounded-lg border border-neutral-100 p-4">
        <div className="flex flex-col gap-y-0.5">
          <span className="text-xs leading-4 text-neutral-200">Nomor Faktur</span>
          <span className="text-sm leading-5 text-neutral-500">{invoiceNumber}</span>
        </div>
        <div className="flex flex-col gap-y-0.5">
          <span className="text-xs leading-4 text-neutral-200">Tanggal Faktur</span>
          <span className="text-sm leading-5 text-neutral-500">{invoiceDate}</span>
        </div>
        <div className="flex flex-col gap-y-0.5">
          <span className="text-xs leading-4 text-neutral-200">Jatuh Tempo</span>
          <span className="text-sm leading-5 text-neutral-500">{dueDate}</span>
        </div>
        <div className="flex flex-col gap-y-0.5">
          <span className="text-xs leading-4 text-neutral-200">Subtotal</span>
          <span className="text-sm leading-5 text-neutral-500">{subtotal}</span>
        </div>
        <div className="flex flex-col gap-y-0.5">
          <span className="text-xs leading-4 text-neutral-200">Pajak</span>
          <span className="text-sm leading-5 text-neutral-500">{tax}</span>
        </div>
      </div>
    </div>
  );
}
