"use client";

import { TableToolbar } from "@/core/presentations/components/table/table-toolbar";
import { FixedCostMonthNavigator } from "@/app/(authenticated)/accounting/fixed-costs/_components/fixed-cost-month-navigator";
import { FixedCostPeriodStatusChip } from "@/app/(authenticated)/accounting/fixed-costs/_components/fixed-cost-period-status-chip";
import { CopyFromPrevMonthButton } from "@/app/(authenticated)/accounting/fixed-costs/_components/copy-from-prev-month-button";
import { FixedCostSaveButton } from "@/app/(authenticated)/accounting/fixed-costs/_components/fixed-cost-save-button";
import { FixedCostClosePeriodButton } from "@/app/(authenticated)/accounting/fixed-costs/_components/fixed-cost-close-period-button";

export function FixedCostToolbar() {
  return (
    <TableToolbar>
      <div className="flex flex-row flex-wrap items-center gap-3">
        <FixedCostMonthNavigator />
        <FixedCostPeriodStatusChip />
      </div>
      <div className="flex flex-row items-center gap-3">
        <CopyFromPrevMonthButton />
        <FixedCostSaveButton />
        <FixedCostClosePeriodButton />
      </div>
    </TableToolbar>
  );
}
