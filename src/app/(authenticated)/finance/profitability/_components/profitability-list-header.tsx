"use client";

import { useProfitabilityDashboard } from "@/app/(authenticated)/finance/profitability/_providers/profitability-dashboard-provider";

export function ProfitabilityListHeader() {
  const { totalVariants, summaryLoading } = useProfitabilityDashboard();

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-col gap-y-2">
        <h1 className="text-3xl leading-9 font-bold tracking-tight">Profitabilitas Varian</h1>
        <p className="leading-6 text-neutral-300">
          {summaryLoading ? "Memuat..." : `${totalVariants.toLocaleString("id-ID")} varian`}
        </p>
      </div>
    </div>
  );
}
