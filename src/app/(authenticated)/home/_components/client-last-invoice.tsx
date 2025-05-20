import Link from "next/link";
import React from "react";
import { DateTime } from "luxon";
import { InvoiceStatus } from "@/features/invoice/domain/entities/invoice";
import { IDRFormatter } from "@/core/utilities/currency/domain/formatters/idr-formatter";

export interface LastInvoiceItem {
  id: string;
  date: DateTime;
  amount: number;
  status: InvoiceStatus;
}

interface ClientLastInvoiceProps {
  data?: LastInvoiceItem;
}

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

export function ClientLastInvoice(props: ClientLastInvoiceProps) {
  const statusChips: Record<InvoiceStatus, { label: string; className: string }> = {
    PENDING_INVOICE: { label: "Menunggu Invoice", className: "bg-gray-300 text-gray-800" },
    PENDING_PAYMENT: { label: "Menunggu Pembayaran", className: "bg-yellow-100 text-yellow-700" },
    PAYMENT_RECEIVED_PENDING_DELIVERY: { label: "Dana Diterima", className: "bg-blue-100 text-blue-700" },
    COMPLETED: { label: "Selesai", className: "bg-emerald-100 text-emerald-700" },
    EXPIRED: { label: "Kedaluwarsa", className: "bg-gray-100 text-gray-500" },
    FAILED: { label: "Gagal", className: "bg-red-100 text-red-700" },
    CANCELLED: { label: "Dibatalkan", className: "bg-pink-100 text-pink-700" }
  };

  return (
    <dl className="-my-3 divide-y divide-gray-100 px-6 py-4 text-sm/6">
      <div className="flex justify-between gap-x-4 py-3">
        <dt className="text-gray-500">Invoice Terbaru</dt>
        <dd className="text-gray-900">
          {(props.data) ? (
            <Link
              href={`/invoices/${props.data.id}`}
              className="text-primary-400 underline cursor-pointer"
            >
              <time>{props.data.date.setLocale("id").toFormat("dd LLL yyyy, HH:mm")}</time>
            </Link>
          ) : "-"}
        </dd>
      </div>
      <div className="flex justify-between gap-x-4 py-3">
        <dt className="text-gray-500">Total</dt>
        <dd className="flex items-start gap-x-2">
          <div className="font-medium text-gray-900">
            {(props.data) ? IDRFormatter.toCurrency(props.data.amount) : "-"}
          </div>
        </dd>
      </div>
      <div className="flex justify-between gap-x-4 py-3">
        <dt className="text-gray-500">Status</dt>
        <dd className="text-gray-700">
          {(props.data) ? (
            <div
              className={classNames(
                statusChips[props.data.status].className,
                "rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset"
              )}
            >
              {statusChips[props.data.status].label}
            </div>
          ) : "-"}
        </dd>
      </div>
    </dl>
  );
}
