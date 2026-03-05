"use client";

import { useMemo } from "react";
import { PaymentMethodOptionItemProps } from "@/features/invoice/presentations/components/payment-method-option-item.types";
import { useCreateIncomingInvoiceProvider } from "@/features/invoice/presentations/providers/create-incoming-invoice";
import { IDRFormatter } from "@/core/utilities/currency/domain/formatters/idr-formatter";
import { useGetPaymentMethodLimit } from "@/features/payment/presentations/hooks/use-get-payment-method-limit";
import { PaymentMethodOptionCard } from "@/features/payment/presentations/components/payment-method-option-card";

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
    <PaymentMethodOptionCard
      title={props.selection.title}
      feeLabel={feeInString}
      isSelected={isSelected}
      isDisabled={disabled}
      onClick={onSelectionClick}
    />
  );
}
