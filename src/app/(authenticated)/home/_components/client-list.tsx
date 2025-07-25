import React from "react";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { EllipsisHorizontalIcon } from "@heroicons/react/20/solid";
import { DateTime } from "luxon";
import { InvoiceStatus } from "@/features/invoice/domain/entities/invoice";
import { EmptyClientState } from "@/app/(authenticated)/home/_components/client-empty";
import { ClientLastInvoiceImpl } from "@/app/(authenticated)/home/_components/client-last-invoice-impl";
import { ListPartnerInvoiceProvider } from "@/features/partner/presentation/providers/list-partner-invoice";

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

export function ClientList(props: ClientListProps) {
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
                className="absolute right-0 z-10 mt-0.5 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
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
          <ListPartnerInvoiceProvider partnerId={client.id} limit={1}>
            <ClientLastInvoiceImpl />
          </ListPartnerInvoiceProvider>
        </li>
      ))}
    </ul>
  );
}
