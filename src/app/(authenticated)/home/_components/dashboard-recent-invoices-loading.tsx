"use client";

import { SectionCard } from "@/core/presentations/components/section-card";
import { DashboardRecentInvoicesColumnHeader } from "@/app/(authenticated)/home/_components/dashboard-recent-invoices-column-header";
import { DashboardRecentInvoicesSkeletonRow } from "@/app/(authenticated)/home/_components/dashboard-recent-invoices-skeleton-row";

const SKELETON_ROW_COUNT = 7;

interface DashboardRecentInvoicesLoadingProps {
  headerAction: React.ReactNode;
}

export function DashboardRecentInvoicesLoading({ headerAction }: DashboardRecentInvoicesLoadingProps) {
  return (
    <SectionCard title="Faktur Terbaru" bodyClassName="p-0" headerAction={headerAction}>
      <DashboardRecentInvoicesColumnHeader />
      {Array.from({ length: SKELETON_ROW_COUNT }).map((_, i) => (
        <DashboardRecentInvoicesSkeletonRow key={i} />
      ))}
    </SectionCard>
  );
}
