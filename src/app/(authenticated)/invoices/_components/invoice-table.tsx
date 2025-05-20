"use client";

import React from "react";
import Link from "next/link";
import { PaymentRequestStatus } from "@/features/payment/domain/enums/payment-request";
import { DateTime } from "luxon";
import { IDRFormatter } from "@/core/utilities/currency/domain/formatters/idr-formatter";
import { InvoiceTypeIcon } from "@/app/(authenticated)/invoices/_components/invoice-type-icon";
import { InvoiceType } from "@/features/invoice/domain/enums/invoice-type";
import { EmptyInvoiceState } from "@/app/(authenticated)/invoices/_components/empty-invoice-state";

export interface InvoiceRow {
  id: string;
  type: InvoiceType;
  receiverName: string;
  bankAccount: {
    bankName: string;
    accountNumber: string;
    accountHolderName: string;
  };
  total: number;
  status: PaymentRequestStatus;
  paymentMethod: string;
  createdAt: DateTime;
}

interface InvoiceTableProps {
  data: InvoiceRow[];
}


export function InvoiceTable(props: InvoiceTableProps) {
  const statusChips: Record<PaymentRequestStatus, { label: string; className: string }> = {
    PENDING_INVOICE: { label: "Menunggu Invoice", className: "bg-gray-300 text-gray-800" },
    PENDING_PAYMENT: { label: "Menunggu Pembayaran", className: "bg-yellow-100 text-yellow-700" },
    PAYMENT_RECEIVED_PENDING_DELIVERY: { label: "Dana Diterima", className: "bg-blue-100 text-blue-700" },
    COMPLETED: { label: "Selesai", className: "bg-emerald-100 text-emerald-700" },
    EXPIRED: { label: "Kedaluwarsa", className: "bg-gray-100 text-gray-500" },
    FAILED: { label: "Gagal", className: "bg-red-100 text-red-700" },
    CANCELLED: { label: "Dibatalkan", className: "bg-pink-100 text-pink-700" }
  };

  if (props.data.length === 0) return <EmptyInvoiceState />;
  return (
    <div>
      <div className="flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden shadow-sm ring-1 ring-black/5 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-300">
                <thead className="bg-gray-50">
                <tr>
                  <th className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-black sm:pl-6" scope="col">
                  </th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-black" scope="col">
                    Nama Penerima
                  </th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-black" scope="col">
                    Bank & No. Rekening
                  </th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-black" scope="col">
                    Total
                  </th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-black" scope="col">
                    Status
                  </th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-black" scope="col">
                    Metode
                  </th>
                  <th className="px-3 py-3.5 text-left text-sm font-semibold text-black" scope="col">
                    Tanggal Dibuat
                  </th>
                </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 bg-white">
                {props.data.map((row, idx) => (
                  <tr key={idx}>
                    <td
                      className="py-4 pl-4 pr-3 text-sm font-medium text-black sm:pl-6">
                      <InvoiceTypeIcon type={row.type} />
                    </td>
                    <td className="whitespace-normal px-3 py-4 text-sm text-black max-w-[200px]">
                      <Link href={`/invoices/${row.id}`}
                            className="font-bold underline line-clamp-2 cursor-pointer hover:text-primary-default">
                        {row.receiverName}
                      </Link>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-black">
                      <div>
                        <div>{row.bankAccount.accountHolderName}</div>
                        <div className="text-xs text-gray-400">{row.bankAccount.bankName}</div>
                        <div className="text-xs text-gray-400">{row.bankAccount.accountNumber}</div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-black">
                      {IDRFormatter.toCurrency(row.total)}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-xs font-semibold rounded">
                        <span className={`px-2 py-1 rounded ${statusChips[row.status].className}`}>
                          {statusChips[row.status].label}
                        </span>
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {row.paymentMethod}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-black">
                      {row.createdAt.setLocale("id").toFormat("dd LLL yyyy, HH:mm")}
                    </td>
                  </tr>
                ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
