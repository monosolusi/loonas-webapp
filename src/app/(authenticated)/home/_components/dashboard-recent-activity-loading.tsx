"use client";

import clsx from "clsx";
import { SectionCard } from "@/core/presentations/components/section-card";
import { DashboardRecentActivityColumnHeader } from "@/app/(authenticated)/home/_components/dashboard-recent-activity-column-header";
import { DashboardRecentActivitySkeletonRow } from "@/app/(authenticated)/home/_components/dashboard-recent-activity-skeleton-row";

const SKELETON_ROW_COUNT = 10;

interface DashboardRecentActivityLoadingProps {
  tabs: React.ReactNode;
  periodCaptionVisible: boolean;
}

export function DashboardRecentActivityLoading({ tabs, periodCaptionVisible }: DashboardRecentActivityLoadingProps) {
  return (
    <SectionCard title="Aktivitas Terbaru" bodyClassName="p-0" headerAction={tabs}>
      <div className={clsx("px-6 py-2 text-xs text-neutral-300", !periodCaptionVisible && "hidden")}>
        Sesuai periode dipilih
      </div>
      <DashboardRecentActivityColumnHeader />
      {Array.from({ length: SKELETON_ROW_COUNT }).map((_, i) => (
        <DashboardRecentActivitySkeletonRow key={i} />
      ))}
    </SectionCard>
  );
}
