"use client";

import { SecondaryButton } from "@/core/presentations/components/buttons/secondary-button";
import { useFixedCostEntries } from "@/app/(authenticated)/finance/fixed-costs/_providers/fixed-cost-entries-provider";

export function FixedCostClosePeriodButton() {
  const { canClosePeriod, openCloseDialog, isClosing } = useFixedCostEntries();

  if (!canClosePeriod) return null;

  return (
    <SecondaryButton
      outlined
      label="Tutup Periode"
      onClick={openCloseDialog}
      loading={isClosing}
      className="w-auto whitespace-nowrap"
    />
  );
}
