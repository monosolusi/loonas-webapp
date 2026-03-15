"use client";

import { InvitationNotificationEntity } from "@/features/notification/domain/entities/invitation-notification";
import { InvitationNotificationItem } from "@/features/notification/presentations/components/invitation-notification-item";

type NotificationListProps = {
  notifications: InvitationNotificationEntity[];
};

export function NotificationList({ notifications }: NotificationListProps) {
  if (notifications.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8">
        <p className="text-sm text-neutral-200">Tidak ada notifikasi</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-y-2">
      {notifications.map((notification) => (
        <InvitationNotificationItem key={notification.id} notification={notification} />
      ))}
    </div>
  );
}
