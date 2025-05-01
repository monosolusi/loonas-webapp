import { PaymentGatewayEntity } from "@/features/payment/domain/entities/payment-gateway";
import { PaymentIcon } from "@/app/(authenticated)/invoices/incoming/create/@payment/_components/payment-icon";
import { Label, Radio } from "@headlessui/react";
import { AvailableScheme } from "@/app/(authenticated)/invoices/incoming/create/@payment/_components/available-scheme";
import React from "react";
import { IDRFormatter } from "@/core/utilities/currency/domain/formatters/idr-formatter";

export function PaymentMethodItem({ payment }: { payment: PaymentGatewayEntity }) {

  const formatFeeText = (gateway: PaymentGatewayEntity) => {
    const hasBaseFee = gateway.pricing.baseFee > 0;
    const hasPercentageFee = gateway.pricing.percentageFee > 0;

    if (hasBaseFee && hasPercentageFee) {
      return `${IDRFormatter.toCurrency(gateway.pricing.baseFee)} + ${gateway.pricing.percentageFee}%`;
    } else if (hasBaseFee) {
      return IDRFormatter.toCurrency(gateway.pricing.baseFee);
    } else if (hasPercentageFee) {
      return `${gateway.pricing.percentageFee}%`;
    } else {
      return "Gratis";
    }
  };

  return (
    <Radio value={payment} className="group">
      <div
        className="rounded-lg border p-4 cursor-pointer focus:outline-none border-gray-200 group-data-checked:border-primary-default group-data-checked:ring-1 group-data-checked:ring-primary-default"
      >
        <div className="flex items-center">
          {/* Left: Icon/Logo */}
          <div className="flex-shrink-0 mr-4">
            <PaymentIcon payment={payment} />
          </div>

          {/* Center: Payment method info */}
          <div className="flex-1 min-w-0">
            <Label as="h3" className="text-base font-medium text-gray-900">
              {payment.title}
            </Label>
            <div className="mt-1 flex flex-wrap items-center">
              <AvailableScheme schemes={payment.schemes} />
            </div>
            <p className="mt-1 text-xs text-gray-500">Estimasi Pencairan: 1 hari kerja</p>
          </div>

          {/* Right: Fees */}
          <div className="flex-shrink-0 ml-4 text-right">
            <p className="text-sm font-medium text-gray-900">Fee</p>
            <p className="text-sm text-gray-700">
              {formatFeeText(payment)}
            </p>
          </div>

          {/* Radio button */}
          <div className="flex-shrink-0 ml-4">
            <span
              className="bg-white border-gray-300 rounded-full h-5 w-5 flex items-center justify-center border group-data-checked:bg-primary-default group-data-checked:border-transparent"
            >
              <span className="hidden rounded-full bg-white h-2 w-2 group-data-checked:block" />
            </span>
          </div>
        </div>
      </div>
    </Radio>
  );
}