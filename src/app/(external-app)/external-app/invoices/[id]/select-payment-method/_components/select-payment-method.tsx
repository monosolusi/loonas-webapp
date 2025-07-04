"use client";

import { RadioGroup } from "@headlessui/react";
import { useMemo } from "react";
import { PaymentMethodItem } from "./payment-method-item";

interface SelectPaymentMethodProps {
  value?: string;
  onChange?: (id: string) => void;
  data: {
    id: string;
    isActive: boolean;
    title: string;
    schemes: { name: string }[];
    limit: { min: number; max: number };
    pricing: { base: number; percentage: number };
  }[];
}

export function SelectPaymentMethod(props: SelectPaymentMethodProps) {
  const methodItemData = useMemo(
    () =>
      props.data.map((method) => ({
        disabled: !method.isActive,
        method: method.title.toLowerCase(),
        title: method.title,
        description: method.schemes.map((scheme) => scheme.name).join(", "),
        limit: method.limit,
        pricing: method.pricing,
        value: method.id,
      })),
    [props.data],
  );

  return (
    <RadioGroup value={props.value || null} className="flex flex-col space-y-4">
      {methodItemData.map((item) => (
        <PaymentMethodItem {...item} key={item.value} />
      ))}
    </RadioGroup>
  );
}
