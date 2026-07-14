"use client";

import { useGetInvoiceSummary } from "@/features/invoice/presentations/hooks/use-get-invoice-summary";
import { InvoiceType } from "@/features/invoice/domain/enums/invoice-type";
import { IDRFormatter } from "@/core/utilities/currency/domain/formatters/idr-formatter";
import { StatisticCard, StatisticCardSkeleton } from "@/app/(authenticated)/invoices/_components/statistic-card";

export function OutgoingInvoiceStatisticsImpl() {
  const { summary, loading } = useGetInvoiceSummary({ type: InvoiceType.OUTGOING });

  if (loading || !summary) {
    return (
      <div className="flex flex-col gap-4 sm:flex-row">
        <StatisticCardSkeleton />
        <StatisticCardSkeleton />
        <StatisticCardSkeleton />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 sm:flex-row">
      <StatisticCard
        label="Belum Dibayar"
        value={IDRFormatter.toCurrency(summary.unpaidAmount)}
        subtitle={`${summary.unpaidCount} faktur menunggu`}
        iconSrc="/assets/images/circle-dollar-sign-icon-warning-300-w20-h20.svg"
        theme="warning"
        href="/invoices/outgoing?status=unpaid"
        count={summary.unpaidCount}
      />
      <StatisticCard
        label="Menunggu Settlement"
        value={IDRFormatter.toCurrency(summary.waitingSettlementAmount)}
        subtitle={`${summary.waitingSettlementCount} faktur diproses`}
        iconSrc="/assets/images/clock-icon-primary-300-w16-h16.svg"
        iconSize={16}
        theme="primary"
        href="/invoices/outgoing?status=waiting_settlement"
        count={summary.waitingSettlementCount}
      />
      <StatisticCard
        label="Telah Dibayar"
        value={summary.paidCount}
        subtitle="Pembayaran selesai"
        iconSrc="/assets/images/check-icon-success-300-w40-h40.svg"
        theme="success"
        href="/invoices/outgoing?status=paid"
        count={summary.paidCount}
      />
    </div>
  );
}
