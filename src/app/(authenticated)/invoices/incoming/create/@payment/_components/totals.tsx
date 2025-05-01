import React from "react";
import { IDRFormatter } from "@/core/utilities/currency/domain/formatters/idr-formatter";
import { useCreateIncomingInvoice } from "@/features/invoice/presentations/providers/create-incoming-invoice";
import { PaymentGatewayEntity } from "@/features/payment/domain/entities/payment-gateway";

export function Totals() {
  const { paymentGateway, invoiceDocuments } = useCreateIncomingInvoice();

  const totalAmount = React.useMemo(() =>
      invoiceDocuments.reduce((sum, doc) => sum + doc.amount, 0),
    [invoiceDocuments]
  );

  const calculateFees = (gateway: PaymentGatewayEntity) => {
    const baseFee = gateway.pricing.baseFee;
    const percentageFee = (gateway.pricing.percentageFee / 100) * totalAmount;
    return baseFee + percentageFee;
  };

  const calculateTotalToBePaid = () => {
    if (!paymentGateway) return totalAmount;
    return totalAmount + calculateFees(paymentGateway);
  };

  return (
    <div className="border-t pt-4 mt-4">
      <div className="flex justify-between text-sm mb-2">
        <span className="text-gray-600">Total Faktur</span>
        <span className="text-gray-900 font-medium">{IDRFormatter.toCurrency(totalAmount)}</span>
      </div>

      {paymentGateway && (paymentGateway.pricing.baseFee > 0 || paymentGateway.pricing.percentageFee > 0) && (
        <div className="flex justify-between text-sm mb-2">
          <span className="text-gray-600">
            Biaya {paymentGateway.title}
          </span>
          <span className="text-gray-900 font-medium">{IDRFormatter.toCurrency(calculateFees(paymentGateway))}</span>
        </div>
      )}

      <div className="flex justify-between text-base font-medium mt-4">
        <span className="text-gray-900">Total Pembayaran</span>
        <span className="text-primary-default">{IDRFormatter.toCurrency(calculateTotalToBePaid())}</span>
      </div>
    </div>
  );
}