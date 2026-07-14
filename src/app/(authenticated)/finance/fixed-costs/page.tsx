"use client";

import { FixedCostEntriesProvider } from "@/app/(authenticated)/finance/fixed-costs/_providers/fixed-cost-entries-provider";
import { FixedCostHeader } from "@/app/(authenticated)/finance/fixed-costs/_components/fixed-cost-header";
import { FixedCostMonthNavigator } from "@/app/(authenticated)/finance/fixed-costs/_components/fixed-cost-month-navigator";
import { FixedCostPeriodStatusChip } from "@/app/(authenticated)/finance/fixed-costs/_components/fixed-cost-period-status-chip";
import { FixedCostClosedNote } from "@/app/(authenticated)/finance/fixed-costs/_components/fixed-cost-closed-note";
import { CopyFromPrevMonthButton } from "@/app/(authenticated)/finance/fixed-costs/_components/copy-from-prev-month-button";
import { FixedCostSaveButton } from "@/app/(authenticated)/finance/fixed-costs/_components/fixed-cost-save-button";
import { FixedCostClosePeriodButton } from "@/app/(authenticated)/finance/fixed-costs/_components/fixed-cost-close-period-button";
import { FixedCostEntryTable } from "@/app/(authenticated)/finance/fixed-costs/_components/fixed-cost-entry-table";
import { FixedCostClosePeriodDialog } from "@/app/(authenticated)/finance/fixed-costs/_components/fixed-cost-close-period-dialog";

export default function FixedCostsPage() {
  return (
    <FixedCostEntriesProvider>
      <div className="flex flex-col gap-y-6">
        <FixedCostHeader />

        <div className="flex flex-col gap-y-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-row flex-wrap items-center gap-3">
            <FixedCostMonthNavigator />
            <FixedCostPeriodStatusChip />
          </div>
          <div className="flex flex-row flex-wrap items-center gap-3">
            <CopyFromPrevMonthButton />
            <FixedCostSaveButton />
            <FixedCostClosePeriodButton />
          </div>
        </div>

        <FixedCostClosedNote />

        <FixedCostEntryTable />
      </div>

      <FixedCostClosePeriodDialog />
    </FixedCostEntriesProvider>
  );
}
