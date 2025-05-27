import { DiscountType } from "@/app/(authenticated)/invoices/outgoing/create/_providers/create-outgoing-invoice";
import { TextInput } from "@/core/presentations/components/text-input";
import { TextInputWithRightAddOn } from "@/core/presentations/components/text-input-with-right-add-on";
import React from "react";
import { TextInputWithLeftAddOn } from "@/core/presentations/components/text-input-with-left-add-on";

interface DiscountInputProps {
  type?: DiscountType;
  value?: number;
  onChange?: (value: number) => void;
}

export function DiscountInput(props: DiscountInputProps) {
  const handleChange = (value: string) => {
    if (!props.onChange) return;
    const numberValue = Number(value.replace(/\./g, ""));
    props.onChange(numberValue);
  };

  if (props.type === DiscountType.NO_DISCOUNT) {
    return <TextInput title="Diskon" disabled />;
  } else if (props.type === DiscountType.PERCENTAGE) {
    return (
      <TextInputWithRightAddOn
        title="Diskon"
        rightAddOn="%"
        value={props.value?.toLocaleString("id-ID")}
        onChange={handleChange}
        textDirection="text-right"
      />
    );
  } else if (props.type === DiscountType.FIXED) {
    return (
      <TextInputWithLeftAddOn
        title="Diskon"
        leftAddOn="Rp"
        textDirection="text-right"
        value={props.value?.toLocaleString("id-ID")}
        onChange={handleChange}
      />
    );
  } else return <TextInput title="Diskon" disabled />;
  ;
}
