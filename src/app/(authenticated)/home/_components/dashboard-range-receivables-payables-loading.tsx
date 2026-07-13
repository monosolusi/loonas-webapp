import { SectionCard } from "@/core/presentations/components/section-card";

export function DashboardRangeReceivablesPayablesLoading() {
  return (
    <SectionCard title="Piutang & Hutang">
      <div className="flex animate-pulse flex-col gap-y-4">
        {[0, 1].map((i) => (
          <div key={i} className="flex items-center justify-between">
            <div className="flex flex-col gap-y-1.5">
              <div className="h-4 w-20 rounded bg-neutral-100" />
              <div className="h-3 w-32 rounded bg-neutral-100" />
            </div>
            <div className="h-5 w-28 rounded bg-neutral-100" />
          </div>
        ))}
      </div>
    </SectionCard>
  );
}
