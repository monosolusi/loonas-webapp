import React from "react";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { EllipsisHorizontalIcon } from "@heroicons/react/20/solid";
import Link from "next/link";
import { DateTime } from "luxon";
import { InvoiceStatus } from "@/features/invoice/domain/entities/invoice";
import { EmptyClientState } from "@/app/(authenticated)/home/_components/client-empty";

export interface ClientItem {
  id: string;
  name: string;
  lastInvoice: {
    date: DateTime;
    amount: number;
    status: InvoiceStatus;
  };
}

interface ClientListProps {
  data: ClientItem[];
}

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

export function ClientList(props: ClientListProps) {
  const statusChips: Record<InvoiceStatus, { label: string; className: string }> = {
    PENDING_INVOICE: { label: "Menunggu Invoice", className: "bg-gray-300 text-gray-800" },
    PENDING_PAYMENT: { label: "Menunggu Pembayaran", className: "bg-yellow-100 text-yellow-700" },
    PAYMENT_RECEIVED_PENDING_DELIVERY: { label: "Dana Diterima", className: "bg-blue-100 text-blue-700" },
    COMPLETED: { label: "Selesai", className: "bg-emerald-100 text-emerald-700" },
    EXPIRED: { label: "Kedaluwarsa", className: "bg-gray-100 text-gray-500" },
    FAILED: { label: "Gagal", className: "bg-red-100 text-red-700" },
    CANCELLED: { label: "Dibatalkan", className: "bg-pink-100 text-pink-700" }
  };

  if (props.data.length === 0) return <EmptyClientState />;
  return (
    <ul role="list" className="mt-6 grid grid-cols-1 gap-x-6 gap-y-8 lg:grid-cols-3 xl:gap-x-8">
      {props.data.map((client) => (
        <li key={client.id} className="overflow-hidden rounded-xl border border-gray-200">
          <div className="flex items-center gap-x-4 border-b border-gray-900/5 bg-gray-50 p-6">

            <div className="text-sm/6 font-medium text-gray-900">{client.name}</div>
            <Menu as="div" className="relative ml-auto">
              <MenuButton className="-m-2.5 block p-2.5 text-gray-400 hover:text-gray-500">
                <span className="sr-only">Open options</span>
                <EllipsisHorizontalIcon aria-hidden="true" className="size-5" />
              </MenuButton>
              <MenuItems
                transition
                className="absolute right-0 z-10 mt-0.5 w-32 origin-top-right rounded-md bg-white py-2 ring-1 shadow-lg ring-gray-900/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
              >
                <MenuItem>
                  <a
                    href="#"
                    className="block px-3 py-1 text-sm/6 text-gray-900 data-focus:bg-gray-50 data-focus:outline-hidden"
                  >
                    Lihat<span className="sr-only">, {client.name}</span>
                  </a>
                </MenuItem>
                <MenuItem>
                  <a
                    href="#"
                    className="block px-3 py-1 text-sm/6 text-gray-900 data-focus:bg-gray-50 data-focus:outline-hidden"
                  >
                    Ubah<span className="sr-only">, {client.name}</span>
                  </a>
                </MenuItem>
              </MenuItems>
            </Menu>
          </div>
          <dl className="-my-3 divide-y divide-gray-100 px-6 py-4 text-sm/6">
            <div className="flex justify-between gap-x-4 py-3">
              <dt className="text-gray-500">Invoice Terbaru</dt>
              <dd className="text-primary-400 underline cursor-pointer">
                <Link href="/invoices">
                  <time>{client.lastInvoice.date.setLocale("id").toFormat("dd LLL yyyy, HH:mm")}</time>
                </Link>
              </dd>
            </div>
            <div className="flex justify-between gap-x-4 py-3">
              <dt className="text-gray-500">Total</dt>
              <dd className="flex items-start gap-x-2">
                <div className="font-medium text-gray-900">{client.lastInvoice.amount}</div>
              </dd>
            </div>
            <div className="flex justify-between gap-x-4 py-3">
              <dt className="text-gray-500">Status</dt>
              <dd className="text-gray-700">
                <div
                  className={classNames(
                    statusChips[client.lastInvoice.status].className,
                    "rounded-md px-2 py-1 text-xs font-medium ring-1 ring-inset"
                  )}
                >
                  {statusChips[client.lastInvoice.status].label}
                </div>
              </dd>
            </div>
          </dl>
        </li>
      ))}
    </ul>
  );
}
