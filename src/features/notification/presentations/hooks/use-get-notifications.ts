"use client";

import { useMemo } from "react";
import { useListAccount } from "@/features/account/presentation/hooks/use-list-account";
import { InvitationNotificationEntity } from "@/features/notification/domain/entities/invitation-notification";
import { MembershipStatus } from "@/features/account/domain/enums/membership-status";

export function useGetNotifications() {
  const { accounts, loading } = useListAccount();

  const notifications = useMemo(() => {
    if (!accounts) return [];

    return accounts
      .filter((account) => {
        return account.membership && account.membership.status === MembershipStatus.PENDING && !account.membership.isOwner;
      })
      .map((account) => {
        return new InvitationNotificationEntity({
          id: `invitation-${account.membership!.id}`,
          accountId: account.id,
          accountName: account.fullName,
          accountType: account.type,
          invitedByEmail: account.membership!.invitedBy?.email ?? "",
          membershipId: account.membership!.id,
        });
      });
  }, [accounts]);

  return {
    notifications,
    loading,
    count: notifications.length,
  };
}
