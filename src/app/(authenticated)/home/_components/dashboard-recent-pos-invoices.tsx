"use client";

import { useMemo } from "react";
import { DateTime } from "luxon";
import { SectionCard } from "@/core/presentations/components/section-card";
import { useListInvoices } from "@/features/invoice/presentations/hooks/use-list-invoices";
import { InvoiceChannel } from "@/features/invoice/domain/enums/invoice-channel";
import { OutgoingInvoiceEntity } from "@/features/invoice/domain/entities/outgoing-invoice";
import { useDashboardRange } from "@/app/(authenticated)/home/_providers/dashboard-range-provider";
import { DashboardRecentPosInvoicesLoading } from "@/app/(authenticated)/home/_components/dashboard-recent-pos-invoices-loading";
import { DashboardRecentPosInvoicesError } from "@/app/(authenticated)/home/_components/dashboard-recent-pos-invoices-error";
import { DashboardRecentPosInvoicesEmpty } from "@/app/(authenticated)/home/_components/dashboard-recent-pos-invoices-empty";
import { DashboardRecentPosInvoicesRow } from "@/app/(authenticated)/home/_components/dashboard-recent-pos-invoices-row";

const TZ = "Asia/Jakarta";

export function DashboardRecentPosInvoices() {
  const { from, to } = useDashboardRange();
  const { invoices, loading, error } = useListInvoices({
    channel: InvoiceChannel.POS,
    limit: 20,
    includes: "documents",
  });

  const filteredInvoices = useMemo(() => {
    if (!invoices) return [];

    const fromDt = DateTime.fromISO(from, { zone: TZ }).startOf("day");
    const toDt = DateTime.fromISO(to, { zone: TZ }).endOf("day");

    return invoices
      .filter(
        (inv): inv is OutgoingInvoiceEntity =>
          inv instanceof OutgoingInvoiceEntity && inv.createdAt >= fromDt && inv.createdAt <= toDt,
      )
      .slice(0, 5);
  }, [invoices, from, to]);

  if (loading) {
    return <DashboardRecentPosInvoicesLoading />;
  }

  if (error) {
    return <DashboardRecentPosInvoicesError />;
  }

  if (filteredInvoices.length === 0) {
    return <DashboardRecentPosInvoicesEmpty />;
  }

  return (
    <SectionCard title="Transaksi POS Terbaru" bodyClassName="p-0">
      <div className="grid grid-cols-[2fr_1fr_1fr] border-b border-neutral-100 bg-neutral-50 px-6 py-3 text-xs tracking-wide text-neutral-300">
        <span className="font-medium">NOMOR</span>
        <span className="font-medium">NOMINAL</span>
        <span className="font-medium">STATUS</span>
      </div>
      {filteredInvoices.map((inv) => (
        <DashboardRecentPosInvoicesRow key={inv.id} invoice={inv} />
      ))}
    </SectionCard>
  );
}
