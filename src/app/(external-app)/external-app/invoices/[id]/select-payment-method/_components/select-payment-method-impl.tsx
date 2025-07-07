"use client";

import React from "react";
import { useGetPublicOutgoingInvoice } from "@/features/invoice/presentations/hooks/use-get-public-outgoing-invoice";
import { useParams } from "next/navigation";
import { SelectPaymentMethod } from "./select-payment-method";
import { useMemo } from "react";

interface SelectPaymentMethodImplProps {
  selectedPaymentMethod?: {
    id: string;
    title: string;
    requiresSchemeSelection: boolean;
    schemes?: { id: string; imageUrl: string; name: string }[];
  };
  setSelectedPaymentMethod?: React.Dispatch<
    React.SetStateAction<
      | {
          id: string;
          title: string;
          requiresSchemeSelection: boolean;
          schemes?: { id: string; imageUrl: string; name: string }[];
        }
      | undefined
    >
  >;
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
    if (!setSelectedPaymentMethod) return;

    const paymentMethod = invoice.paymentMethods.find((method) => method.id === value);
    if (!paymentMethod) return;

    setSelectedPaymentMethod({
      id: paymentMethod.id,
      title: paymentMethod.title,
      requiresSchemeSelection: paymentMethod.requiresSchemeSelection,
      schemes: paymentMethod.schemes.map((scheme) => ({
        id: scheme.id,
        imageUrl: scheme.imageUrl,
        name: scheme.name,
      })),
    });
  };

  return <SelectPaymentMethod data={data} value={selectedPaymentMethod?.id} onChange={handlePaymentMethodChange} />;
}
