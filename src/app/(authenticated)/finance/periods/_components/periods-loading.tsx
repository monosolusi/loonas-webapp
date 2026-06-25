import { SectionCard } from "@/core/presentations/components/section-card";

export function PeriodsLoading() {
  return (
    <SectionCard title="Periode Akuntansi">
      <div className="flex flex-col gap-y-3 animate-pulse">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex flex-row items-center gap-x-4 py-2">
            <div className="h-4 w-32 rounded bg-neutral-100" />
            <div className="h-5 w-16 rounded bg-neutral-100" />
            <div className="ml-auto h-8 w-8 rounded bg-neutral-100" />
          </div>
        ))}
      </div>
    </SectionCard>
  );
}
