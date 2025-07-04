"use client";

import { useGetPublicOutgoingInvoice } from "@/features/invoice/presentations/hooks/use-get-public-outgoing-invoice";
import { useParams } from "next/navigation";
import { SelectPaymentMethod } from "./select-payment-method";
import { useMemo } from "react";

export function SelectPaymentMethodImpl() {
  const { id } = useParams<{ id: string }>();
  const { invoice } = useGetPublicOutgoingInvoice({ id });

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

  return <SelectPaymentMethod data={data} />;
}
