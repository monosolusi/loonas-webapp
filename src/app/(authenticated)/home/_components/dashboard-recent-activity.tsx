"use client";

import clsx from "clsx";
import { useMemo, useState } from "react";
import { InvoiceType } from "@/features/invoice/domain/enums/invoice-type";
import { InvoiceChannel } from "@/features/invoice/domain/enums/invoice-channel";
import { InvoiceListItemEntity } from "@/features/invoice/domain/types/invoice-list-item";
import { useListInvoices } from "@/features/invoice/presentations/hooks/use-list-invoices";
import { useDashboardRange } from "@/app/(authenticated)/home/_providers/dashboard-range-provider";
import { SectionCard } from "@/core/presentations/components/section-card";
import { DashboardRecentActivityColumnHeader } from "@/app/(authenticated)/home/_components/dashboard-recent-activity-column-header";
import { DashboardRecentActivityTabs, ActivityTab } from "@/app/(authenticated)/home/_components/dashboard-recent-activity-tabs";
import { DashboardRecentActivityRow } from "@/app/(authenticated)/home/_components/dashboard-recent-activity-row";
import { DashboardRecentActivityLoading } from "@/app/(authenticated)/home/_components/dashboard-recent-activity-loading";
import { DashboardRecentActivityError } from "@/app/(authenticated)/home/_components/dashboard-recent-activity-error";
import { DashboardRecentActivityEmpty } from "@/app/(authenticated)/home/_components/dashboard-recent-activity-empty";

const EMPTY_COPY: Record<ActivityTab, string> = {
  all: "Belum ada aktivitas",
  pos: "Tidak ada transaksi POS pada periode ini",
  incoming: "Belum ada faktur masuk",
  outgoing: "Belum ada faktur keluar",
};

export function DashboardRecentActivity() {
  const [activeTab, setActiveTab] = useState<ActivityTab>("all");
  const { from, to } = useDashboardRange();

  const posMergeResult = useListInvoices({ channel: InvoiceChannel.POS, limit: 10 });
  const posPeriodResult = useListInvoices({ channel: InvoiceChannel.POS, limit: 10, from, to });
  const incomingResult = useListInvoices({ type: InvoiceType.INCOMING, limit: 10 });
  const outgoingResult = useListInvoices({ type: InvoiceType.OUTGOING, channel: InvoiceChannel.INVOICE, limit: 10 });

  const tabs = useMemo(
    () => <DashboardRecentActivityTabs active={activeTab} onChange={setActiveTab} />,
    [activeTab],
  );

  const periodCaptionVisible = useMemo(() => activeTab === "pos", [activeTab]);

  const derivedState = useMemo(() => {
    if (activeTab === "all") {
      const loading = posMergeResult.loading || incomingResult.loading || outgoingResult.loading;
      const error = posMergeResult.error ?? incomingResult.error ?? outgoingResult.error;
      if (loading) return { loading: true, error: null, rows: null } as const;
      if (error) return { loading: false, error, rows: null } as const;

      const merged: InvoiceListItemEntity[] = [
        ...(posMergeResult.invoices ?? []),
        ...(incomingResult.invoices ?? []),
        ...(outgoingResult.invoices ?? []),
      ];
      const rows = merged
        .sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis())
        .slice(0, 10);
      return { loading: false, error: null, rows } as const;
    }

    if (activeTab === "pos") {
      if (posPeriodResult.loading) return { loading: true, error: null, rows: null } as const;
      if (posPeriodResult.error) return { loading: false, error: posPeriodResult.error, rows: null } as const;

      const rows = (posPeriodResult.invoices ?? [])
        .sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis())
        .slice(0, 10);
      return { loading: false, error: null, rows } as const;
    }

    if (activeTab === "incoming") {
      if (incomingResult.loading) return { loading: true, error: null, rows: null } as const;
      if (incomingResult.error) return { loading: false, error: incomingResult.error, rows: null } as const;
      return { loading: false, error: null, rows: incomingResult.invoices ?? [] } as const;
    }

    // outgoing
    if (outgoingResult.loading) return { loading: true, error: null, rows: null } as const;
    if (outgoingResult.error) return { loading: false, error: outgoingResult.error, rows: null } as const;
    return { loading: false, error: null, rows: outgoingResult.invoices ?? [] } as const;
  }, [activeTab, posMergeResult, posPeriodResult, incomingResult, outgoingResult]);

  if (derivedState.loading) {
    return <DashboardRecentActivityLoading tabs={tabs} periodCaptionVisible={periodCaptionVisible} />;
  }

  if (derivedState.error) {
    return (
      <DashboardRecentActivityError
        tabs={tabs}
        periodCaptionVisible={periodCaptionVisible}
        message="Gagal memuat data aktivitas."
      />
    );
  }

  if (derivedState.rows.length === 0) {
    return (
      <DashboardRecentActivityEmpty
        tabs={tabs}
        periodCaptionVisible={periodCaptionVisible}
        message={EMPTY_COPY[activeTab]}
      />
    );
  }

  return (
    <SectionCard title="Aktivitas Terbaru" bodyClassName="p-0" headerAction={tabs}>
      <div className={clsx("px-6 py-2 text-xs text-neutral-300", !periodCaptionVisible && "hidden")}>
        Sesuai periode dipilih
      </div>
      <DashboardRecentActivityColumnHeader />
      <div role="tabpanel" aria-labelledby={`activity-tab-${activeTab}`}>
        {derivedState.rows.map((inv) => (
          <DashboardRecentActivityRow key={inv.id} invoice={inv} />
        ))}
      </div>
    </SectionCard>
  );
}
