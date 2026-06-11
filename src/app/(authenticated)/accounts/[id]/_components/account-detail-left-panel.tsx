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

const ACCOUNT_BG_MAP = {
  [AccountType.PERSONAL]: "from-primary-300/8 to-primary-300/2",
  [AccountType.BUSINESS]: "from-success-300/8 to-success-300/2",
};

export function AccountDetailLeftPanel({ account }: AccountDetailLeftPanelProps) {
  const colorClass = ACCOUNT_AVATAR_COLOR_MAP[account.type];

  return (
    <div className="flex flex-col overflow-hidden rounded-lg border border-neutral-200 bg-white">
      {/* Avatar Header */}
      <div className={clsx("flex flex-col items-center gap-y-3 bg-gradient-to-b px-6 pt-8 pb-6", ACCOUNT_BG_MAP[account.type])}>
        <div className={clsx("flex size-16 items-center justify-center rounded-xl border shadow-sm", colorClass)}>
          <Image src={ACCOUNT_ICON_MAP[account.type]} alt="account icon" width={28} height={28} />
        </div>
        <div className="flex flex-col items-center gap-y-1.5">
          <h2 className="text-center text-lg font-bold text-neutral-500">{account.fullName}</h2>
          <span className={clsx("rounded-md border px-2 py-0.5 text-xs leading-4 font-medium", colorClass)}>
            {ACCOUNT_LABEL_MAP[account.type]}
          </span>
        </div>
      </div>

      {/* Details */}
      <div className="flex flex-col gap-y-3 px-6 py-5">
        <div className="flex flex-row items-center justify-between">
          <span className="text-sm text-neutral-200">Status</span>
          <AccountStatusBadge account={account} />
        </div>
        <div className="border-t border-neutral-100" />
        <div className="flex flex-row items-center justify-between">
          <span className="text-sm text-neutral-200">ID Akun</span>
          <span className="text-sm font-medium text-neutral-500">{account.generateShortAccountId()}</span>
        </div>
      </div>
    </div>
  );
}
