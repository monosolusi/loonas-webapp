import { PaymentIcon } from "@/app/(authenticated)/invoices/incoming/create/@payment/_components/payment-icon";
import { CurrencyDisplay } from "@/core/presentations/components/currency-display";
import { Label, Radio } from "@headlessui/react";
import clsx from "clsx";

interface PaymentMethodItemProps {
  disabled?: boolean;
  method: string; // e.g., "credit card", "bank transfer"
  title: string;
  description: string;
  limit: { min: number; max: number };
  pricing: { base: number; percentage: number };
  value: string;
}

export function PaymentMethodItem(props: PaymentMethodItemProps) {
  const formatFeeText = (pricing: { base: number; percentage: number }) => {
    const hasBaseFee = pricing.base > 0;
    const hasPercentageFee = pricing.percentage > 0;

    if (hasBaseFee && hasPercentageFee) {
      return (
        <>
          <CurrencyDisplay value={pricing.base} /> + {pricing.percentage}%
        </>
      );
    } else if (hasBaseFee) {
      return <CurrencyDisplay value={pricing.base} />;
    } else if (hasPercentageFee) {
      return <>{pricing.percentage}%</>;
    } else {
      return "Gratis";
    }
  };

  return (
    <Radio value={props.value} disabled={props.disabled}>
      {({ checked, disabled }) => (
        <div
          className={clsx(
            "rounded-sm p-4",
            checked && "border-primary-default ring-primary-default cursor-pointer border ring-1 focus:outline-none",
            !disabled && "cursor-pointer border border-gray-200",
            disabled && "cursor-not-allowed bg-gray-100",
          )}
        >
          <div className="flex items-center">
            {/* Left: Icon/Logo */}
            <div className="mr-4 flex-shrink-0">
              <PaymentIcon type={props.method} />
            </div>

            {/* Center: Payment method info */}
            <div className="min-w-0 flex-1">
              <Label as="h3" className="text-base font-medium text-gray-900">
                {props.title}
              </Label>
              <div className="mt-1 flex flex-wrap items-center text-xs text-gray-500">{props.description}</div>
              <p className="mt-1 text-xs text-gray-500">Estimasi Pencairan: 1 hari kerja</p>
              <p className="mt-1 text-xs text-gray-500">
                Minimum Nominal: <CurrencyDisplay value={props.limit.min} />
              </p>
              <p className="mt-1 text-xs text-gray-500">
                Maximum Nominal: <CurrencyDisplay value={props.limit.max} />
              </p>
            </div>

            {/* Right: Fees */}
            <div className="ml-4 flex-shrink-0 text-right">
              <p className="text-sm font-medium text-gray-900">Fee</p>
              <p className="text-sm text-gray-700">{formatFeeText(props.pricing)}</p>
            </div>

            {/* Radio button */}
            <div className="ml-4 flex-shrink-0">
              <span
                className={clsx(
                  "flex h-5 w-5 items-center justify-center rounded-full border",
                  !checked && disabled && "border-gray-300 bg-gray-300",
                  checked && "bg-primary-default border-transparent",
                )}
              >
                {checked && <span className="block h-2 w-2 rounded-full bg-white" />}
              </span>
            </div>
          </div>
        </div>
      )}
    </Radio>
  );
}
