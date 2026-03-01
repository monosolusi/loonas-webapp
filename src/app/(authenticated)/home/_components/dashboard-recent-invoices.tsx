"use client";

import { SectionCard } from "@/core/presentations/components/section-card";
import { useState } from "react";

type InvoiceType = "Masukan" | "Keluaran";
type FilterType = "Semua" | InvoiceType;
type InvoiceStatusType = "paid" | "unpaid" | "sent" | "draft" | "cancelled" | "expired" | "failed";

interface InvoiceRow {
  id: string;
  client: string;
  type: InvoiceType;
  extraInvoices: number;
  amount: string;
  status: InvoiceStatusType;
  relativeTime: string;
}

const invoices: InvoiceRow[] = [
  {
    id: "1",
    client: "PT Maju Bersama",
    type: "Keluaran",
    extraInvoices: 0,
    amount: "Rp4.500.000",
    status: "unpaid",
    relativeTime: "Hari ini",
  },
  {
    id: "2",
    client: "CV Sentosa Abadi",
    type: "Masukan",
    extraInvoices: 2,
    amount: "Rp8.250.000",
    status: "unpaid",
    relativeTime: "2 hari lalu",
  },
  {
    id: "3",
    client: "PT Cahaya Digital",
    type: "Keluaran",
    extraInvoices: 0,
    amount: "Rp3.200.000",
    status: "sent",
    relativeTime: "3 hari lalu",
  },
  {
    id: "4",
    client: "UD Karya Mandiri",
    type: "Masukan",
    extraInvoices: 1,
    amount: "Rp5.750.000",
    status: "paid",
    relativeTime: "1 minggu lalu",
  },
  {
    id: "5",
    client: "PT Sinar Abadi",
    type: "Keluaran",
    extraInvoices: 0,
    amount: "Rp2.100.000",
    status: "draft",
    relativeTime: "1 minggu lalu",
  },
];

const filters: { label: string; value: FilterType; icon?: "in" | "out" }[] = [
  { label: "Semua", value: "Semua" },
  { label: "Masukan", value: "Masukan", icon: "in" },
  { label: "Keluaran", value: "Keluaran", icon: "out" },
];

const statusConfig: Record<InvoiceStatusType, { label: string; className: string }> = {
  paid: { label: "Lunas", className: "text-success-500" },
  unpaid: { label: "Menunggu Pembayaran", className: "text-warning-500" },
  sent: { label: "Terkirim", className: "text-blue-500" },
  draft: { label: "Draft", className: "text-neutral-300" },
  cancelled: { label: "Dibatalkan", className: "text-danger-500" },
  expired: { label: "Kedaluwarsa", className: "text-danger-500" },
  failed: { label: "Gagal", className: "text-danger-500" },
};

function ArrowIcon({ direction, className }: { direction: "in" | "out"; className?: string }) {
  return (
    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" className={className}>
      {direction === "in" ? (
        <path
          d="M11 3L3 11M3 11H9M3 11V5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ) : (
        <path
          d="M3 11L11 3M11 3H5M11 3V9"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
    </svg>
  );
}

function StatusText({ status }: { status: InvoiceStatusType }) {
  const config = statusConfig[status];
  return <span className={`text-sm leading-5 font-medium ${config.className}`}>{config.label}</span>;
}

export function DashboardRecentInvoices() {
  const [activeFilter, setActiveFilter] = useState<FilterType>("Semua");

  const filtered = activeFilter === "Semua" ? invoices : invoices.filter((inv) => inv.type === activeFilter);

  return (
    <SectionCard
      title="Faktur Terbaru"
      bodyClassName="p-0"
      headerAction={
        <div className="flex items-center gap-1">
          {filters.map((f) => (
            <button
              key={f.value}
              onClick={() => setActiveFilter(f.value)}
              className={`flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                activeFilter === f.value
                  ? "bg-neutral-800 text-white"
                  : "bg-neutral-50 text-neutral-400 hover:bg-neutral-100"
              }`}
            >
              {f.icon && <ArrowIcon direction={f.icon} />}
              {f.label}
            </button>
          ))}
        </div>
      }
    >
      {/* Header */}
      <div className="grid grid-cols-[2fr_1fr_1fr] border-b border-neutral-100 bg-neutral-50 px-6 py-3 text-xs tracking-wide text-neutral-300">
        <span className="font-medium">PIHAK</span>
        <span className="font-medium">NOMINAL</span>
        <span className="font-medium">STATUS</span>
      </div>

      {/* Rows */}
      {filtered.map((inv) => (
        <div
          key={inv.id}
          className="hover:border-l-primary-300 hover:bg-primary-50 grid cursor-pointer grid-cols-[2fr_1fr_1fr] items-center border-b border-l-4 border-neutral-100 border-l-transparent px-6 py-4 last:border-b-0"
        >
          {/* Pihak — icon + client name + relative time */}
          <div className="flex items-center gap-2">
            <div
              className={`flex size-7 shrink-0 items-center justify-center rounded-lg ${inv.type === "Masukan" ? "bg-emerald-50" : "bg-orange-50"}`}
            >
              <ArrowIcon
                direction={inv.type === "Masukan" ? "in" : "out"}
                className={inv.type === "Masukan" ? "text-emerald-500" : "text-orange-500"}
              />
            </div>
            <div className="flex min-w-0 flex-col gap-1">
              <div className="flex items-center gap-2">
                <span className="truncate text-sm leading-5 font-semibold text-neutral-500">{inv.client}</span>
                {inv.extraInvoices > 0 && (
                  <span className="rounded-md bg-neutral-100 px-1.5 py-0.5 text-xs leading-4 font-medium text-neutral-300">
                    +{inv.extraInvoices}
                  </span>
                )}
              </div>
              <span className="text-xs leading-4 text-neutral-300">{inv.relativeTime}</span>
            </div>
          </div>

          {/* Nominal — left-aligned amount */}
          <span className="text-sm leading-5 font-semibold text-neutral-500">{inv.amount}</span>

          {/* Status — colored text */}
          <StatusText status={inv.status} />
        </div>
      ))}
    </SectionCard>
  );
}
