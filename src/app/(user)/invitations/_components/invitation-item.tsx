"use client";

import { useState } from "react";
import Image from "next/image";
import clsx from "clsx";
import { InviteEntity } from "@/features/member/domain/entities/invite";
import { useRespondToInvite } from "@/features/member/presentations/hooks/use-respond-to-invite";
import { InviteAction } from "@/features/member/domain/enums/invite-action";
import { AccountType } from "@/features/account/domain/enums/account-type";
import { useSWRConfig } from "swr";
import { DateTime } from "luxon";

type InvitationItemProps = {
  invite: InviteEntity;
};

const ACCOUNT_ICON_MAP = {
  [AccountType.PERSONAL]: "/assets/images/person-icon-primary-400.w24-h24.svg",
  [AccountType.BUSINESS]: "/assets/images/suitcase-icon-success-400-w24-h24.svg",
};

const ACCOUNT_COLOR_MAP = {
  [AccountType.PERSONAL]: "bg-primary-300/10 border-primary-300/20",
  [AccountType.BUSINESS]: "bg-success-300/10 border-success-300/20",
};

export function InvitationItem({ invite }: InvitationItemProps) {
  const { trigger, isMutating } = useRespondToInvite();
  const { mutate } = useSWRConfig();
  const [responded, setResponded] = useState<InviteAction | null>(null);

  const createdDate = DateTime.fromISO(invite.createdAt).setLocale("id").toFormat("dd LLL yyyy");

  const handleRespond = async (action: InviteAction) => {
    try {
      await trigger({ id: invite.id, action });
      setResponded(action);
      await mutate((key: unknown) => Array.isArray(key) && key[0] === "list-invitations");
    } catch {
      // Error captured by SWR
    }
  };

  if (responded) {
    return (
      <div className="flex flex-row items-center justify-between rounded-lg border border-neutral-200 bg-neutral-50 px-6 py-5">
        <p className="text-sm text-neutral-300">
          {responded === InviteAction.ACCEPT ? "Undangan diterima" : "Undangan ditolak"}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-row items-center justify-between rounded-lg border border-neutral-200 bg-white px-6 py-5">
      <div className="flex flex-row items-center gap-x-4">
        <div className={clsx("flex size-11 items-center justify-center rounded-lg border", ACCOUNT_COLOR_MAP[invite.accountType])}>
          <Image src={ACCOUNT_ICON_MAP[invite.accountType]} alt="" width={22} height={22} />
        </div>
        <div className="flex flex-col gap-y-0.5">
          <p className="text-sm font-semibold text-neutral-500">
            {invite.accountName}
          </p>
          <p className="text-xs text-neutral-200">
            Diundang oleh {invite.invitedBy.email} · {createdDate}
          </p>
        </div>
      </div>

      <div className="flex flex-row gap-x-2">
        <button
          type="button"
          disabled={isMutating}
          onClick={() => handleRespond(InviteAction.ACCEPT)}
          className="rounded-lg bg-primary-300 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-300/90 disabled:opacity-50"
        >
          Terima
        </button>
        <button
          type="button"
          disabled={isMutating}
          onClick={() => handleRespond(InviteAction.REJECT)}
          className="rounded-lg border border-neutral-200 px-4 py-2 text-sm font-medium text-neutral-300 transition-colors hover:bg-neutral-50 disabled:opacity-50"
        >
          Tolak
        </button>
      </div>
    </div>
  );
}
