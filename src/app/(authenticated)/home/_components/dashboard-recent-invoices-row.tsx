"use client";

import clsx from "clsx";
import { useRouter } from "next/navigation";
import { InvoiceStatus } from "@/features/invoice/domain/entities/incoming-invoice";
import { IncomingInvoiceEntity } from "@/features/invoice/domain/entities/incoming-invoice";
import { OutgoingInvoiceEntity } from "@/features/invoice/domain/entities/outgoing-invoice";
import { OutgoingInvoiceStatus } from "@/features/invoice/domain/enums/outgoing-invoice-status";
import { InvoiceChannel } from "@/features/invoice/domain/enums/invoice-channel";
import { PaymentRequestStatus } from "@/features/payment/domain/enums/payment-request";
import { IDRFormatter } from "@/core/utilities/currency/domain/formatters/idr-formatter";
import { deriveInvoicePaymentStatusKind } from "@/features/invoice/presentations/components/invoice-payment-helpers";
import { DashboardRecentInvoicesArrowIcon } from "@/app/(authenticated)/home/_components/dashboard-recent-invoices-arrow-icon";
import { DashboardRecentInvoicesStatusText, InvoiceStatusType } from "@/app/(authenticated)/home/_components/dashboard-recent-invoices-status-text";
import { DateTime } from "luxon";

type RowView = {
  direction: "in" | "out";
  partyName: string;
  total: number;
  status: InvoiceStatusType;
  href: string;
  createdAt: DateTime;
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

function toRowView(inv: IncomingInvoiceEntity | OutgoingInvoiceEntity): RowView {
  if (inv instanceof IncomingInvoiceEntity) {
    return {
      direction: "in",
      partyName: inv.receiver.name,
      total: inv.total,
      status: mapStatus(inv.status),
      href: `/invoices/incoming/${inv.id}`,
      createdAt: inv.createdAt,
    };
  }
  if (inv.channel === InvoiceChannel.POS) {
    return {
      direction: "out",
      partyName: inv.invoiceNumber,
      total: inv.summary.total,
      status: deriveInvoicePaymentStatusKind(inv) === "paid" ? "paid" : "unpaid",
      href: `/sales/pos/${inv.id}`,
      createdAt: inv.createdAt,
    };
  }
  return {
    direction: "out",
    partyName: inv.recipient.fullName,
    total: inv.summary.total,
    status: mapStatus(inv.status),
    href: `/invoices/outgoing/${inv.id}`,
    createdAt: inv.createdAt,
  };
}

interface DashboardRecentInvoicesRowProps {
  invoice: IncomingInvoiceEntity | OutgoingInvoiceEntity;
}

export function DashboardRecentInvoicesRow({ invoice }: DashboardRecentInvoicesRowProps) {
  const router = useRouter();
  const view = toRowView(invoice);

  return (
    <div
      onClick={() => router.push(view.href)}
      className={clsx(
        "grid cursor-pointer grid-cols-[2fr_1fr_1fr] items-center border-b border-l-4 border-neutral-100 border-l-transparent px-6 py-4 last:border-b-0",
        "hover:border-l-primary-300 hover:bg-primary-50",
      )}
    >
      <div className="flex items-center gap-2">
        <div
          className={clsx(
            "flex size-7 shrink-0 items-center justify-center rounded-lg",
            view.direction === "in" ? "bg-success-50" : "bg-warning-50",
          )}
        >
          <DashboardRecentInvoicesArrowIcon
            direction={view.direction}
            className={clsx(view.direction === "in" ? "text-success-400" : "text-warning-400")}
          />
        </div>
        <div className="flex min-w-0 flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="truncate text-sm leading-5 font-semibold text-neutral-500">{view.partyName}</span>
          </div>
          <span className="text-xs leading-4 text-neutral-300">
            {view.createdAt.setLocale("id").toRelative()}
          </span>
        </div>
      </div>

      <span className="text-sm leading-5 font-semibold text-neutral-500">
        {IDRFormatter.toCurrency(view.total)}
      </span>

      <DashboardRecentInvoicesStatusText status={view.status} />
    </div>
  );
}
