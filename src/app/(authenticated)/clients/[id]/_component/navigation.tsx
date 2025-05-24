import React from "react";
import { BanknotesIcon, BuildingOffice2Icon, DocumentIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

const secondaryNavigation = [
  { name: "Detail", href: "./detail", icon: BuildingOffice2Icon, current: true },
  { name: "Faktur", href: "./invoices", icon: DocumentIcon, current: false },
  { name: "Bank", href: "./bank-accounts", icon: BanknotesIcon, current: false }
];

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

export function SideNavigation() {
  return (
    <aside className="flex overflow-x-auto border-b border-gray-900/5 py-4 lg:block lg:w-64 lg:flex-none lg:border-0">
      <nav className="flex-none px-4 sm:px-6 lg:px-0">
        <ul role="list" className="flex gap-x-3 gap-y-1 whitespace-nowrap lg:flex-col">
          {secondaryNavigation.map((item) => (
            <li key={item.name}>
              <Link
                href={item.href}
                className={classNames(
                  item.current
                    ? "bg-gray-100  text-primary-default"
                    : "text-gray-700 hover:bg-gray-100 hover:text-primary-default",
                  "group flex gap-x-3 rounded-md py-2 pr-3 pl-2 text-sm/6 font-semibold"
                )}
              >
                <item.icon
                  aria-hidden="true"
                  className={classNames(
                    item.current ? "text-primary-default" : "text-gray-400 group-hover:text-primary-default",
                    "size-6 shrink-0"
                  )}
                />
                {item.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
