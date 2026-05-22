import { SectionCard } from "@/core/presentations/components/section-card";

export function DashboardRangePosSalesTileLoading() {
  return (
    <SectionCard title="Penjualan POS">
      <div className="flex animate-pulse flex-col gap-y-3">
        <div className="h-10 w-40 rounded bg-neutral-100" />
        <div className="h-4 w-28 rounded bg-neutral-100" />
      </div>
    </SectionCard>
  );
}
