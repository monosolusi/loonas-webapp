"use client";

import Image from "next/image";
import clsx from "clsx";
import { AccountTypeEntity } from "@/features/account/domain/types/account-type";
import { AccountType } from "@/features/account/domain/enums/account-type";
import { AccountStatusBadge } from "@/app/(authenticated)/accounts/_components/account-status-badge";
import { ACCOUNT_AVATAR_COLOR_MAP } from "@/core/utilities/global-vars";

type AccountDetailLeftPanelProps = {
  account: AccountTypeEntity;
};

const ACCOUNT_ICON_MAP = {
  [AccountType.PERSONAL]: "/assets/images/person-icon-primary-400.w24-h24.svg",
  [AccountType.BUSINESS]: "/assets/images/suitcase-icon-success-400-w24-h24.svg",
};

const ACCOUNT_LABEL_MAP = {
  [AccountType.PERSONAL]: "Personal",
  [AccountType.BUSINESS]: "Bisnis",
};

export function AccountDetailLeftPanel({ account }: AccountDetailLeftPanelProps) {
  const colorClass = ACCOUNT_AVATAR_COLOR_MAP[account.type];

  return (
    <div className="flex flex-col gap-y-6">
      {/* Account Identity */}
      <div className="flex flex-col gap-y-4 rounded-lg border border-neutral-200 bg-white p-6">
        <div className={clsx("flex size-14 items-center justify-center rounded-lg border shadow-sm", colorClass)}>
          <Image src={ACCOUNT_ICON_MAP[account.type]} alt="account icon" width={24} height={24} />
        </div>

        <div className="flex flex-col gap-y-1">
          <h2 className="text-xl font-bold text-neutral-500">{account.fullName}</h2>
          <div className="flex flex-row items-center gap-x-2">
            <span className={clsx("rounded-md border px-2 py-0.5 text-xs leading-4", colorClass)}>
              {ACCOUNT_LABEL_MAP[account.type]}
            </span>
            <AccountStatusBadge account={account} />
          </div>
        </div>

        <div className="border-t border-neutral-100 pt-4">
          <div className="flex flex-col gap-y-3">
            <div className="flex flex-row justify-between">
              <span className="text-sm text-neutral-200">ID Akun</span>
              <span className="text-sm font-medium text-neutral-500">{account.generateShortAccountId()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
