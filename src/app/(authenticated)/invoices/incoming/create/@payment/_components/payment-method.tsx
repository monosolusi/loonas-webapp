import { RadioGroup } from "@headlessui/react";
import {
  PaymentMethodItem
} from "@/app/(authenticated)/invoices/incoming/create/@payment/_components/payment-method-item";
import React from "react";
import { usePaymentGateway } from "@/features/payment/presentations/providers/payment-gateway";
import { useCreateIncomingInvoice } from "@/features/invoice/presentations/providers/create-incoming-invoice";
import { PaymentGatewayEntity } from "@/features/payment/domain/entities/payment-gateway";

export function PaymentMethod() {
  const { paymentGateways } = usePaymentGateway();
  const { paymentGateway, setPaymentGateway, setPaymentScheme } = useCreateIncomingInvoice();

  const handleSelectGateway = (gateway: PaymentGatewayEntity) => {
    if (!setPaymentGateway) return;
    if (!setPaymentScheme) return;

    setPaymentGateway(gateway);
    setPaymentScheme(undefined);
  };

  return (
    <RadioGroup value={paymentGateway || null} onChange={handleSelectGateway}>
      <div className="flex flex-col space-y-4">
        {paymentGateways.map((gateway) => <PaymentMethodItem key={gateway.id} payment={gateway} />)}
      </div>
    </RadioGroup>
  );
}