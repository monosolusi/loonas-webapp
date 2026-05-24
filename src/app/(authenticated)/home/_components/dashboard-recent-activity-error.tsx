"use client";

import clsx from "clsx";
import { SectionCard } from "@/core/presentations/components/section-card";
import { DashboardRecentInvoicesColumnHeader } from "@/app/(authenticated)/home/_components/dashboard-recent-invoices-column-header";

interface DashboardRecentActivityErrorProps {
  tabs: React.ReactNode;
  periodCaptionVisible: boolean;
  message: string;
}

export function DashboardRecentActivityError({ tabs, periodCaptionVisible, message }: DashboardRecentActivityErrorProps) {
  return (
    <SectionCard title="Aktivitas Terbaru" bodyClassName="p-0" headerAction={tabs}>
      <div className={clsx("px-6 py-2 text-xs text-neutral-300", !periodCaptionVisible && "hidden")}>
        Sesuai periode dipilih
      </div>
      <DashboardRecentInvoicesColumnHeader />
      <div className="px-6 py-10 text-center text-sm text-neutral-300">{message}</div>
    </SectionCard>
  );
}
