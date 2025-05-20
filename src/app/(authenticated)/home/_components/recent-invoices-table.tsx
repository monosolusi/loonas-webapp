"use client";

import React from "react";
import Link from "next/link";
import { InvoiceTypeIcon } from "@/app/(authenticated)/invoices/_components/invoice-type-icon";
import { InvoiceType } from "@/features/invoice/domain/enums/invoice-type";
import { DateTime } from "luxon";
import { IDRFormatter } from "@/core/utilities/currency/domain/formatters/idr-formatter";
import { EmptyInvoiceState } from "@/app/(authenticated)/home/_components/invoice-empty";
import { InvoiceStatus } from "@/features/invoice/domain/entities/invoice";

export interface InvoiceRow {
  id: string; // This is PaymentRequest's id
  receiverName: string;
  status: InvoiceStatus;
  total: number;
  createdAt: DateTime;
}

interface RecentInvoiceTableProps {
  data: InvoiceRow[];
}

export function RecentInvoicesTable(props: RecentInvoiceTableProps) {
  const statusChips: Record<InvoiceStatus, { label: string; className: string }> = {
    PENDING_INVOICE: { label: "Menunggu Invoice", className: "bg-gray-300 text-gray-800" },
    PENDING_PAYMENT: { label: "Menunggu Pembayaran", className: "bg-yellow-100 text-yellow-700" },
    PAYMENT_RECEIVED_PENDING_DELIVERY: { label: "Dana Diterima", className: "bg-blue-100 text-blue-700" },
    COMPLETED: { label: "Selesai", className: "bg-emerald-100 text-emerald-700" },
    EXPIRED: { label: "Kedaluwarsa", className: "bg-gray-100 text-gray-500" },
    FAILED: { label: "Gagal", className: "bg-red-100 text-red-700" },
    CANCELLED: { label: "Dibatalkan", className: "bg-pink-100 text-pink-700" }
  };

  if (props.data?.length === 0) return <EmptyInvoiceState />;
  return (
    <div className="inline-block min-w-full py-2 align-middle">
      <div className="overflow-hidden shadow-sm ring-1 ring-black/5 ">
        <table className="min-w-full divide-y divide-gray-300">
          <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="py-3.5 pl-4 text-left text-sm font-semibold sm:pl-8">
            </th>
            <th scope="col" className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
              Nama Penerima
            </th>
            <th
              scope="col"
              className="hidden px-3 py-3.5 text-center text-sm font-semibold text-gray-900 sm:table-cell"
            >
              Status
            </th>
            <th scope="col" className="px-3 py-3.5 text-right text-sm font-semibold text-gray-900">
              Total
            </th>
            <th
              scope="col"
              className="hidden relative py-3.5 pr-4 pl-3 text-sm text-right text-gray-900 sm:pr-8 sm:table-cell"
            >
              Tanggal Dibuat
            </th>
          </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
          {props.data.map((row => (
            <tr key={row.id}>
              <td className="py-4 pl-4 text-sm font-medium whitespace-nowrap sm:pl-8">
                <InvoiceTypeIcon type={InvoiceType.INCOMING} />
              </td>
              <td className="px-3 py-4 text-sm whitespace-nowrap text-gray-900 sm:table-cell">
                <Link
                  href={`/invoices/${row.id}`}
                  className="font-bold underline line-clamp-2 cursor-pointer hover:text-primary-default"
                >
                  {row.receiverName}
                </Link>
              </td>
              <td className="hidden px-3 py-4 text-sm text-center whitespace-nowrap text-gray-500 sm:table-cell">
              <span className={`px-2 py-1 rounded ${statusChips[row.status].className}`}>
                {statusChips[row.status].label}
              </span>
              </td>
              <td className="px-3 py-4 text-sm text-right whitespace-nowrap text-gray-500">
                {IDRFormatter.toCurrency(row.total)}
              </td>
              <td className="relative py-4 pr-4 pl-3 text-right text-sm whitespace-nowrap sm:pr-8">
                {row.createdAt.setLocale("id").toFormat("dd LLL yyyy, HH:mm")}
              </td>
            </tr>
          )))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
