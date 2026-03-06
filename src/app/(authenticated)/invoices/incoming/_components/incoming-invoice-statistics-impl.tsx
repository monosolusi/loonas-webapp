"use client";

import { useGetInvoiceSummary } from "@/features/invoice/presentations/hooks/use-get-invoice-summary";
import { InvoiceType } from "@/features/invoice/domain/enums/invoice-type";
import { IDRFormatter } from "@/core/utilities/currency/domain/formatters/idr-formatter";
import { StatisticCard, StatisticCardSkeleton } from "@/app/(authenticated)/invoices/_components/statistic-card";

export function IncomingInvoiceStatisticsImpl() {
  const { summary, loading } = useGetInvoiceSummary({ type: InvoiceType.INCOMING });

  if (loading || !summary) {
    return (
      <div className="flex flex-row gap-x-4">
        <StatisticCardSkeleton />
        <StatisticCardSkeleton />
        <StatisticCardSkeleton />
      </div>
    );
  }

  return (
    <div className="flex flex-row gap-x-4">
      <StatisticCard
        label="Belum Dibayar"
        value={IDRFormatter.toCurrency(summary.unpaidAmount)}
        subtitle={`${summary.unpaidCount} faktur menunggu`}
        iconSrc="/assets/images/circle-dollar-sign-icon-warning-300-w20-h20.svg"
        theme="warning"
        href="/invoices/incoming/unpaid"
        count={summary.unpaidCount}
      />
      <StatisticCard
        label="Total Faktur"
        value={summary.totalCount}
        subtitle="Semua faktur aktif"
        iconSrc="/assets/images/document-icon-primary-300-w16-h16.svg"
        iconSize={16}
        theme="primary"
        count={summary.totalCount}
      />
      <StatisticCard
        label="Telah Dibayar"
        value={summary.paidCount}
        subtitle="Pembayaran selesai"
        iconSrc="/assets/images/check-icon-success-300-w40-h40.svg"
        theme="success"
        href="/invoices/incoming/paid"
        count={summary.paidCount}
      />
    </div>
  );
}
