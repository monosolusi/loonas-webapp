"use client";

import { ShoppingCartIcon } from "@heroicons/react/24/outline";
import { DashboardRecentActivityArrowIcon } from "@/app/(authenticated)/home/_components/dashboard-recent-activity-arrow-icon";

type ActivityKind = "pos" | "incoming" | "outgoing";

export interface DashboardRecentActivityIconProps {
  kind: ActivityKind;
}

export function DashboardRecentActivityIcon({ kind }: DashboardRecentActivityIconProps) {
  if (kind === "pos") {
    return (
      <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-primary-50">
        <ShoppingCartIcon className="size-3.5 text-primary-400" />
      </div>
    );
  }
  if (kind === "incoming") {
    return (
      <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-success-50">
        <DashboardRecentActivityArrowIcon direction="in" className="text-success-400" />
      </div>
    );
  }
  return (
    <div className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-warning-50">
      <DashboardRecentActivityArrowIcon direction="out" className="text-warning-400" />
    </div>
  );
}
