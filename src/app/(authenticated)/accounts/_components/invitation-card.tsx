"use client";

import { useState } from "react";
import Image from "next/image";
import clsx from "clsx";
import { revalidateSWRKey } from "@/core/helpers/revalidate-swr-key";
import { AccountTypeEntity } from "@/features/account/domain/types/account-type";
import { AccountType } from "@/features/account/domain/enums/account-type";
import { useRespondToInvite } from "@/features/member/presentations/hooks/use-respond-to-invite";
import { InviteAction } from "@/features/member/domain/enums/invite-action";
import { ACCOUNT_AVATAR_COLOR_MAP } from "@/core/utilities/global-vars";

type InvitationCardProps = {
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

export function InvitationCard({ account }: InvitationCardProps) {
  const { trigger, isMutating } = useRespondToInvite();
  const [responded, setResponded] = useState<InviteAction | null>(null);
  const membership = account.membership!;
  const colorClass = ACCOUNT_AVATAR_COLOR_MAP[account.type];

  const handleRespond = async (action: InviteAction) => {
    try {
      await trigger({ id: membership.id, action });
      setResponded(action);
      await revalidateSWRKey("list-account");
    } catch {
      // Error captured by SWR
    }
  };

  if (responded) {
    return (
      <div className="flex w-full flex-col items-center justify-center gap-y-2 rounded-lg border border-neutral-200 bg-neutral-50 p-6 sm:w-[256px]">
        <p className="text-sm font-medium text-neutral-300">
          {responded === InviteAction.ACCEPT ? "Undangan diterima" : "Undangan ditolak"}
        </p>
      </div>
    );
  }

  return (
    <div className="flex w-full flex-col gap-y-5 rounded-lg border border-warning-300/30 bg-warning-300/5 p-6 sm:w-[256px]">
      {/* Header */}
      <div className="flex flex-row items-start justify-between">
        <div className={clsx("flex size-12 items-center justify-center rounded-lg border shadow-sm", colorClass)}>
          <Image src={ACCOUNT_ICON_MAP[account.type]} alt="Icon" width={24} height={24} />
        </div>
        <span className="rounded-md bg-warning-300/10 border border-warning-300/20 px-2 py-1 text-xs leading-4 font-medium text-warning-300">
          Undangan
        </span>
      </div>

      {/* Info */}
      <div className="flex flex-col gap-y-1">
        <p className="truncate text-xl leading-7 font-bold">{account.fullName}</p>
        <p className="text-sm text-neutral-300">
          {ACCOUNT_LABEL_MAP[account.type]}
        </p>
        {membership.invitedBy && (
          <p className="mt-1 truncate text-xs text-neutral-200">
            Diundang oleh {membership.invitedBy.email}
          </p>
        )}
      </div>

      {/* Actions */}
      <div className="flex flex-row gap-x-2">
        <button
          type="button"
          disabled={isMutating}
          onClick={() => handleRespond(InviteAction.ACCEPT)}
          className="flex-1 rounded-lg bg-primary-300 px-3 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-300/90 disabled:opacity-50"
        >
          Terima
        </button>
        <button
          type="button"
          disabled={isMutating}
          onClick={() => handleRespond(InviteAction.REJECT)}
          className="flex-1 rounded-lg border border-neutral-200 bg-white px-3 py-2 text-sm font-medium text-neutral-300 transition-colors hover:bg-neutral-50 disabled:opacity-50"
        >
          Tolak
        </button>
      </div>
    </div>
  );
}
