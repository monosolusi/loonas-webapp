import { InvoiceStatus } from "@/features/invoice/domain/entities/incoming-invoice";
import { StatusChip, StatusChipVariant } from "@/core/presentations/components/status-chip";

interface InvoiceStatusChipProps {
  status: InvoiceStatus;
  compact?: boolean;
}

const STATUS_CONFIG: Record<InvoiceStatus, { label: string; variant: StatusChipVariant }> = {
  PENDING_INVOICE: { label: "Menunggu Faktur", variant: "neutral" },
  PENDING_PAYMENT: { label: "Menunggu Pembayaran", variant: "warning" },
  PAYMENT_RECEIVED_PENDING_DELIVERY: { label: "Diproses", variant: "primary" },
  COMPLETED: { label: "Lunas", variant: "success" },
  EXPIRED: { label: "Kedaluwarsa", variant: "error" },
  FAILED: { label: "Gagal", variant: "error" },
  CANCELLED: { label: "Dibatalkan", variant: "error" },
  DRAFT: { label: "Draft", variant: "neutral" },
  READY_TO_SEND: { label: "Siap Kirim", variant: "neutral" },
  PENDING_BANK_TRANSFER: { label: "Menunggu Transfer", variant: "warning" },
  SENT: { label: "Terkirim", variant: "primary" },
  PAID: { label: "Lunas", variant: "success" },
};

const FALLBACK = { label: "Unknown", variant: "neutral" as StatusChipVariant };

export function InvoiceStatusChip({ status, compact }: InvoiceStatusChipProps) {
  const { label, variant } = STATUS_CONFIG[status] ?? FALLBACK;
  return <StatusChip label={label} variant={variant} compact={compact} />;
}
