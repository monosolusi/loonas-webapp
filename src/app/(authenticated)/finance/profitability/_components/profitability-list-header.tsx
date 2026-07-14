"use client";

import { ListPageHeader } from "@/core/presentations/components/list-page-header";
import { useProfitabilityDashboard } from "@/app/(authenticated)/finance/profitability/_providers/profitability-dashboard-provider";

export function ProfitabilityListHeader() {
  const { totalVariants, summaryLoading } = useProfitabilityDashboard();

  return (
    <ListPageHeader
      title="Profitabilitas Varian"
      subtitle={summaryLoading ? "Memuat..." : `${totalVariants.toLocaleString("id-ID")} varian`}
    />
  );
}
