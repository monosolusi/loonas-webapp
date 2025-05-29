"use client";

import React, { useMemo } from "react";
import { TaxType } from "@/features/tax/domain/enums/tax-type";
import { FilledButton } from "@/core/presentations/components/filled-button";
import { useAddItem } from "@/app/(authenticated)/invoices/outgoing/create/@items/_providers/add-item";
import { TaxCalculator } from "@/core/utilities/tax/domain/calculator";
import { useCalculateTax } from "@/features/tax/presentation/hooks/use-calculate-tax";

export function CalculateTaxButton() {
  const { trigger, isMutating } = useCalculateTax();
  const {
    price,
    qty,
    discount,
    discountType,
    taxType,
    tax,
    taxBase,
    mustRecalculateTax,
    setTax,
    setTaxBase,
    setTotal,
    recalculated,
  } = useAddItem();

  const isDisabled = useMemo(() => {
    if (taxType === TaxType.NON_TAXABLE) return true;
    else if (isMutating) return true;
    else return !mustRecalculateTax;
  }, [taxType, mustRecalculateTax, isMutating]);

  const handleClick = async () => {
    if (!recalculated) return;
    if (!setTax) return;
    if (!setTaxBase) return;
    if (!setTotal) return;

    const amountBeforeTax = TaxCalculator.calculateAmountBeforeTax({ price, qty, discount, discountType });
    const result = await trigger({
      amountBeforeTax: amountBeforeTax,
      taxType: taxType,
      tax: tax,
      taxBase: taxBase,
    });

    setTax(result.tax);
    setTaxBase(result.taxBase);
    setTotal(result.amountAfterTax);

    recalculated();
  };

  return (
    <FilledButton type="button" onClick={handleClick} disabled={isDisabled}>
      Hitung Pajak
    </FilledButton>
  );
}
