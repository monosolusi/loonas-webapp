import {
  DiscountType,
  TaxType
} from "@/app/(authenticated)/invoices/outgoing/create/_providers/create-outgoing-invoice";
import { TextInputWithLeftAddOn } from "@/core/presentations/components/text-input-with-left-add-on";
import React, { useMemo } from "react";
import { TaxCalculator } from "@/core/utilities/tax/domain/calculator";

interface TotalWithTaxFieldProps {
  price?: number;
  qty?: number;
  discountType?: DiscountType;
  discount?: number;
  taxType?: TaxType;
  tax?: number;
}

export function TotalWithTaxField(props: TotalWithTaxFieldProps) {
  const totalWithTax = useMemo(() => {
    if (!props.price || !props.qty) return 0;

    const amountBeforeTax = TaxCalculator.calculateAmountBeforeTax({
      price: props.price,
      qty: props.qty,
      discountType: props.discountType,
      discount: props.discount
    });

    if (!props.taxType || props.taxType === TaxType.NON_TAXABLE) return amountBeforeTax;

    const taxBase = TaxCalculator.calculateTaxBase({
      base: amountBeforeTax,
      taxType: props.taxType,
      tax: props.tax
    });
    

    return TaxCalculator.calculateTotalWithTax({
      taxType: props.taxType,
      tax: props.tax ?? 0,
      taxBase: taxBase,
      base: amountBeforeTax
    });
  }, [props.price, props.qty, props.discountType, props.discount, props.tax, props.taxType]);

  return (
    <TextInputWithLeftAddOn
      title="Total"
      leftAddOn="Rp"
      textDirection="text-right"
      value={totalWithTax.toLocaleString("id-ID")}
      disabled
    />
  );
}
