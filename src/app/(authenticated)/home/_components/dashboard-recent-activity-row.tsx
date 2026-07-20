"use client";

import clsx from "clsx";
import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { IncomingInvoiceEntity, InvoiceStatus } from "@/features/invoice/domain/entities/incoming-invoice";
import { OutgoingInvoiceEntity } from "@/features/invoice/domain/entities/outgoing-invoice";
import { OutgoingInvoiceStatus } from "@/features/invoice/domain/enums/outgoing-invoice-status";
import { InvoiceChannel } from "@/features/invoice/domain/enums/invoice-channel";
import { PaymentRequestStatus } from "@/features/payment/domain/enums/payment-request";
import { IDRFormatter } from "@/core/utilities/currency/domain/formatters/idr-formatter";
import {
  deriveInvoicePaymentStatusKind,
  formatPayInMethodLabel,
  InvoicePaymentStatusKind,
} from "@/features/invoice/presentations/components/invoice-payment-helpers";
import { DashboardRecentActivityIcon } from "@/app/(authenticated)/home/_components/dashboard-recent-activity-icon";
import {
  DashboardRecentActivityStatusText,
  InvoiceStatusType,
} from "@/app/(authenticated)/home/_components/dashboard-recent-activity-status-text";
import { DateTime } from "luxon";
import { track } from "@/core/analytics";
import type { ActivityTab } from "@/app/(authenticated)/home/_components/dashboard-recent-activity-tabs";

export type ActivityKind = "pos" | "incoming" | "outgoing";

export const DESTINATION_TEMPLATE: Record<ActivityKind, string> = {
  pos: "/sales/pos/:id",
  incoming: "/invoices/incoming/:id",
  outgoing: "/invoices/outgoing/:id",
};

export type ActivityRowView = {
  kind: ActivityKind;
  partyName: string;
  paymentMethod: string;
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

function mapPosPaymentKind(kind: InvoicePaymentStatusKind): InvoiceStatusType {
  switch (kind) {
    case "paid":
      return "paid";
    case "expired":
      return "expired";
    case "failed":
      return "failed";
    default:
      return "unpaid";
  }
}

export function toActivityView(inv: IncomingInvoiceEntity | OutgoingInvoiceEntity): ActivityRowView {
  if (inv instanceof IncomingInvoiceEntity) {
    return {
      kind: "incoming",
      partyName: inv.receiver.name,
      paymentMethod: inv.paymentMethod.title,
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
      paymentMethod: formatPayInMethodLabel(inv.payInDetail?.detail?.type),
      total: inv.summary.total,
      status: mapPosPaymentKind(deriveInvoicePaymentStatusKind(inv)),
      href: `/sales/pos/${inv.id}`,
      createdAt: inv.createdAt,
    };
  }
  return {
    kind: "outgoing",
    partyName: inv.recipient.fullName,
    paymentMethod: formatPayInMethodLabel(inv.payInDetail?.detail?.type),
    total: inv.summary.total,
    status: mapStatus(inv.status),
    href: `/invoices/outgoing/${inv.id}`,
    createdAt: inv.createdAt,
  };
}

interface DashboardRecentActivityRowProps {
  invoice: IncomingInvoiceEntity | OutgoingInvoiceEntity;
  tab: ActivityTab;
  position: number;
}

export function DashboardRecentActivityRow({ invoice, tab, position }: DashboardRecentActivityRowProps) {
  const router = useRouter();
  const view = toActivityView(invoice);

  const handleActivate = useCallback(() => {
    track("recent_activity_row_clicked", {
      tab,
      row_position: position,
      destination: DESTINATION_TEMPLATE[view.kind],
    });
    router.push(view.href);
  }, [tab, position, view.kind, view.href, router]);

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleActivate}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleActivate();
        }
      }}
      className={clsx(
        "grid cursor-pointer grid-cols-[2fr_1fr_1fr_1fr] items-center border-b border-l-4 border-neutral-100 border-l-transparent px-6 py-4 last:border-b-0",
        "hover:border-l-primary-300 hover:bg-primary-50",
        "focus-visible:border-l-primary-300 focus-visible:bg-primary-50 focus:outline-none",
      )}
    >
      <div className="flex items-center gap-2">
        <DashboardRecentActivityIcon kind={view.kind} />
        <div className="flex min-w-0 flex-col gap-1">
          <span className="truncate text-sm leading-5 font-semibold text-neutral-500">{view.partyName}</span>
          <span className="text-xs leading-4 text-neutral-300">{view.createdAt.setLocale("id").toRelative()}</span>
        </div>
      </div>

      <span className="truncate text-sm leading-5 text-neutral-400">{view.paymentMethod}</span>

      <span className="text-sm leading-5 font-semibold text-neutral-500">{IDRFormatter.toCurrency(view.total)}</span>

      <DashboardRecentActivityStatusText status={view.status} />
    </div>
  );
}
