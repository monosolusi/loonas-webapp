"use client";

import { FixedCostEntriesProvider } from "@/app/(authenticated)/accounting/fixed-costs/_providers/fixed-cost-entries-provider";
import { FixedCostHeader } from "@/app/(authenticated)/accounting/fixed-costs/_components/fixed-cost-header";
import { FixedCostContent } from "@/app/(authenticated)/accounting/fixed-costs/_components/fixed-cost-content";
import { FixedCostClosePeriodDialog } from "@/app/(authenticated)/accounting/fixed-costs/_components/fixed-cost-close-period-dialog";

export default function FixedCostsPage() {
  return (
    <FixedCostEntriesProvider>
      <div className="flex flex-col gap-y-6">
        <FixedCostHeader />
        <FixedCostContent />
      </div>

      <FixedCostClosePeriodDialog />
    </FixedCostEntriesProvider>
  );
}
