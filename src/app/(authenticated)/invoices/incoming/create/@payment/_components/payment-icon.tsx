import React from "react";
import { BanknotesIcon, CreditCardIcon, QrCodeIcon } from "@heroicons/react/24/outline";
import { PaymentGatewayEntity } from "@/features/payment/domain/entities/payment-gateway";


export function PaymentIcon({ payment }: { payment?: PaymentGatewayEntity }) {
  const paymentIconMap: Record<string, React.ReactNode> = {
    "Credit Card": <CreditCardIcon className="h-10 w-10 text-gray-600" />,
    "QRIS": <QrCodeIcon className="h-10 w-10 text-gray-600" />,
    "Virtual Account": <BanknotesIcon className="h-10 w-10 text-gray-600" />
  };

  if (!payment) return null;
  return paymentIconMap[payment.title] || <CreditCardIcon className="h-10 w-10 text-gray-600" />;
}