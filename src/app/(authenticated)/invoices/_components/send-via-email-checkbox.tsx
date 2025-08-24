"use client";

import { LoonasCheckbox } from "@/core/presentations/components/loonas-checkbox";
import React from "react";

export interface SendViaEmailCheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  recipient: { email: string; name: string };
  isAvailable: boolean;
}

export function SendViaEmailCheckbox(props: SendViaEmailCheckboxProps) {
  if (!props.isAvailable) return null;
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
