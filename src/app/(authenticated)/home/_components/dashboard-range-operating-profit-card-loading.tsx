import { SectionCard } from "@/core/presentations/components/section-card";

export function DashboardRangeOperatingProfitCardLoading() {
  return (
    <SectionCard title="Laba usaha">
      <div className="flex animate-pulse flex-col gap-y-4">
        <div className="flex flex-col gap-y-3">
          {[0, 1].map((i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="h-4 w-24 rounded bg-neutral-100" />
              <div className="h-4 w-28 rounded bg-neutral-100" />
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between border-t border-neutral-100 pt-4">
          <div className="h-5 w-24 rounded bg-neutral-100" />
          <div className="h-6 w-32 rounded bg-neutral-100" />
        </div>
        <div className="flex items-center justify-between">
          <div className="h-4 w-28 rounded bg-neutral-100" />
          <div className="h-4 w-20 rounded bg-neutral-100" />
        </div>
      </div>
    </SectionCard>
  );
}
