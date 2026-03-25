"use client";

import { FixedCostMasterProvider } from "@/app/(authenticated)/settings/fixed-costs/_providers/fixed-cost-master-provider";
import { FixedCostMasterHeader } from "@/app/(authenticated)/settings/fixed-costs/_components/fixed-cost-master-header";
import { FixedCostMasterToolbar } from "@/app/(authenticated)/settings/fixed-costs/_components/fixed-cost-master-toolbar";
import { FixedCostMasterTable } from "@/app/(authenticated)/settings/fixed-costs/_components/fixed-cost-master-table";

export default function FixedCostMasterPage() {
  return (
    <FixedCostMasterProvider>
      <div className="flex flex-col gap-y-6">
        <FixedCostMasterHeader />
        <FixedCostMasterToolbar />
        <FixedCostMasterTable />
      </div>
    </FixedCostMasterProvider>
  );
}
