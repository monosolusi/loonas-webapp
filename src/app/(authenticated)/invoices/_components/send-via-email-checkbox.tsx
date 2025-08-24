"use client";

import { LoonasCheckbox } from "@/core/presentations/components/loonas-checkbox";
import React, { useMemo } from "react";
import { useGetNotificationConfig } from "@/features/notification/presentation/hooks/use-get-notification-config";
import { NotificationChannel } from "@/features/notification/domain/enums/notification-channel";

export interface SendViaEmailCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  recipient: { email: string; name: string };
}

export function SendViaEmailCheckbox(props: SendViaEmailCheckboxProps) {
  const { config, loading } = useGetNotificationConfig();

  const isEnabled = useMemo(() => {
    if (!config || loading) return false;

    const emailConfig = config.channels.find((channel) => channel.channel === NotificationChannel.EMAIL);
    if (!emailConfig) return false;
    return emailConfig.enabled;
  }, [config, loading]);

  if (!isEnabled) return false;
  return (
    <LoonasCheckbox checked={props.checked} onChange={props.onChange} disabled={props.disabled}>
      <div className="flex flex-col space-y-1">
        <div className="text-base font-semibold text-gray-900">Kirim Email</div>
        <div className="text-sm text-gray-500">
          Faktur akan dikirimkan ke <span className="underline">{props.recipient.email}</span> dan{" "}
          <span className="underline">{props.recipient.name}</span> dapat membayar melalui link yang akan dkirimkan via
          email.
        </div>
      </div>
    </LoonasCheckbox>
  );
}
