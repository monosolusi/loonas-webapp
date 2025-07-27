"use client";

import React, { useMemo } from "react";
import { useAccountListProvider } from "@/features/account/presentation/providers/account-list";
import { VerificationStatusBadge } from "@/app/(authenticated)/accounts/select/_components/verification-status-badge";
import { useSelectedAccountProvider } from "@/features/authentication/presentation/providers/selected-account";
import { PersonalAccountEntity } from "@/features/account/domain/entities/personal-account";
import { VerificationOutcome } from "@/features/account/domain/enums/verification-outcome";
import { VerificationStatus } from "@/features/account/domain/enums/verification-status";
import { AccountVerificationWorkEntity } from "@/features/account/domain/entities/account-verification-work";
import { useGetAccountVerificationWork } from "@/features/account/presentation/hooks/use-get-account-verification-work";

function classNames(...classes: any) {
  return classes.filter(Boolean).join(" ");
}

export function Accounts({ onAccountChanged }: { onAccountChanged?: () => void }) {
  const [accounts] = useAccountListProvider();

  return (
    <>
      {accounts?.map((account) => (
        <AccountCard key={account.id} account={account} onAccountChanged={onAccountChanged} />
      ))}
    </>
  );
}

function AccountCard({ account, onAccountChanged }: { account: PersonalAccountEntity; onAccountChanged?: () => void }) {
  const { changeAccount } = useSelectedAccountProvider();
  const { verificationWork } = useGetAccountVerificationWork({ accountId: account.id });

  const isDisabled = useMemo(() => {
    if (!verificationWork) return true;
    if (
      verificationWork.latestStatus === VerificationStatus.COMPLETED &&
      verificationWork.verificationOutcome === VerificationOutcome.REJECTED
    )
      return true;
    return false;
  }, [verificationWork]);

  const handleChangeAccount = async (account: PersonalAccountEntity, verification?: AccountVerificationWorkEntity) => {
    // Cannot change an account if verification is completed and rejected
    if (isDisabled) return;
    if (!changeAccount) return;

    await changeAccount(account, false);
    onAccountChanged?.();
  };

  return (
    <div
      data-disabled={isDisabled}
      onClick={() => handleChangeAccount(account, verificationWork)}
      className={classNames(
        "cursor-pointer",
        "data-[disabled=true]:cursor-not-allowed data-[disabled=true]:border-transparent data-[disabled=true]:bg-gray-100",
        "focus-within:ring-primary-500 relative flex items-center space-x-3 rounded-lg border border-gray-300 bg-white px-6 py-5 shadow-xs focus-within:ring-2 focus-within:ring-offset-2 hover:border-gray-400",
      )}
    >
      <div className="min-w-0 flex-1">
        <div className="focus:outline-hidden">
          <div className="flex">
            <div className="flex-1">
              <p className="text-xs text-gray-400">{account.generateShortAccountId()}</p>
              <p className="text-sm font-medium text-black">{account.fullName}</p>
            </div>
            <VerificationStatusBadge accountId={account.id} />
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
