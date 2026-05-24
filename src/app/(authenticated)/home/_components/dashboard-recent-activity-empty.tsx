"use client";

import clsx from "clsx";
import { SectionCard } from "@/core/presentations/components/section-card";
import { DashboardRecentActivityColumnHeader } from "@/app/(authenticated)/home/_components/dashboard-recent-activity-column-header";

interface DashboardRecentActivityEmptyProps {
  tabs: React.ReactNode;
  periodCaptionVisible: boolean;
  message: string;
}

export function DashboardRecentActivityEmpty({ tabs, periodCaptionVisible, message }: DashboardRecentActivityEmptyProps) {
  return (
    <SectionCard title="Aktivitas Terbaru" bodyClassName="p-0" headerAction={tabs}>
      <div className={clsx("px-6 py-2 text-xs text-neutral-300", !periodCaptionVisible && "hidden")}>
        Sesuai periode dipilih
      </div>
      <DashboardRecentActivityColumnHeader />
      <div className="px-6 py-10 text-center text-sm text-neutral-300">{message}</div>
    </SectionCard>
  );
}
