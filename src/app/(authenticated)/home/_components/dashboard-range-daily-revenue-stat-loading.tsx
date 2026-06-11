import { SectionCard } from "@/core/presentations/components/section-card";

export function DashboardRangeDailyRevenueStatLoading() {
  return (
    <SectionCard title="Pendapatan harian">
      <div className="flex animate-pulse flex-col gap-y-4 sm:flex-row sm:items-end sm:justify-between sm:gap-x-6">
        <div className="flex flex-col gap-y-2">
          <div className="h-7 w-44 rounded bg-neutral-100" />
          <div className="h-4 w-24 rounded bg-neutral-100" />
        </div>
        <div className="flex flex-col gap-y-2 sm:items-end">
          <div className="h-4 w-32 rounded bg-neutral-100" />
          <div className="h-5 w-28 rounded bg-neutral-100" />
        </div>
      </div>
    </SectionCard>
  );
}
