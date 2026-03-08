"use client";

import { SectionCard } from "@/core/presentations/components/section-card";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useListInvoices } from "@/features/invoice/presentations/hooks/use-list-invoices";
import { InvoiceType } from "@/features/invoice/domain/enums/invoice-type";
import { IncomingInvoiceEntity, InvoiceStatus } from "@/features/invoice/domain/entities/incoming-invoice";
import { OutgoingInvoiceEntity } from "@/features/invoice/domain/entities/outgoing-invoice";
import { OutgoingInvoiceStatus } from "@/features/invoice/domain/enums/outgoing-invoice-status";
import { PaymentRequestStatus } from "@/features/payment/domain/enums/payment-request";
import { IDRFormatter } from "@/core/utilities/currency/domain/formatters/idr-formatter";

type InvoiceStatusType = "paid" | "unpaid" | "sent" | "draft" | "cancelled" | "expired" | "failed";

const filters: { label: string; value: InvoiceType | undefined; icon?: "in" | "out" }[] = [
  { label: "Semua", value: undefined },
  { label: "Masukan", value: InvoiceType.INCOMING, icon: "in" },
  { label: "Keluaran", value: InvoiceType.OUTGOING, icon: "out" },
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

function mapStatus(status: InvoiceStatus): InvoiceStatusType {
  switch (status) {
    case OutgoingInvoiceStatus.PAID:
    case PaymentRequestStatus.COMPLETED:
      return "paid";
    case PaymentRequestStatus.PENDING_PAYMENT:
    case PaymentRequestStatus.PENDING_INVOICE:
    case OutgoingInvoiceStatus.PENDING_BANK_TRANSFER:
      return "unpaid";
    case OutgoingInvoiceStatus.SENT:
    case PaymentRequestStatus.PAYMENT_RECEIVED_PENDING_DELIVERY:
      return "sent";
    case OutgoingInvoiceStatus.DRAFT:
    case OutgoingInvoiceStatus.READY_TO_SEND:
      return "draft";
    case OutgoingInvoiceStatus.CANCELLED:
    case PaymentRequestStatus.CANCELLED:
      return "cancelled";
    case PaymentRequestStatus.EXPIRED:
      return "expired";
    case PaymentRequestStatus.FAILED:
      return "failed";
    default:
      return "draft";
  }
}

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

function SkeletonRow() {
  return (
    <div className="grid grid-cols-[2fr_1fr_1fr] items-center border-b border-l-4 border-neutral-100 border-l-transparent px-6 py-4 last:border-b-0">
      <div className="flex items-center gap-2">
        <div className="size-7 shrink-0 animate-pulse rounded-lg bg-neutral-100" />
        <div className="flex flex-col gap-1">
          <div className="h-5 w-32 animate-pulse rounded bg-neutral-100" />
          <div className="h-4 w-20 animate-pulse rounded bg-neutral-100" />
        </div>
      </div>
      <div className="h-5 w-24 animate-pulse rounded bg-neutral-100" />
      <div className="h-5 w-28 animate-pulse rounded bg-neutral-100" />
    </div>
  );
}

export function DashboardRecentInvoices() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState<InvoiceType | undefined>(undefined);
  const { invoices, loading, error } = useListInvoices({ type: activeFilter, limit: 5, includes: "documents" });

  return (
    <SectionCard
      title="Faktur Terbaru"
      bodyClassName="p-0"
      headerAction={
        <div className="flex items-center gap-1">
          {filters.map((f) => (
            <button
              key={f.label}
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

      {/* Loading skeleton */}
      {loading && (
        <>
          <SkeletonRow />
          <SkeletonRow />
          <SkeletonRow />
          <SkeletonRow />
          <SkeletonRow />
        </>
      )}

      {/* Error state */}
      {!loading && error && (
        <div className="px-6 py-10 text-center text-sm text-neutral-300">Gagal memuat data faktur.</div>
      )}

      {/* Empty state */}
      {!loading && !error && invoices?.length === 0 && (
        <div className="px-6 py-10 text-center text-sm text-neutral-300">Belum ada faktur</div>
      )}

      {/* Rows */}
      {!loading &&
        !error &&
        invoices?.map((inv) => {
          const isIncoming = inv instanceof IncomingInvoiceEntity;
          const direction = isIncoming ? "in" : "out";
          const partyName = isIncoming ? (inv as IncomingInvoiceEntity).receiver.name : (inv as OutgoingInvoiceEntity).recipient.fullName;
          const total = isIncoming ? inv.total : (inv as OutgoingInvoiceEntity).summary.total;
          const extraInvoices = isIncoming ? (inv.documents?.length ?? 1) - 1 : 0;

          return (
            <div
              key={inv.id}
              onClick={() => router.push(`/invoices/${isIncoming ? "incoming" : "outgoing"}/${inv.id}`)}
              className="hover:border-l-primary-300 hover:bg-primary-50 grid cursor-pointer grid-cols-[2fr_1fr_1fr] items-center border-b border-l-4 border-neutral-100 border-l-transparent px-6 py-4 last:border-b-0"
            >
              {/* Pihak — icon + client name + relative time */}
              <div className="flex items-center gap-2">
                <div
                  className={`flex size-7 shrink-0 items-center justify-center rounded-lg ${direction === "in" ? "bg-emerald-50" : "bg-orange-50"}`}
                >
                  <ArrowIcon
                    direction={direction}
                    className={direction === "in" ? "text-emerald-500" : "text-orange-500"}
                  />
                </div>
                <div className="flex min-w-0 flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <span className="truncate text-sm leading-5 font-semibold text-neutral-500">{partyName}</span>
                    {extraInvoices > 0 && (
                      <span className="rounded-md bg-neutral-100 px-1.5 py-0.5 text-xs leading-4 font-medium text-neutral-300">
                        +{extraInvoices}
                      </span>
                    )}
                  </div>
                  <span className="text-xs leading-4 text-neutral-300">
                    {inv.createdAt.setLocale("id").toRelative()}
                  </span>
                </div>
              </div>

              {/* Nominal — left-aligned amount */}
              <span className="text-sm leading-5 font-semibold text-neutral-500">
                {IDRFormatter.toCurrency(total)}
              </span>

              {/* Status — colored text */}
              <StatusText status={mapStatus(inv.status)} />
            </div>
          );
        })}
    </SectionCard>
  );
}
