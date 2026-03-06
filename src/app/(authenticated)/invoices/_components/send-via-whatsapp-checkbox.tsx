"use client";
import { LoonasCheckbox } from "@/core/presentations/components/loonas-checkbox";
import React from "react";

export interface SendViaWhatsappCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  recipient: { phoneNumber?: string; name: string };
  isAvailable: boolean;
}

export function SendViaWhatsappCheckbox(props: SendViaWhatsappCheckboxProps) {
  if (!props.isAvailable) return null;
  if (!props.recipient.phoneNumber) return null;
  return (
    <LoonasCheckbox checked={props.checked} onChange={props.onChange} disabled={props.disabled}>
      <div className="flex flex-col space-y-1">
        <div className="text-base font-semibold text-neutral-500">Kirim WhatsApp</div>
        <div className="text-sm text-neutral-300">
          Faktur akan dikirimkan ke <span className="underline">{props.recipient.phoneNumber}</span> dan{" "}
          <span className="underline">{props.recipient.name}</span> dapat membayar melalui link yang akan dkirimkan via
          WhatsApp.
        </div>
      </div>
    </LoonasCheckbox>
  );
}
