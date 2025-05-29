"use client";

import React, { useMemo } from "react";
import { TaxType } from "@/features/tax/domain/enums/tax-type";
import { FilledButton } from "@/core/presentations/components/filled-button";
import { useAddItem } from "@/app/(authenticated)/invoices/outgoing/create/@items/_providers/add-item";

export function CalculateTaxButton() {
  const { taxType, mustRecalculateTax, recalculated } = useAddItem();

  const isDisabled = useMemo(() => {
    if (taxType === TaxType.NON_TAXABLE) return true;
    return !mustRecalculateTax;
  }, [taxType, mustRecalculateTax]);

  const handleClick = () => {
    if (!recalculated) return;
    recalculated();
  };

  return (
    <FilledButton type="button" onClick={handleClick} disabled={isDisabled}>
      Hitung Pajak
    </FilledButton>
  );
}
