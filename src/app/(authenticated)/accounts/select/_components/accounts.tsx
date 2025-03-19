"use client";

import React from "react";
import { useAccountListProvider } from "@/features/account/presentation/providers/account-list";
import { AccountVerificationWorkProvider } from "@/features/account/presentation/providers/account-verification-work";
import { VerificationStatusBadge } from "@/app/(authenticated)/accounts/select/_components/verification-status-badge";
import { useSelectedAccountProvider } from "@/features/authentication/presentation/providers/selected-account";

export function Accounts() {
  const [accounts] = useAccountListProvider();
  const { changeAccount } = useSelectedAccountProvider();

  return (
    <>
      {accounts?.map((account) => (
        <AccountVerificationWorkProvider id={account.id} key={account.id}>
          <div
            onClick={() => changeAccount?.(account)}
            className="relative flex items-center space-x-3 rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-xs focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 hover:border-gray-400"
          >
            <div className="min-w-0 flex-1">
              <div className="cursor-pointer focus:outline-hidden">
                <div className="flex">
                  <p className="text-sm font-medium text-gray-900 flex-1">
                    {account.fullName}
                  </p>
                  <VerificationStatusBadge />
                </div>
                <p className="truncate text-sm text-gray-500">Akun Personal</p>
                <p className="text-sm text-gray-500">
                  {`${account.address}, Kel. ${account.subdistrict.label} Kec. ${account.district.label} ${account.city.label} ${account.province.label}`}
                </p>
              </div>
            </div>
          </div>
        </AccountVerificationWorkProvider>
      ))}
    </>
  );
}