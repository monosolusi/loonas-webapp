import { SectionCard } from "@/core/presentations/components/section-card";

export function DashboardRangeExpenseBreakdownLoading() {
  return (
    <SectionCard title="Komposisi beban">
      <div className="flex animate-pulse flex-col gap-y-4">
        {[0, 1, 2].map((i) => (
          <div key={i} className="flex flex-col gap-y-1.5">
            <div className="flex items-center justify-between">
              <div className="h-4 w-12 rounded bg-neutral-100" />
              <div className="h-4 w-24 rounded bg-neutral-100" />
            </div>
            <div className="h-2 w-full rounded-full bg-neutral-100" />
          </div>
        ))}
      </div>
    </SectionCard>
  );
}
