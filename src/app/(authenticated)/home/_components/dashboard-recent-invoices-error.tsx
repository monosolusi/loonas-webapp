"use client";

import { SectionCard } from "@/core/presentations/components/section-card";
import { DashboardRecentInvoicesColumnHeader } from "@/app/(authenticated)/home/_components/dashboard-recent-invoices-column-header";

interface DashboardRecentInvoicesErrorProps {
  headerAction: React.ReactNode;
}

export function DashboardRecentInvoicesError({ headerAction }: DashboardRecentInvoicesErrorProps) {
  return (
    <SectionCard title="Faktur Terbaru" bodyClassName="p-0" headerAction={headerAction}>
      <DashboardRecentInvoicesColumnHeader />
      <div className="px-6 py-10 text-center text-sm text-neutral-300">Gagal memuat data faktur.</div>
    </SectionCard>
  );
}
