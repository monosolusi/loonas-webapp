"use client";

import { useProfitabilityDashboard } from "@/app/(authenticated)/finance/profitability/_providers/profitability-dashboard-provider";

export function ProfitabilityListHeader() {
  const { meta } = useProfitabilityDashboard();

  return (
    <div className="flex flex-row items-center justify-between">
      <div className="flex flex-col gap-y-2">
        <h1 className="text-3xl leading-9 font-bold tracking-tight">Profitabilitas Produk</h1>
        <p className="leading-6 text-neutral-300">
          {meta ? `${meta.total.toLocaleString("id-ID")} produk` : "Memuat..."}
        </p>
      </div>
    </div>
  );
}
