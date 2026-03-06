import { InvoiceStatus } from "@/features/invoice/domain/entities/incoming-invoice";
import clsx from "clsx";

interface InvoiceStatusChipProps {
  status: InvoiceStatus;
  compact?: boolean;
}

const STATUS_CONFIG: Record<InvoiceStatus, { label: string; className: string }> = {
  PENDING_INVOICE: { label: "Menunggu Faktur", className: "bg-neutral-100 text-neutral-400" },
  PENDING_PAYMENT: { label: "Menunggu Pembayaran", className: "bg-warning-50 text-warning-500" },
  PAYMENT_RECEIVED_PENDING_DELIVERY: { label: "Diproses", className: "bg-primary-50 text-primary-500" },
  COMPLETED: { label: "Lunas", className: "bg-success-50 text-success-500" },
  EXPIRED: { label: "Kedaluwarsa", className: "bg-error-50 text-error-500" },
  FAILED: { label: "Gagal", className: "bg-error-50 text-error-500" },
  CANCELLED: { label: "Dibatalkan", className: "bg-error-50 text-error-500" },
  DRAFT: { label: "Draft", className: "bg-neutral-100 text-neutral-400" },
  READY_TO_SEND: { label: "Siap Kirim", className: "bg-neutral-100 text-neutral-400" },
  PENDING_BANK_TRANSFER: { label: "Menunggu Transfer", className: "bg-warning-50 text-warning-500" },
  SENT: { label: "Terkirim", className: "bg-primary-50 text-primary-500" },
  PAID: { label: "Lunas", className: "bg-success-50 text-success-500" },
};

const FALLBACK = { label: "Unknown", className: "bg-neutral-100 text-neutral-400" };

export function InvoiceStatusChip({ status, compact }: InvoiceStatusChipProps) {
  const { label, className } = STATUS_CONFIG[status] ?? FALLBACK;

  return (
    <span
      className={clsx(
        className,
        compact ? "rounded-sm px-2 py-0.5 text-xs leading-4 font-medium" : "rounded px-2 py-1",
      )}
    >
      {label}
    </span>
  );
}
