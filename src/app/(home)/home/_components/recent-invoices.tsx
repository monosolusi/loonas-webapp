import React, { Fragment } from "react";
import { ArrowDownCircleIcon, ArrowUpCircleIcon } from "@heroicons/react/20/solid";

type Status = "Paid" | "Withdraw" | "Overdue";
const statuses = {
  Paid: "text-green-700 bg-green-50 ring-green-600/20",
  Withdraw: "text-gray-600 bg-gray-50 ring-gray-500/10",
  Overdue: "text-red-700 bg-red-50 ring-red-600/10"
};

const days = [
  {
    date: "Hari Ini",
    dateTime: "2023-03-22",
    transactions: [
      {
        id: 1,
        invoiceNumber: "00012",
        href: "#",
        amount: "Rp 10.000.000",
        status: "Paid" as Status,
        type: "Faktur Keluaran",
        client: "PT. Red Med Indonesia",
        icon: ArrowUpCircleIcon
      },
      {
        id: 2,
        invoiceNumber: "00011",
        href: "#",
        amount: "Rp 108.381.312",
        status: "Withdraw" as Status,
        client: "PT. Red Mart Indonesia",
        type: "Faktur Masukan",
        icon: ArrowDownCircleIcon
      },
      {
        id: 3,
        invoiceNumber: "00009",
        href: "#",
        amount: "Rp 83.138.482",
        status: "Overdue" as Status,
        client: "PT. Samsung Electronics Indonesia",
        type: "Faktur Masukan",
        icon: ArrowDownCircleIcon
      }
    ]
  },
  {
    date: "Yesterday",
    dateTime: "2023-03-21",
    transactions: [
      {
        id: 4,
        invoiceNumber: "00010",
        href: "#",
        amount: "Rp 294.112.341",
        status: "Paid" as Status,
        client: "PT. Indomarco Prismatama",
        type: "Faktur Keluaran",
        icon: ArrowUpCircleIcon
      }
    ]
  }
];

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

export function RecentInvoices() {
  return (
    <div>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-none flex justify-between">
          <h2 className="text-base font-semibold text-gray-900">
            Riwayat Faktur Terbaru
          </h2>
          <a href="#" className="text-sm/6 font-semibold text-primary-600 hover:text-indigo-500">
            Lihat semua
          </a>
        </div>
      </div>
      <div className="mt-6 overflow-hidden border-t border-gray-100">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl lg:mx-0 lg:max-w-none">
            <table className="w-full text-left">
              <thead className="sr-only">
              <tr>
                <th>Jumlah</th>
                <th className="hidden sm:table-cell">Klien</th>
                <th>Informasi Lebih Lanjut</th>
              </tr>
              </thead>
              <tbody>
              {days.map((day) => (
                <Fragment key={day.dateTime}>
                  <tr className="text-sm/6 text-gray-900">
                    <th scope="colgroup" colSpan={3} className="relative isolate py-2 font-semibold">
                      <time dateTime={day.dateTime}>{day.date}</time>
                      <div
                        className="absolute inset-y-0 right-full -z-10 w-screen border-b border-gray-200 bg-gray-50" />
                      <div className="absolute inset-y-0 left-0 -z-10 w-screen border-b border-gray-200 bg-gray-50" />
                    </th>
                  </tr>
                  {day.transactions.map((transaction) => (
                    <tr key={transaction.id}>
                      <td className="relative py-5 pr-6">
                        <div className="flex gap-x-6">
                          <transaction.icon
                            aria-hidden="true"
                            className="hidden h-6 w-5 flex-none text-gray-400 sm:block"
                          />
                          <div className="flex-auto">
                            <div className="flex items-start gap-x-3">
                              <div className="text-sm/6 font-medium text-gray-900">{transaction.amount}</div>
                              <div
                                className={classNames(
                                  statuses[transaction.status],
                                  "rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset"
                                )}
                              >
                                {transaction.status}
                              </div>
                            </div>
                            <div className="mt-1 text-xs/5 text-gray-500">{transaction.type}</div>
                          </div>
                        </div>
                        <div className="absolute right-full bottom-0 h-px w-screen bg-gray-100" />
                        <div className="absolute bottom-0 left-0 h-px w-screen bg-gray-100" />
                      </td>
                      <td className="hidden py-5 pr-6 sm:table-cell">
                        <div className="text-sm/6 text-gray-900">{transaction.client}</div>
                      </td>
                      <td className="py-5 text-right">
                        <div className="flex justify-end">
                          <a
                            href={transaction.href}
                            className="text-sm/6 font-medium text-primary-600 hover:text-primary-500"
                          >
                            Lihat<span className="hidden sm:inline"> detail</span>
                          </a>
                        </div>
                        <div className="mt-1 text-xs/5 text-gray-500">
                          Faktur <span className="text-gray-900">#{transaction.invoiceNumber}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </Fragment>
              ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}