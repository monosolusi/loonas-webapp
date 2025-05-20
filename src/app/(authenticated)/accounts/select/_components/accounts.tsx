"use client";

import React from "react";
import { useAccountListProvider } from "@/features/account/presentation/providers/account-list";
import {
  AccountVerificationWorkProvider,
  useAccountVerificationWork
} from "@/features/account/presentation/providers/account-verification-work";
import { VerificationStatusBadge } from "@/app/(authenticated)/accounts/select/_components/verification-status-badge";
import { useSelectedAccountProvider } from "@/features/authentication/presentation/providers/selected-account";
import { PersonalAccountEntity } from "@/features/account/domain/entities/personal-account";
import { VerificationOutcome } from "@/features/account/domain/enums/verification-outcome";
import { VerificationStatus } from "@/features/account/domain/enums/verification-status";
import { AccountVerificationWorkEntity } from "@/features/account/domain/entities/account-verification-work";

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

export function Accounts({ onAccountChanged }: { onAccountChanged?: () => void }) {
  const [accounts] = useAccountListProvider();

  return (
    <>
      {accounts?.map((account) => (
        <AccountVerificationWorkProvider id={account.id} key={account.id}>
          <AccountCard account={account} onAccountChanged={onAccountChanged} />
        </AccountVerificationWorkProvider>
      ))}
    </>
  );
}

function AccountCard({ account, onAccountChanged }: { account: PersonalAccountEntity, onAccountChanged?: () => void }) {
  const { changeAccount } = useSelectedAccountProvider();
  const [verification] = useAccountVerificationWork();

  const handleChangeAccount = async (account: PersonalAccountEntity, verification?: AccountVerificationWorkEntity) => {
    // Cannot change account if verification is completed and rejected
    if (!verification) return;
    if (!changeAccount) return;
    if (verification.latestStatus === VerificationStatus.COMPLETED && verification.verificationOutcome === VerificationOutcome.REJECTED) return;

    await changeAccount(account, false);
    onAccountChanged?.();
  };

  function isDisabled(verification?: AccountVerificationWorkEntity): boolean {
    if (!verification) return true;
    if (verification.latestStatus === VerificationStatus.COMPLETED && verification.verificationOutcome === VerificationOutcome.REJECTED) return true;
    return false;
  }

  return (
    <div
      data-disabled={isDisabled(verification)}
      onClick={() => handleChangeAccount(account, verification)}
      className={classNames(
        "cursor-pointer",
        "data-[disabled=true]:bg-gray-100 data-[disabled=true]:cursor-not-allowed data-[disabled=true]:border-transparent",
        "relative flex items-center space-x-3 rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-xs focus-within:ring-2 focus-within:ring-primary-500 focus-within:ring-offset-2 hover:border-gray-400"
      )}
    >
      <div className="min-w-0 flex-1">
        <div className="focus:outline-hidden">
          <div className="flex">
            <div className="flex-1">
              <p className="text-xs text-gray-400">{account.generateShortAccountId()}</p>
              <p className="text-sm font-medium text-black">
                {account.fullName}
              </p>
            </div>
            <VerificationStatusBadge />
          </div>
          <p className="truncate text-sm text-gray-500">Akun Personal</p>
          <p className="text-sm text-gray-500">
            {`${account.address}, Kel. ${account.subdistrict.label} Kec. ${account.district.label} ${account.city.label} ${account.province.label}`}
          </p>
        </div>
      </div>
    </div>
  );
}
