"use client";

import React from "react";
import { RadioGroup } from "@headlessui/react";
import { PaymentMethodItem } from "@/app/(authenticated)/invoices/incoming/create/@payment/_components/payment-method-item";
import { useCreateIncomingInvoice } from "@/features/invoice/presentations/providers/create-incoming-invoice";
import { PaymentGatewayEntity } from "@/features/payment/domain/entities/payment-gateway";
import { useListPaymentMethod } from "@/features/payment/presentations/hooks/use-list-payment-method";
import { PaymentMethodItemImpl } from "./payment-method-item-impl";

export function PaymentMethod() {
  const { paymentMethods } = useListPaymentMethod();
  const { paymentGateway, setPaymentGateway, setPaymentScheme } = useCreateIncomingInvoice();

  const handleSelectGateway = (gateway: PaymentGatewayEntity) => {
    if (!setPaymentGateway) return;
    if (!setPaymentScheme) return;

    setPaymentGateway(gateway);
    setPaymentScheme(undefined);
  };

  if (!paymentMethods) return null;
  return (
    <RadioGroup value={paymentGateway || null} onChange={handleSelectGateway}>
      <div className="flex flex-col space-y-4">
        {paymentMethods.map((gateway) => (
          <PaymentMethodItemImpl key={gateway.id} method={gateway} />
        ))}
      </div>
    </RadioGroup>
  );
}
