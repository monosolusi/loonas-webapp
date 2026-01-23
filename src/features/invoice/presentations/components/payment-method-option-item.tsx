"use client";

import { useMemo } from "react";
import { PaymentMethodOptionItemProps } from "@/features/invoice/presentations/components/payment-method-option-item.types";
import { useCreateIncomingInvoiceProvider } from "@/features/invoice/presentations/providers/create-incoming-invoice";
import { IDRFormatter } from "@/core/utilities/currency/domain/formatters/idr-formatter";
import clsx from "clsx";
import Image from "next/image";
import { useGetPaymentMethodLimit } from "@/features/payment/presentations/hooks/use-get-payment-method-limit";

export function PaymentMethodOptionItem(props: PaymentMethodOptionItemProps) {
  const { invoices, paymentMethod, setPaymentMethod } = useCreateIncomingInvoiceProvider();
  const { data: limit, isLoading: isLimitLoading } = useGetPaymentMethodLimit({ id: props.selection.gateway.id });

  const totalAmount = useMemo(() => {
    return invoices.reduce((acc, curr) => acc + curr.amount, 0);
  }, [invoices]);

  const disabled = useMemo(() => {
    return isLimitLoading || !limit || !limit.payIn.isSupported || totalAmount < limit.payIn.min;
  }, [limit, isLimitLoading, totalAmount]);

  const feeInString = useMemo(() => {
    const totalFee = props.selection.calculateFee({ amount: totalAmount });
    if (totalFee === 0) return "gratis";
    else return IDRFormatter.toCurrency(totalFee);
  }, [props.selection, totalAmount]);

  const onSelectionClick = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation();

    if (!setPaymentMethod || disabled) return;
    return setPaymentMethod({
      gateway: props.selection.gateway,
      scheme: props.selection.scheme,
      display: {
        feeInString: feeInString,
        feeInNumber: props.selection.calculateFee({ amount: totalAmount }),
      },
    });
  };

  const isSelected = useMemo(() => {
    return (
      !!paymentMethod &&
      props.selection.gateway.id === paymentMethod.gateway.id &&
      props.selection.scheme?.id === paymentMethod.scheme?.id
    );
  }, [paymentMethod, props.selection]);

  return (
    <div
      className={clsx(
        "flex flex-row items-center gap-x-4 rounded-lg border p-4",
        disabled ? "cursor-not-allowed border-neutral-200 bg-neutral-50 opacity-50" : "cursor-pointer",
        !disabled && isSelected && "border-primary-300 bg-primary-300/5",
        !disabled && !isSelected && "border-neutral-200",
      )}
      onClick={onSelectionClick}
    >
      <div className="flex size-10 flex-row items-center justify-center rounded-lg border border-neutral-100">
        <Image src="/assets/images/credit-card-icon-neutral-400-w16-h16.svg" alt="" width={20} height={20} />
      </div>
      <div className="flex flex-1 flex-col">
        <div className={clsx("text-sm leading-5 font-bold", disabled && "text-neutral-400")}>
          {props.selection.title}
        </div>
        <div className={clsx("text-xs leading-4", disabled && "text-neutral-400")}>Biaya {feeInString}</div>
      </div>
      <div
        className={clsx(
          "size-5 rounded-full border-2",
          disabled
            ? "border-neutral-200 bg-neutral-100"
            : isSelected
              ? "border-primary-300 bg-primary-300"
              : "border-neutral-300 bg-white",
        )}
      />
    </div>
  );
}
