"use client";

import clsx from "clsx";
import { useRouter } from "next/navigation";
import { IncomingInvoiceEntity, InvoiceStatus } from "@/features/invoice/domain/entities/incoming-invoice";
import { OutgoingInvoiceEntity } from "@/features/invoice/domain/entities/outgoing-invoice";
import { OutgoingInvoiceStatus } from "@/features/invoice/domain/enums/outgoing-invoice-status";
import { InvoiceChannel } from "@/features/invoice/domain/enums/invoice-channel";
import { PaymentRequestStatus } from "@/features/payment/domain/enums/payment-request";
import { IDRFormatter } from "@/core/utilities/currency/domain/formatters/idr-formatter";
import { deriveInvoicePaymentStatusKind } from "@/features/invoice/presentations/components/invoice-payment-helpers";
import { ActivityIcon } from "@/app/(authenticated)/home/_components/dashboard-recent-activity-icon";
import {
  DashboardRecentInvoicesStatusText,
  InvoiceStatusType,
} from "@/app/(authenticated)/home/_components/dashboard-recent-invoices-status-text";
import { DateTime } from "luxon";

type ActivityKind = "pos" | "incoming" | "outgoing";

type ActivityRowView = {
  kind: ActivityKind;
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

function toActivityView(inv: IncomingInvoiceEntity | OutgoingInvoiceEntity): ActivityRowView {
  if (inv instanceof IncomingInvoiceEntity) {
    return {
      kind: "incoming",
      partyName: inv.receiver.name,
      total: inv.total,
      status: mapStatus(inv.status),
      href: `/invoices/incoming/${inv.id}`,
      createdAt: inv.createdAt,
    };
  }
  if (inv.channel === InvoiceChannel.POS) {
    return {
      kind: "pos",
      partyName: inv.invoiceNumber,
      total: inv.summary.total,
      status: deriveInvoicePaymentStatusKind(inv) === "paid" ? "paid" : "unpaid",
      href: `/sales/pos/${inv.id}`,
      createdAt: inv.createdAt,
    };
  }
  return {
    kind: "outgoing",
    partyName: inv.recipient.fullName,
    total: inv.summary.total,
    status: mapStatus(inv.status),
    href: `/invoices/outgoing/${inv.id}`,
    createdAt: inv.createdAt,
  };
}


interface DashboardRecentActivityRowProps {
  invoice: IncomingInvoiceEntity | OutgoingInvoiceEntity;
}

export function DashboardRecentActivityRow({ invoice }: DashboardRecentActivityRowProps) {
  const router = useRouter();
  const view = toActivityView(invoice);

  return (
    <div
      onClick={() => router.push(view.href)}
      className={clsx(
        "grid cursor-pointer grid-cols-[2fr_1fr_1fr] items-center border-b border-l-4 border-neutral-100 border-l-transparent px-6 py-4 last:border-b-0",
        "hover:border-l-primary-300 hover:bg-primary-50",
      )}
    >
      <div className="flex items-center gap-2">
        <ActivityIcon kind={view.kind} />
        <div className="flex min-w-0 flex-col gap-1">
          <span className="truncate text-sm leading-5 font-semibold text-neutral-500">{view.partyName}</span>
          <span className="text-xs leading-4 text-neutral-300">{view.createdAt.setLocale("id").toRelative()}</span>
        </div>
      </div>

      <span className="text-sm leading-5 font-semibold text-neutral-500">{IDRFormatter.toCurrency(view.total)}</span>

      <DashboardRecentInvoicesStatusText status={view.status} />
    </div>
  );
}
