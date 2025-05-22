import Link from "next/link";
import React from "react";
import { DateTime } from "luxon";
import { InvoiceStatus } from "@/features/invoice/domain/entities/invoice";
import { IDRFormatter } from "@/core/utilities/currency/domain/formatters/idr-formatter";
import { InvoiceStatusChip } from "@/app/(authenticated)/invoices/_components/invoice-status-chip";

export interface LastInvoiceItem {
  id: string;
  date: DateTime;
  amount: number;
  status: InvoiceStatus;
}

interface ClientLastInvoiceProps {
  data?: LastInvoiceItem;
}

export function ClientLastInvoice(props: ClientLastInvoiceProps) {
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
          {(props.data) ? (<InvoiceStatusChip status={props.data.status} />) : "-"}
        </dd>
      </div>
    </dl>
  );
}
