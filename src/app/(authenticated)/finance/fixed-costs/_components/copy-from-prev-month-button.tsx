"use client";

import { SecondaryButton } from "@/core/presentations/components/buttons/secondary-button";
import { useFixedCostEntries } from "@/app/(authenticated)/finance/fixed-costs/_providers/fixed-cost-entries-provider";

export function CopyFromPrevMonthButton() {
  const { hasNoMaster } = useFixedCostEntries();

  const handleCopy = () => {
    // TODO: Implement copy from previous month
  };

  return (
    <SecondaryButton
      outlined
      label="Salin dari Bulan Lalu"
      onClick={handleCopy}
      disabled={hasNoMaster}
      className="w-auto whitespace-nowrap"
    />
  );
}
