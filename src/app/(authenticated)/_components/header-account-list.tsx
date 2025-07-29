"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { ArrowLeftStartOnRectangleIcon, ChevronDownIcon, PlusIcon } from "@heroicons/react/20/solid";
import { AccountListProvider, useAccountListProvider } from "@/features/account/presentation/providers/account-list";
import { useSelectedAccountProvider } from "@/features/authentication/presentation/providers/selected-account";
import { LocalStorageSessionService } from "@/features/authentication/data/sources/local-storage-session";
import { SessionRepositoryImpl } from "@/features/authentication/data/repositories/session";
import { UserSignOutUseCase } from "@/features/authentication/domain/usecases/user-sign-out";
import { DataFailed } from "@/core/resources/data-state";
import { Cog8ToothIcon } from "@heroicons/react/24/outline";
import { AccountTypeEntity } from "@/features/account/domain/types/account-type";

export function HeaderAccountList() {
  return (
    <AccountListProvider>
      <HeaderAccountListComponent />
    </AccountListProvider>
  );
}

function HeaderAccountListComponent() {
  const router = useRouter();
  const [accounts] = useAccountListProvider();
  const [error, setError] = useState<Error>();
  const {
    selectedAccount,
    changeAccount,
    states: [selectAccountLoading],
  } = useSelectedAccountProvider();

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (selectAccountLoading) return;

    // Only for the first render, it will select the first account if there is no selected account
    if (!selectedAccount && accounts?.length) changeAccount?.(accounts[0]);
  }, [selectAccountLoading, selectedAccount, accounts]);

  function generateSelectedAccountLabel(selectedAccount?: AccountTypeEntity) {
    if (!selectedAccount) return "Pilih Akun";
    else return `${selectedAccount.fullName} (ID: ${selectedAccount.generateShortAccountId()})`;
  }

  async function handleSignOutClick() {
    try {
      const sessionService = new LocalStorageSessionService();
      const sessionRepository = new SessionRepositoryImpl(sessionService);
      const logOut = new UserSignOutUseCase(sessionRepository);
      const result = await logOut.execute();
      if (result instanceof DataFailed) throw result.error;
      router.replace("/sign-in");
    } catch (err: any) {
      setError(err);
    }
  }

  return (
    <Menu as="div" className="relative text-left sm:inline-block">
      <div>
        <MenuButton className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-xs ring-1 ring-gray-300 ring-inset hover:bg-gray-50">
          {generateSelectedAccountLabel(selectedAccount)}
          <ChevronDownIcon aria-hidden="true" className="-mr-1 size-5 text-gray-400" />
        </MenuButton>
      </div>

      <MenuItems
        transition
        className="absolute z-10 mt-2 w-full origin-top-right cursor-pointer divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in sm:right-0 sm:w-56"
      >
        <div className="py-1">
          <MenuItem>
            <Link
              href="/accounts/create"
              className="group flex items-center px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden"
            >
              <PlusIcon aria-hidden="true" className="mr-3 size-5 text-gray-400 group-data-focus:text-gray-500" />
              Buat Akun Baru
            </Link>
          </MenuItem>
        </div>
        <div className="py-1">
          {/** The selected account will always be first **/}
          {selectedAccount && (
            <MenuItem disabled>
              <div className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50">
                <p>{selectedAccount.fullName}</p>
                <p className="text-xs/5 text-gray-500">ID: {selectedAccount.generateShortAccountId()}</p>
              </div>
            </MenuItem>
          )}

          {accounts
            ?.filter((account) => account.id !== selectedAccount?.id)
            .slice(0, 2)
            .map((account) => (
              <MenuItem disabled={account.id === selectedAccount?.id} key={account.id}>
                <div
                  onClick={() => changeAccount?.(account)}
                  className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden data-[disabled]:cursor-not-allowed data-[disabled]:opacity-50"
                >
                  <p>{account.fullName}</p>
                  <p className="text-xs/5 text-gray-500">ID: {account.generateShortAccountId()}</p>
                </div>
              </MenuItem>
            ))}
          {(accounts?.length || 0) > 3 && <ShowAllAccountButton />}
        </div>
        <div className="py-1">
          <MenuItem>
            <Link
              href="/settings"
              className="group flex items-center px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden"
            >
              <Cog8ToothIcon aria-hidden="true" className="mr-3 size-5 text-gray-400 group-data-focus:text-gray-500" />
              Pengaturan
            </Link>
          </MenuItem>
          <MenuItem>
            <div
              onClick={handleSignOutClick}
              className="group flex items-center px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden"
            >
              <ArrowLeftStartOnRectangleIcon
                aria-hidden="true"
                className="mr-3 size-5 text-gray-400 group-data-focus:text-gray-500"
              />
              Keluar
            </div>
          </MenuItem>
        </div>
      </MenuItems>
    </Menu>
  );
}

function ShowAllAccountButton() {
  return (
    <MenuItem>
      <Link
        className="block px-4 py-2 text-sm text-gray-700 data-focus:bg-gray-100 data-focus:text-gray-900 data-focus:outline-hidden"
        href="/accounts/select"
      >
        <p className="text-primary-default">Lihat Semuanya</p>
      </Link>
    </MenuItem>
  );
}
