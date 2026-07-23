import { SectionCard } from "@/core/presentations/components/section-card";

export function DashboardRangeExpenseBreakdownEmpty() {
  return (
    <SectionCard title="Komposisi beban">
      <p className="text-sm text-neutral-300">Belum ada beban tercatat pada periode ini.</p>
    </SectionCard>
  );
}
