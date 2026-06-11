"use client";

import { useMemo } from "react";
import { useListInvitations } from "@/features/member/presentations/hooks/use-list-invitations";
import { InvitationNotificationEntity } from "@/features/notification/domain/entities/invitation-notification";

export function useGetNotifications() {
  const { invitations, loading } = useListInvitations();

  const notifications = useMemo(() => {
    return invitations.map((invite) => {
      return new InvitationNotificationEntity({
        id: `invitation-${invite.id}`,
        accountId: invite.accountId,
        accountName: invite.accountName,
        accountType: invite.accountType,
        invitedByEmail: invite.invitedBy.email,
        membershipId: invite.id,
      });
    });
  }, [invitations]);

  return {
    notifications,
    loading,
    count: notifications.length,
  };
}
