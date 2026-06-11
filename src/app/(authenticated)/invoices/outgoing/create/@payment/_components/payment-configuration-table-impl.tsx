import { PaymentConfigurationTable } from "@/app/(authenticated)/invoices/outgoing/create/@payment/_components/payment-configuration-table";
import { useEffect, useMemo, useRef } from "react";
import { IDRFormatter } from "@/core/utilities/currency/domain/formatters/idr-formatter";
import { useCreateOutgoingInvoice } from "@/app/(authenticated)/invoices/outgoing/create/_providers/create-outgoing-invoice";
import { ChargeFeeOn } from "@/features/invoice/domain/enums/charge-fee-on";
import { useListPaymentMethod } from "@/features/payment/presentations/hooks/use-list-payment-method";

export function PaymentConfigurationTableImpl() {
  const { paymentConfiguration, setPaymentConfiguration } = useCreateOutgoingInvoice();
  const { paymentMethods, loading, error } = useListPaymentMethod();
  const hasInitialized = useRef(false);

  useEffect(() => {
    if (!paymentMethods || !setPaymentConfiguration || hasInitialized.current) return;
    hasInitialized.current = true;

    setPaymentConfiguration(
      paymentMethods.map((gateway) => ({
        paymentMethod: gateway,
        isEnabled: gateway.isActive,
        chargeFeeOn: ChargeFeeOn.INVOICE_RECEIVER,
      })),
    );
  }, [paymentMethods, setPaymentConfiguration]);

  const formattedData = useMemo(() => {
    const generateFeeInText = (variableFee: number, fixedFee: number) => {
      if (variableFee > 0 && fixedFee > 0) return `${variableFee}% + ${IDRFormatter.toCurrency(fixedFee)}`;
      if (variableFee > 0) return `${variableFee}%`;
      if (fixedFee > 0) return IDRFormatter.toCurrency(fixedFee);
      return "Gratis";
    };

    return paymentConfiguration.map((configuration) => ({
      id: configuration.paymentMethod.id,
      name: configuration.paymentMethod.title,
      isEnabled: configuration.isEnabled,
      chargeFeeOn: configuration.chargeFeeOn,
      paymentSchemes: configuration.paymentMethod.schemes.map((scheme) => ({
        name: scheme.name,
        image: scheme.logoUrl,
      })),
      feeInText: generateFeeInText(
        configuration.paymentMethod.pricing.percentageFee,
        configuration.paymentMethod.pricing.baseFee,
      ),
    }));
  }, [paymentConfiguration]);

  const handleEnableChange = (params: { id: string; isEnabled: boolean }) => {
    if (!setPaymentConfiguration) return;
    setPaymentConfiguration((prev) => {
      const index = prev.findIndex((item) => item.paymentMethod.id === params.id);
      if (index === -1) return prev;
      prev[index].isEnabled = params.isEnabled;
      return [...prev];
    });
  };

  const handleChargeFeeOnChange = (params: { id: string; chargeFeeOn: ChargeFeeOn }) => {
    if (!setPaymentConfiguration) return;
    setPaymentConfiguration((prev) => {
      const index = prev.findIndex((item) => item.paymentMethod.id === params.id);
      if (index === -1) return prev;
      prev[index].chargeFeeOn = params.chargeFeeOn;
      return [...prev];
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-sm text-neutral-300">Memuat metode pembayaran...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-sm text-error-500">Gagal memuat metode pembayaran. Silakan coba lagi.</div>
      </div>
    );
  }

  return (
    <PaymentConfigurationTable
      data={formattedData}
      onEnableChange={handleEnableChange}
      onChargeFeeOnChange={handleChargeFeeOnChange}
    />
  );
}
