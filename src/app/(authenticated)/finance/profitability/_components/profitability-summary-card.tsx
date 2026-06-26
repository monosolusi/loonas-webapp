"use client";

import { SectionCard } from "@/core/presentations/components/section-card";

type ProfitabilitySummaryCardProps = {
  total: number;
  profitable: number | null;
  atRisk: number | null;
  loading: boolean;
};

function formatCount(value: number, label: string) {
  return `${value.toLocaleString("id-ID")} ${label}`;
}

export function ProfitabilitySummaryCard({ total, profitable, atRisk, loading }: ProfitabilitySummaryCardProps) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <SectionCard title="Total Varian" bodyClassName="p-4">
        <div className="text-2xl font-semibold tracking-tight text-neutral-500">
          {loading ? (
            <span className="inline-block h-7 w-24 animate-pulse rounded bg-neutral-100" />
          ) : (
            total.toLocaleString("id-ID")
          )}
        </div>
        <div className="mt-1 text-sm text-neutral-300">
          {loading ? "Memuat..." : formatCount(total, "varian")}
        </div>
      </SectionCard>

      <SectionCard title="Menguntungkan" bodyClassName="p-4">
        <div className="text-2xl font-semibold tracking-tight text-success-500">
          {loading ? (
            <span className="inline-block h-7 w-24 animate-pulse rounded bg-neutral-100" />
          ) : profitable === null ? (
            "—"
          ) : (
            profitable.toLocaleString("id-ID")
          )}
        </div>
        <div className="mt-1 text-sm text-neutral-300">
          {loading ? "Memuat..." : profitable === null ? "Memerlukan data HPP" : formatCount(profitable, "menguntungkan")}
        </div>
      </SectionCard>

      <SectionCard title="Perlu Perhatian" bodyClassName="p-4">
        <div className="text-2xl font-semibold tracking-tight text-warning-500">
          {loading ? (
            <span className="inline-block h-7 w-24 animate-pulse rounded bg-neutral-100" />
          ) : atRisk === null ? (
            "—"
          ) : (
            atRisk.toLocaleString("id-ID")
          )}
        </div>
        <div className="mt-1 text-sm text-neutral-300">
          {loading ? "Memuat..." : atRisk === null ? "Memerlukan data HPP" : formatCount(atRisk, "perlu perhatian")}
        </div>
      </SectionCard>
    </div>
  );
}
