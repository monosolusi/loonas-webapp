import { PaymentConfigurationTable } from "@/app/(authenticated)/invoices/outgoing/create/@payment/_components/payment-configuration-table";
import { useListPaymentMethod } from "@/features/payment/presentations/hooks/use-list-payment-method";
import { useMemo } from "react";
import { IDRFormatter } from "@/core/utilities/currency/domain/formatters/idr-formatter";

export function PaymentConfigurationTableImpl() {
  const { paymentMethods } = useListPaymentMethod();

  const formattedData = useMemo(() => {
    if (!paymentMethods) return [];
    const generateFeeInText = (variableFee: number, fixedFee: number) => {
      if (variableFee > 0 && fixedFee > 0) return `${variableFee}% + ${IDRFormatter.toCurrency(fixedFee)}`;
      if (variableFee > 0) return `${variableFee}%`;
      if (fixedFee > 0) return IDRFormatter.toCurrency(fixedFee);
      return "Gratis";
    };

    return paymentMethods.map((paymentMethod) => ({
      id: paymentMethod.id,
      name: paymentMethod.title,
      isEnabled: true,
      paymentSchemes: paymentMethod.schemes.map((scheme) => ({
        name: scheme.name,
        image: scheme.logoUrl,
      })),
      feeInText: generateFeeInText(paymentMethod.pricing.percentageFee, paymentMethod.pricing.baseFee),
    }));
  }, [paymentMethods]);

  return <PaymentConfigurationTable data={formattedData} />;
}