"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
import { track } from "@/core/analytics";

const EMPTY_COPY: Record<ActivityTab, string> = {
  all: "Belum ada aktivitas pada periode ini",
  pos: "Tidak ada transaksi POS pada periode ini",
  incoming: "Belum ada faktur masuk pada periode ini",
  outgoing: "Belum ada faktur keluar pada periode ini",
};

export function DashboardRecentActivity() {
  const [activeTab, setActiveTab] = useState<ActivityTab>("all");
  const { from, to } = useDashboardRange();

  const posResult = useListInvoices({ channel: InvoiceChannel.POS, limit: 10, from, to });
  const incomingResult = useListInvoices({ type: InvoiceType.INCOMING, limit: 10, from, to });
  const outgoingResult = useListInvoices({ type: InvoiceType.OUTGOING, channel: InvoiceChannel.INVOICE, limit: 10, from, to });

  const handleTabChange = useCallback(
    (next: ActivityTab) => {
      if (next !== activeTab) {
        track("recent_activity_tab_switched", { from_tab: activeTab, to_tab: next });
      }
      setActiveTab(next);
    },
    [activeTab],
  );

  const prevRangeRef = useRef<{ from: string; to: string } | null>(null);
  useEffect(() => {
    if (prevRangeRef.current === null) {
      prevRangeRef.current = { from, to };
      return;
    }
    if (prevRangeRef.current.from === from && prevRangeRef.current.to === to) return;
    prevRangeRef.current = { from, to };
    track("recent_activity_period_changed", { tab: activeTab, from_date: from, to_date: to });
  }, [from, to, activeTab]);

  const tabs = useMemo(
    () => <DashboardRecentActivityTabs active={activeTab} onChange={handleTabChange} />,
    [activeTab, handleTabChange],
  );

  const derivedState = useMemo(() => {
    if (activeTab === "all") {
      const loading = posResult.loading || incomingResult.loading || outgoingResult.loading;
      const error = posResult.error ?? incomingResult.error ?? outgoingResult.error;
      if (loading) return { loading: true, error: null, rows: null } as const;
      if (error) return { loading: false, error, rows: null } as const;

      const merged: InvoiceListItemEntity[] = [
        ...(posResult.invoices ?? []),
        ...(incomingResult.invoices ?? []),
        ...(outgoingResult.invoices ?? []),
      ];
      const rows = merged
        .sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis())
        .slice(0, 10);
      return { loading: false, error: null, rows } as const;
    }

    if (activeTab === "pos") {
      if (posResult.loading) return { loading: true, error: null, rows: null } as const;
      if (posResult.error) return { loading: false, error: posResult.error, rows: null } as const;

      const rows = (posResult.invoices ?? [])
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
  }, [activeTab, posResult, incomingResult, outgoingResult]);

  const emptyStateSeenRef = useRef<Set<string>>(new Set());
  useEffect(() => {
    if (derivedState.loading) return;
    if (derivedState.error) return;
    if (derivedState.rows.length !== 0) return;
    const key = `${activeTab}|${from}|${to}`;
    if (emptyStateSeenRef.current.has(key)) return;
    emptyStateSeenRef.current.add(key);
    track("recent_activity_empty_state_shown", { tab: activeTab, from_date: from, to_date: to });
  }, [derivedState, activeTab, from, to]);

  if (derivedState.loading) {
    return <DashboardRecentActivityLoading tabs={tabs} periodCaptionVisible={false} />;
  }

  if (derivedState.error) {
    return (
      <DashboardRecentActivityError
        tabs={tabs}
        periodCaptionVisible={false}
        message="Gagal memuat data aktivitas."
      />
    );
  }

  if (derivedState.rows.length === 0) {
    return (
      <DashboardRecentActivityEmpty
        tabs={tabs}
        periodCaptionVisible={false}
        message={EMPTY_COPY[activeTab]}
      />
    );
  }

  return (
    <SectionCard title="Aktivitas Terbaru" bodyClassName="p-0" headerAction={tabs}>
      <DashboardRecentActivityColumnHeader />
      <div role="tabpanel" aria-labelledby={`activity-tab-${activeTab}`}>
        {derivedState.rows.map((inv, index) => (
          <DashboardRecentActivityRow key={inv.id} invoice={inv} tab={activeTab} position={index} />
        ))}
      </div>
    </SectionCard>
  );
}
