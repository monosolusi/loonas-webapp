import { StatusChip } from "@/core/presentations/components/status-chip";
import { MomTrend } from "@/app/(authenticated)/home/_components/dashboard-mom-trend";

type DashboardMomTrendChipProps = {
  trend: MomTrend;
};

export function DashboardMomTrendChip({ trend }: DashboardMomTrendChipProps) {
  return (
    <span className="flex items-center gap-x-1.5">
      <span className="sr-only">{trend.srText}</span>
      <span aria-hidden="true" className="flex items-center gap-x-1.5">
        <StatusChip variant={trend.variant} label={trend.label} compact />
        <span className="text-xs text-neutral-300">vs bulan lalu</span>
      </span>
    </span>
  );
}
