import React, { useMemo } from "react";
import { TextInputWithLeftAddOn } from "@/core/presentations/components/text-input-with-left-add-on";
import { TaxType } from "@/features/tax/domain/enums/tax-type";
import { TextInput } from "@/core/presentations/components/text-input";

interface TaxBaseFieldProps {
  taxType: TaxType;
  value?: number;
  onChange?: (value: number) => void;
}

export function TaxBaseField(props: TaxBaseFieldProps) {
  const isDisabled = useMemo(() => {
    const manualEntry = [TaxType.MANUAL_EXCLUSIVE, TaxType.MANUAL_INCLUSIVE];
    return !manualEntry.includes(props.taxType);
  }, [props.taxType]);

  const handleChange = (value: string) => {
    if (props.onChange) {
      const numberValue = Number(value.replace(/\./g, ""));
      props.onChange(numberValue);
    }
  };

  if (props.value === undefined || props.value === null || isDisabled) return <TextInput title="DPP" disabled />;
  return (
    <TextInputWithLeftAddOn
      value={props.value.toLocaleString("id-ID")}
      onChange={handleChange}
      title="DPP"
      leftAddOn="Rp"
      textDirection="text-right"
      disabled={isDisabled}
    />
  );
}
