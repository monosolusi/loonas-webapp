import {
  DiscountType,
  TaxType
} from "@/app/(authenticated)/invoices/outgoing/create/_providers/create-outgoing-invoice";
import { TextInputWithLeftAddOn } from "@/core/presentations/components/text-input-with-left-add-on";
import React, { useMemo } from "react";
import { TaxCalculator } from "@/core/utilities/tax/domain/calculator";

interface TaxBaseFieldProps {
  price?: number;
  qty?: number;
  discountType?: DiscountType;
  discount?: number;
  taxType?: TaxType;
  tax?: number;
}

export function TaxBaseField(props: TaxBaseFieldProps) {

  const taxBase = useMemo(() => {
    if (!props.price || !props.qty) return 0;

    const amountBeforeTax = TaxCalculator.calculateAmountBeforeTax({
      price: props.price,
      qty: props.qty,
      discountType: props.discountType,
      discount: props.discount
    });

    return TaxCalculator.calculateTaxBase({
      base: amountBeforeTax,
      taxType: props.taxType,
      tax: props.tax
    });
  }, [props.price, props.qty, props.discountType, props.discount, props.taxType, props.tax]);

  return (
    <TextInputWithLeftAddOn
      title="DPP"
      leftAddOn="Rp"
      value={taxBase.toLocaleString("id-ID")}
      textDirection="text-right"
      disabled
    />
  );
}
