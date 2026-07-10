"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { DateTime } from "luxon";
import clsx from "clsx";
import { resolveLabel, TZ } from "@/core/presentations/components/date-range-picker-presets";
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

  const [hasPeriodChanged, setHasPeriodChanged] = useState(false);
  const prevRangeForCaptionRef = useRef<{ from: string; to: string } | null>(null);

  useEffect(() => {
    if (prevRangeForCaptionRef.current === null) {
      prevRangeForCaptionRef.current = { from, to };
      return;
    }
    if (prevRangeForCaptionRef.current.from === from && prevRangeForCaptionRef.current.to === to) return;
    prevRangeForCaptionRef.current = { from, to };
    setHasPeriodChanged(true);
  }, [from, to]);

  const periodLabel = useMemo(() => {
    const fromDate = DateTime.fromISO(from, { zone: TZ }).toJSDate();
    const toDate = DateTime.fromISO(to, { zone: TZ }).toJSDate();
    return resolveLabel(fromDate, toDate);
  }, [from, to]);

  const [liveMessage, setLiveMessage] = useState<string>("");

  useEffect(() => {
    if (!hasPeriodChanged) return;
    setLiveMessage(`Aktivitas diperbarui untuk periode: ${periodLabel}`);
  }, [hasPeriodChanged, periodLabel]);

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

  return (
    <>
      {derivedState.loading ? (
        <DashboardRecentActivityLoading tabs={tabs} periodCaptionVisible={hasPeriodChanged} periodLabel={periodLabel} />
      ) : derivedState.error ? (
        <DashboardRecentActivityError
          tabs={tabs}
          periodCaptionVisible={hasPeriodChanged}
          periodLabel={periodLabel}
          message="Gagal memuat data aktivitas."
        />
      ) : derivedState.rows.length === 0 ? (
        <DashboardRecentActivityEmpty
          tabs={tabs}
          periodCaptionVisible={hasPeriodChanged}
          periodLabel={periodLabel}
          message={EMPTY_COPY[activeTab]}
        />
      ) : (
        <SectionCard title="Aktivitas Terbaru" bodyClassName="p-0" headerAction={tabs}>
          <div className={clsx("px-6 py-2 text-xs text-neutral-300", !hasPeriodChanged && "invisible")}>
            {`Periode: ${periodLabel}`}
          </div>
          <DashboardRecentActivityColumnHeader />
          <div role="tabpanel" aria-label="Daftar aktivitas terbaru">
            {derivedState.rows.map((inv, index) => (
              <DashboardRecentActivityRow key={inv.id} invoice={inv} tab={activeTab} position={index} />
            ))}
          </div>
        </SectionCard>
      )}
      <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
        {liveMessage}
      </div>
    </>
  );
}
