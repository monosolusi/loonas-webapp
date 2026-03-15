"use client";

import { useState } from "react";
import { InvitationNotificationEntity } from "@/features/notification/domain/entities/invitation-notification";
import { useRespondToInvite } from "@/features/member/presentations/hooks/use-respond-to-invite";
import { InviteAction } from "@/features/member/domain/enums/invite-action";
import { AccountType } from "@/features/account/domain/enums/account-type";
import { useSWRConfig } from "swr";
import clsx from "clsx";
import Image from "next/image";

type InvitationNotificationItemProps = {
  notification: InvitationNotificationEntity;
};

export function InvitationNotificationItem({ notification }: InvitationNotificationItemProps) {
  const { trigger, isMutating } = useRespondToInvite();
  const { mutate } = useSWRConfig();
  const [responded, setResponded] = useState<InviteAction | null>(null);

  const handleRespond = async (action: InviteAction) => {
    try {
      await trigger({ id: notification.membershipId, action });
      setResponded(action);
      await mutate((key: unknown) => Array.isArray(key) && key[0] === "list-account");
    } catch {
      // Error captured by SWR
    }
  };

  if (responded) {
    return (
      <div className="flex flex-col gap-y-1 rounded-lg bg-neutral-50 px-4 py-3">
        <p className="text-sm text-neutral-300">
          {responded === InviteAction.ACCEPT ? "Undangan diterima" : "Undangan ditolak"}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-y-3 rounded-lg border border-neutral-100 px-4 py-3">
      <div className="flex flex-row items-start gap-x-3">
        <div
          className={clsx(
            "flex size-9 shrink-0 items-center justify-center rounded-lg",
            notification.accountType === AccountType.BUSINESS ? "bg-primary-300/10" : "bg-warning-300/10",
          )}
        >
          <Image
            src={
              notification.accountType === AccountType.BUSINESS
                ? "/assets/images/building-icon-primary-300-w16-h16.svg"
                : "/assets/images/person-icon-warning-300-w16-h16.svg"
            }
            alt="account icon"
            width={16}
            height={16}
          />
        </div>
        <div className="flex flex-col gap-y-0.5">
          <p className="text-sm font-medium text-neutral-500">{notification.accountName}</p>
          <p className="text-xs text-neutral-200">Diundang oleh {notification.invitedByEmail}</p>
        </div>
      </div>

      <div className="flex flex-row gap-x-2">
        <button
          type="button"
          disabled={isMutating}
          onClick={() => handleRespond(InviteAction.ACCEPT)}
          className="flex-1 rounded-lg bg-primary-300 px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-primary-300/90 disabled:opacity-50"
        >
          Terima
        </button>
        <button
          type="button"
          disabled={isMutating}
          onClick={() => handleRespond(InviteAction.REJECT)}
          className="flex-1 rounded-lg border border-neutral-200 px-3 py-1.5 text-xs font-medium text-neutral-300 transition-colors hover:bg-neutral-50 disabled:opacity-50"
        >
          Tolak
        </button>
      </div>
    </div>
  );
}
