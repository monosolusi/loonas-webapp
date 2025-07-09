"use client";

import { LogoImage } from "@/core/presentations/components/logo-image";
import { InvoiceMetadataImpl } from "./_components/invoice-metadata-impl";
import { SelectPaymentMethodImpl } from "./_components/select-payment-method-impl";
import { useState } from "react";
import { SelectSchemeImpl } from "./_components/select-scheme-impl";
import { PaymentSummaryImpl } from "./_components/payment-summary-impl";

interface SelectedPaymentMethod {
  id: string;
  title: string;
  requiresSchemeSelection: boolean;
  schemes?: { id: string; imageUrl: string; name: string }[];
  pricing: { base: number; percentage: number };
}

export default function SelectPaymentMethodPage() {
  const [selectedScheme, setSelectedScheme] = useState<string | undefined>(undefined);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<SelectedPaymentMethod>();

  const handleSelectedPaymentMethodChange = (paymentMethod: SelectedPaymentMethod) => {
    setSelectedPaymentMethod(paymentMethod);
    setSelectedScheme(undefined);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex flex-col space-y-4">
        <div className="flex-1 self-start">
          <LogoImage />
        </div>
        <div className="flex-1">
          <InvoiceMetadataImpl />
        </div>
        <div className="flex flex-1 flex-col space-y-4">
          <div className="flex-1">
            <h1 className="text-base font-semibold text-gray-900">Pilih Metode Pembayaran</h1>
            <p className="mt-2 text-sm text-gray-700">
              Pilih metode pembayaran yang ingin kamu gunakan untuk membayar faktur ini.
            </p>
          </div>
          <div className="flex flex-row space-x-4">
            <div className="flex-2">
              <SelectPaymentMethodImpl value={selectedPaymentMethod} onChange={handleSelectedPaymentMethodChange} />
              <SelectSchemeImpl
                selectedMethod={selectedPaymentMethod}
                value={selectedScheme}
                onChange={setSelectedScheme}
              />
            </div>
            <div className="flex-1">
              <PaymentSummaryImpl selectedPaymentMethod={selectedPaymentMethod} selectedScheme={selectedScheme} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
