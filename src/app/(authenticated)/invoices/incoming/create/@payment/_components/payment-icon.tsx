import React from "react";
import { BanknotesIcon, CreditCardIcon, QrCodeIcon } from "@heroicons/react/24/outline";

export function PaymentIcon(props: { type: string }) {
  const paymentIconMap: Record<string, React.ReactNode> = {
    "credit card": <CreditCardIcon className="h-10 w-10 text-gray-600" />,
    qris: <QrCodeIcon className="h-10 w-10 text-gray-600" />,
    "virtual account": <BanknotesIcon className="h-10 w-10 text-gray-600" />,
  };

  const selectedIcon = paymentIconMap[props.type];
  if (!selectedIcon) return null;
  else return selectedIcon;
}
