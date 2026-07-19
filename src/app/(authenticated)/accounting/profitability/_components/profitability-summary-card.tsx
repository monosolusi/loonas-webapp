"use client";

import { SectionCard } from "@/core/presentations/components/section-card";
import { useProfitabilityDashboard } from "@/app/(authenticated)/accounting/profitability/_providers/profitability-dashboard-provider";

export function ProfitabilitySummaryCard() {
  const { totalVariants, profitableCount, atRiskCount, summaryLoading } = useProfitabilityDashboard();

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <SectionCard title="Total Varian" bodyClassName="p-4">
        <div className="text-2xl font-semibold tracking-tight text-neutral-500">
          {summaryLoading ? (
            <span className="inline-block h-7 w-24 animate-pulse rounded bg-neutral-100" />
          ) : (
            totalVariants.toLocaleString("id-ID")
          )}
        </div>
        <div className="mt-1 text-sm text-neutral-300">
          {summaryLoading ? "Memuat..." : `${totalVariants.toLocaleString("id-ID")} varian`}
        </div>
      </SectionCard>

      <SectionCard title="Menguntungkan" bodyClassName="p-4">
        <div className="text-2xl font-semibold tracking-tight text-success-500">
          {summaryLoading ? (
            <span className="inline-block h-7 w-24 animate-pulse rounded bg-neutral-100" />
          ) : (
            profitableCount.toLocaleString("id-ID")
          )}
        </div>
        <div className="mt-1 text-sm text-neutral-300">
          {summaryLoading ? "Memuat..." : `${profitableCount.toLocaleString("id-ID")} menguntungkan`}
        </div>
      </SectionCard>

      <SectionCard title="Perlu Perhatian" bodyClassName="p-4">
        <div className="text-2xl font-semibold tracking-tight text-warning-500">
          {summaryLoading ? (
            <span className="inline-block h-7 w-24 animate-pulse rounded bg-neutral-100" />
          ) : (
            atRiskCount.toLocaleString("id-ID")
          )}
        </div>
        <div className="mt-1 text-sm text-neutral-300">
          {summaryLoading ? "Memuat..." : `${atRiskCount.toLocaleString("id-ID")} perlu perhatian`}
        </div>
      </SectionCard>
    </div>
  );
}
