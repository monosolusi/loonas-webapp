import clsx from "clsx";
import { SectionCard } from "@/core/presentations/components/section-card";

// Pre-computed bar heights as Tailwind classes — avoids author-written inline styles on DOM elements.
const BAR_HEIGHTS = ["h-16", "h-24", "h-32", "h-20", "h-28", "h-12", "h-24"] as const;

export function DashboardRangeDailyRevenueChartLoading() {
  return (
    <SectionCard title="Pendapatan harian">
      <div className="flex h-40 animate-pulse items-end gap-x-1">
        {BAR_HEIGHTS.map((heightClass, i) => (
          <div key={i} className={clsx("flex-1 rounded-t bg-neutral-100", heightClass)} />
        ))}
      </div>
    </SectionCard>
  );
}
