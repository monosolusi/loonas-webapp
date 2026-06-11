"use client";

import React, { useMemo } from "react";
import { TaxType } from "@/features/tax/domain/enums/tax-type";
import { PrimaryButton } from "@/core/presentations/components/buttons/primary-button";
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
    setCalculatedTax,
  } = useAddItem();

  const isDisabled = useMemo(() => {
    if (taxType === TaxType.NON_TAXABLE) return true;
    else if (isMutating) return true;
    else return !mustRecalculateTax;
  }, [taxType, mustRecalculateTax, isMutating]);

  const handleClick = async () => {
    if (!setCalculatedTax) return;

    const amountBeforeTax = TaxCalculator.calculateAmountBeforeTax({ price, qty, discount, discountType });
    const result = await trigger({
      amountBeforeTax: amountBeforeTax,
      taxType: taxType,
      tax: tax,
      taxBase: taxBase,
    });

    setCalculatedTax({
      tax: result.tax,
      taxBase: result.taxBase,
      total: result.amountAfterTax,
    });
  };

  return (
    <PrimaryButton
      type="button"
      label="Hitung Pajak"
      loading={isMutating}
      disabled={isDisabled}
      onClick={handleClick}
    />
  );
}
