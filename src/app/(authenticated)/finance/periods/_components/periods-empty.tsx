import { SectionCard } from "@/core/presentations/components/section-card";

export function PeriodsEmpty() {
  return (
    <SectionCard title="Periode Akuntansi">
      <div className="flex items-center justify-center py-12">
        <span className="text-sm text-neutral-300">Belum ada periode akuntansi.</span>
      </div>
    </SectionCard>
  );
}
