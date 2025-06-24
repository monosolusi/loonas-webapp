import { PaymentGatewayEntity } from "@/features/payment/domain/entities/payment-gateway";
import { useMemo } from "react";
import { PaymentMethodItem } from "./payment-method-item";
import { useCreateIncomingInvoice } from "@/features/invoice/presentations/providers/create-incoming-invoice";
import { useGetPaymentMethodLimit } from "@/features/payment/presentations/hooks/use-get-payment-method-limit";

export function PaymentMethodItemImpl(props: { method: PaymentGatewayEntity }) {
  const { limit } = useGetPaymentMethodLimit({ id: props.method.id });
  const { invoiceDocuments } = useCreateIncomingInvoice();

  const data = useMemo(() => {
    const totalAmount = invoiceDocuments.reduce((prev, curr) => prev + curr.amount, 0);
    const fee = props.method.pricing.baseFee + (props.method.pricing.percentageFee / 100) * totalAmount;
    const totalPayable = totalAmount + fee;

    return {
      value: props.method,
      type: props.method.title.toLowerCase(),
      pricing: { base: props.method.pricing.baseFee, percentage: props.method.pricing.percentageFee },
      title: props.method.title,
      description: props.method.schemes.map((scheme) => scheme.name).join(" • "),
      limit: limit && limit?.payIn.isSupported ? { min: limit.payIn.min, max: limit.payIn.max } : undefined,
      disabled: !limit
        ? true
        : limit.payIn.isSupported
          ? !(totalPayable >= limit.payIn.min && totalPayable <= limit.payIn.max)
          : true,
    };
  }, [props.method, limit, invoiceDocuments]);

  return <PaymentMethodItem {...data} />;
}
