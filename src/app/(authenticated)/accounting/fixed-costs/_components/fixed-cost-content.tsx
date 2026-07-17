"use client";

import { useFixedCostEntries } from "@/app/(authenticated)/accounting/fixed-costs/_providers/fixed-cost-entries-provider";
import { FixedCostEmptyState } from "@/app/(authenticated)/accounting/fixed-costs/_components/fixed-cost-empty-state";
import { FixedCostToolbar } from "@/app/(authenticated)/accounting/fixed-costs/_components/fixed-cost-toolbar";
import { FixedCostClosedNote } from "@/app/(authenticated)/accounting/fixed-costs/_components/fixed-cost-closed-note";
import { FixedCostEntryTable } from "@/app/(authenticated)/accounting/fixed-costs/_components/fixed-cost-entry-table";

export function FixedCostContent() {
  const { hasNoMaster } = useFixedCostEntries();

  if (hasNoMaster) return <FixedCostEmptyState />;

  return (
    <div className="flex flex-col gap-y-6">
      <FixedCostToolbar />
      <FixedCostClosedNote />
      <FixedCostEntryTable />
    </div>
  );
}
