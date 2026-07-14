"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { DateTime } from "luxon";
import clsx from "clsx";
import { resolveLabel, TZ } from "@/core/presentations/components/date-range-picker-presets";
import { InvoiceType } from "@/features/invoice/domain/enums/invoice-type";
import { InvoiceChannel } from "@/features/invoice/domain/enums/invoice-channel";
import { useListInvoices } from "@/features/invoice/presentations/hooks/use-list-invoices";
import type { UseListInvoicesParams } from "@/features/invoice/presentations/hooks/use-list-invoices.types";
import { DEFAULT_PAGE_SIZE } from "@/core/utilities/pagination";
import { useDashboardRange } from "@/app/(authenticated)/home/_providers/dashboard-range-provider";
import { SectionCard } from "@/core/presentations/components/section-card";
import { TablePagination } from "@/core/presentations/components/table/table-pagination";
import { DashboardRecentActivityColumnHeader } from "@/app/(authenticated)/home/_components/dashboard-recent-activity-column-header";
import { DashboardRecentActivityTabs, ActivityTab } from "@/app/(authenticated)/home/_components/dashboard-recent-activity-tabs";
import { DashboardRecentActivityRow } from "@/app/(authenticated)/home/_components/dashboard-recent-activity-row";
import { DashboardRecentActivityCard } from "@/app/(authenticated)/home/_components/dashboard-recent-activity-card";
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

// "all" carries no type/channel filter, so the backend returns every invoice type interleaved.
const TAB_FILTER: Record<ActivityTab, Pick<UseListInvoicesParams, "type" | "channel">> = {
  all: {},
  pos: { channel: InvoiceChannel.POS },
  incoming: { type: InvoiceType.INCOMING },
  outgoing: { type: InvoiceType.OUTGOING, channel: InvoiceChannel.INVOICE },
};

export function DashboardRecentActivity() {
  const [activeTab, setActiveTab] = useState<ActivityTab>("all");
  const [page, setPage] = useState(1);
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

  const { invoices, meta, loading, error } = useListInvoices({
    ...TAB_FILTER[activeTab],
    page,
    limit: DEFAULT_PAGE_SIZE,
    from,
    to,
  });

  const handleTabChange = useCallback(
    (next: ActivityTab) => {
      if (next !== activeTab) {
        track("recent_activity_tab_switched", { from_tab: activeTab, to_tab: next });
        setPage(1);
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
    setPage(1);
    track("recent_activity_period_changed", { tab: activeTab, from_date: from, to_date: to });
  }, [from, to, activeTab]);

  const tabs = useMemo(
    () => <DashboardRecentActivityTabs active={activeTab} onChange={handleTabChange} />,
    [activeTab, handleTabChange],
  );

  // Preserve "most recent first" within the page — a no-op when the backend already orders desc.
  const rows = useMemo(
    () => (invoices ?? []).slice().sort((a, b) => b.createdAt.toMillis() - a.createdAt.toMillis()),
    [invoices],
  );

  const emptyStateSeenRef = useRef<Set<string>>(new Set());
  useEffect(() => {
    if (loading) return;
    if (error) return;
    if (rows.length !== 0) return;
    const key = `${activeTab}|${from}|${to}`;
    if (emptyStateSeenRef.current.has(key)) return;
    emptyStateSeenRef.current.add(key);
    track("recent_activity_empty_state_shown", { tab: activeTab, from_date: from, to_date: to });
  }, [loading, error, rows, activeTab, from, to]);

  return (
    <>
      {loading ? (
        <DashboardRecentActivityLoading tabs={tabs} periodCaptionVisible={hasPeriodChanged} periodLabel={periodLabel} />
      ) : error ? (
        <DashboardRecentActivityError
          tabs={tabs}
          periodCaptionVisible={hasPeriodChanged}
          periodLabel={periodLabel}
          message="Gagal memuat data aktivitas."
        />
      ) : rows.length === 0 ? (
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
            {/* Desktop: grid rows (lg and up) */}
            <div className="hidden lg:block">
              {rows.map((inv, index) => (
                <DashboardRecentActivityRow key={inv.id} invoice={inv} tab={activeTab} position={index} />
              ))}
            </div>

            {/* Mobile: stacked cards (below lg) */}
            <div className="lg:hidden">
              {rows.map((inv, index) => (
                <DashboardRecentActivityCard key={inv.id} invoice={inv} tab={activeTab} position={index} />
              ))}
            </div>
          </div>
          {meta && meta.totalPages > 1 && (
            <TablePagination
              displayedCount={rows.length}
              meta={meta}
              currentPage={page}
              onPageChange={setPage}
              countLabel="aktivitas"
            />
          )}
        </SectionCard>
      )}
      <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
        {liveMessage}
      </div>
    </>
  );
}
