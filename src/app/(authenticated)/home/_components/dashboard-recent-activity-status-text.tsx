"use client";

import clsx from "clsx";

export type InvoiceStatusType = "paid" | "unpaid" | "sent" | "draft" | "cancelled" | "expired" | "failed";

const statusConfig: Record<InvoiceStatusType, { label: string; className: string }> = {
  paid: { label: "Lunas", className: "text-success-500" },
  unpaid: { label: "Menunggu Pembayaran", className: "text-warning-500" },
  sent: { label: "Terkirim", className: "text-blue-500" },
  draft: { label: "Draft", className: "text-neutral-300" },
  cancelled: { label: "Dibatalkan", className: "text-danger-500" },
  expired: { label: "Kedaluwarsa", className: "text-danger-500" },
  failed: { label: "Gagal", className: "text-danger-500" },
};

interface DashboardRecentActivityStatusTextProps {
  status: InvoiceStatusType;
}

export function DashboardRecentActivityStatusText({ status }: DashboardRecentActivityStatusTextProps) {
  const config = statusConfig[status];
  return <span className={clsx("text-sm leading-5 font-medium", config.className)}>{config.label}</span>;
}
