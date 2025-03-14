"use client";

import React from "react";
import Link from "next/link";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { ChevronDownIcon, PlusIcon } from "@heroicons/react/20/solid";
import { AccountListProvider, useAccountListProvider } from "@/app/(account)/_presentation/_providers/account-list";
import { useSelectedAccountProvider } from "@/app/(authentication)/_presentation/_components/protected-page";
import { PersonalAccountEntity } from "@/app/(account)/_domain/_entities/personal-account";

export function HeaderAccountList() {
  return (
    <AccountListProvider>
      <HeaderAccountListComponent />
    </AccountListProvider>
  );
}

function HeaderAccountListComponent() {
  const [accounts] = useAccountListProvider();
  const { selectedAccount, changeAccount } = useSelectedAccountProvider();

  function generateShortAccountId(id: string) {
    return id.substring(0, 6).toUpperCase();
  }

  function generateSelectedAccountLabel(selectedAccount?: PersonalAccountEntity) {
    if (!selectedAccount) return "Pilih Akun";
    else return `${selectedAccount.fullName} (ID: ${generateShortAccountId(selectedAccount.id)})`;
  }

  return (
    <Menu as="div" className="relative sm:inline-block text-left">
      <div>
        <MenuButton
          className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 shadow-xs ring-gray-300 ring-inset hover:bg-gray-50">
          {generateSelectedAccountLabel(selectedAccount)}
          <ChevronDownIcon aria-hidden="true" className="-mr-1 size-5 text-gray-400" />
        </MenuButton>
      </div>

      <MenuItems
        transition
        className="absolute cursor-pointer sm:right-0 z-10 mt-2 w-full sm:w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white ring-1 shadow-lg ring-black/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
      >
        <div className="py-1">
          {accounts?.slice(0, 3).map((account) => (
            <MenuItem disabled={account.id === selectedAccount?.id} key={account.id}>
              <div
                onClick={() => changeAccount?.(account)}
                className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden data-[disabled]:opacity-50 data-[disabled]:cursor-not-allowed"
              >
                <p>{account.fullName}</p>
                <p className="text-xs/5 text-gray-500">ID: {generateShortAccountId(account.id)}</p>
              </div>
            </MenuItem>
          ))}
          {(accounts?.length || 0) > 3 && (
            <MenuItem>
              <div
                className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden">
                <p className="text-primary-default">Lihat Semuanya</p>
              </div>
            </MenuItem>
          )}
        </div>
        <div className="py-1">
          <MenuItem>
            <Link
              href="/accounts/create"
              className="group flex items-center px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden"
            >
              <PlusIcon
                aria-hidden="true"
                className="mr-3 size-5 text-gray-400 group-data-focus:text-gray-500"
              />
              Buat Akun Baru
            </Link>
          </MenuItem>
        </div>
      </MenuItems>
    </Menu>
  );
}