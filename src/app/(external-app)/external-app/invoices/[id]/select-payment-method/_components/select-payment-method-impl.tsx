"use client";

import React from "react";
import { useGetPublicOutgoingInvoice } from "@/features/invoice/presentations/hooks/use-get-public-outgoing-invoice";
import { useParams } from "next/navigation";
import { SelectPaymentMethod } from "./select-payment-method";
import { useMemo, useState } from "react";

interface SelectPaymentMethodImplProps {
  selectedPaymentMethod: string | undefined;
  setSelectedPaymentMethod: React.Dispatch<React.SetStateAction<string | undefined>>;
}

export function SelectPaymentMethodImpl(props: SelectPaymentMethodImplProps) {
  const { id } = useParams<{ id: string }>();
  const { invoice } = useGetPublicOutgoingInvoice({ id });
  const { selectedPaymentMethod, setSelectedPaymentMethod } = props;

  const data = useMemo(() => {
    if (!invoice) return [];

    return invoice.paymentMethods.map((method) => ({
      id: method.id,
      isActive: method.isActive,
      title: method.title,
      schemes: method.schemes.map((scheme) => ({ name: scheme.name })),
      limit: method.limit,
      pricing: method.pricing,
      value: method.id,
    }));
  }, [invoice]);

  const handlePaymentMethodChange = (value: string) => {
    // Find the paymentMethod from the invoice by its id
    if (!invoice) return;

    const paymentMethod = invoice.paymentMethods.find((method) => method.id === value);
    if (!paymentMethod) return;

    setSelectedPaymentMethod(paymentMethod.id);
  };

  return <SelectPaymentMethod data={data} value={selectedPaymentMethod} onChange={handlePaymentMethodChange} />;
}
