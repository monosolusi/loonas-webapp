"use client";

import { SectionCard } from "@/core/presentations/components/section-card";
import { InvoiceListItemEntity } from "@/features/invoice/domain/types/invoice-list-item";
import { DashboardRecentInvoicesColumnHeader } from "@/app/(authenticated)/home/_components/dashboard-recent-invoices-column-header";
import { DashboardRecentInvoicesRow } from "@/app/(authenticated)/home/_components/dashboard-recent-invoices-row";

interface DashboardRecentInvoicesLoadedProps {
  invoices: InvoiceListItemEntity[];
  headerAction: React.ReactNode;
}

export function DashboardRecentInvoicesLoaded({ invoices, headerAction }: DashboardRecentInvoicesLoadedProps) {
  return (
    <SectionCard title="Faktur Terbaru" bodyClassName="p-0" headerAction={headerAction}>
      <DashboardRecentInvoicesColumnHeader />
      {invoices.map((inv) => (
        <DashboardRecentInvoicesRow key={inv.id} invoice={inv} />
      ))}
    </SectionCard>
  );
}
