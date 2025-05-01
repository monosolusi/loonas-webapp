"use client";

import React from "react";
import { PaymentSchemeEntity } from "@/features/payment/domain/entities/payment-scheme";
import { useCreateIncomingInvoice } from "@/features/invoice/presentations/providers/create-incoming-invoice";

export function SchemeSelection() {
  const { setPaymentScheme, paymentGateway, paymentScheme } = useCreateIncomingInvoice();

  const handleSelectScheme = (scheme: PaymentSchemeEntity) => {
    if (!setPaymentScheme) return;
    setPaymentScheme(scheme);
  };

  if (!paymentGateway) return null;
  if (!paymentGateway.requiresSchemeSelection) return null;
  return (
    <div className="mt-6 border-t pt-6">
      <h3 className="text-sm font-medium text-gray-900 mb-4">Pilih {paymentGateway.title}:</h3>
      <div className="grid grid-cols-3 gap-4">
        {paymentGateway.schemes.map((scheme) => (
          <div
            key={scheme.id}
            className={`flex cursor-pointer flex-col items-center rounded-md border p-3 ${
              paymentScheme?.id === scheme.id
                ? "border-primary-default bg-primary-50"
                : "border-gray-200"
            }`}
            onClick={() => handleSelectScheme(scheme)}
          >
            <img
              src={scheme.logoUrl}
              alt={scheme.name}
              className="h-8 w-auto object-contain"
            />
            <span className="mt-2 text-xs text-gray-700">{scheme.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}