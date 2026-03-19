"use client";

import { FixedCostEntriesProvider } from "@/app/(authenticated)/finance/fixed-costs/_providers/fixed-cost-entries-provider";
import { FixedCostWarningBanner } from "@/app/(authenticated)/finance/fixed-costs/_components/fixed-cost-header";
import { FixedCostSubtitle } from "@/app/(authenticated)/finance/fixed-costs/_components/fixed-cost-subtitle";
import { FixedCostMonthNavigator } from "@/app/(authenticated)/finance/fixed-costs/_components/fixed-cost-month-navigator";
import { CopyFromPrevMonthButton } from "@/app/(authenticated)/finance/fixed-costs/_components/copy-from-prev-month-button";
import { FixedCostSaveButton } from "@/app/(authenticated)/finance/fixed-costs/_components/fixed-cost-save-button";
import { FixedCostEntryTable } from "@/app/(authenticated)/finance/fixed-costs/_components/fixed-cost-entry-table";

export default function FixedCostsPage() {
  return (
    <FixedCostEntriesProvider>
      <div className="flex flex-col gap-y-6">
        <div className="flex flex-col gap-y-2">
          <h1 className="text-3xl leading-9 font-bold tracking-tight">Biaya Tetap Bulanan</h1>
          <FixedCostSubtitle />
        </div>

        <FixedCostWarningBanner />

        <div className="flex flex-row items-center justify-between">
          <FixedCostMonthNavigator />
          <div className="flex flex-row items-center gap-x-3">
            <CopyFromPrevMonthButton />
            <FixedCostSaveButton />
          </div>
        </div>

        <FixedCostEntryTable />
      </div>
    </FixedCostEntriesProvider>
  );
}
