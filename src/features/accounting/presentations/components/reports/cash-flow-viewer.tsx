"use client";

import { useMemo } from "react";
import { DateTime } from "luxon";
import { CashFlowReportEntity, CashFlowLineEntity } from "@/features/accounting/domain/entities/cash-flow";
import { BalanceDisplay } from "@/features/accounting/presentations/components/reports/balance-display";

type CashFlowViewerProps = {
  readonly report: CashFlowReportEntity;
};

type CashFlowLineRowProps = {
  readonly line: CashFlowLineEntity;
};

function CashFlowLineRow({ line }: CashFlowLineRowProps) {
  return (
    <tr className="border-b border-neutral-100">
      <td className="py-2 pl-8 pr-4 text-sm text-neutral-500">{line.label}</td>
      <td className="py-2 pr-6 text-right text-sm tabular-nums">
        <BalanceDisplay value={line.cashImpactDelta} />
      </td>
    </tr>
  );
}

export function CashFlowViewer({ report }: CashFlowViewerProps) {
  const formattedPeriod = useMemo(() => {
    const from = DateTime.fromISO(report.meta.periodFrom).setLocale("id").toFormat("dd MMMM yyyy");
    const to = DateTime.fromISO(report.meta.periodTo).setLocale("id").toFormat("dd MMMM yyyy");
    return `${from} – ${to}`;
  }, [report.meta.periodFrom, report.meta.periodTo]);

  return (
    <div
      role="region"
      aria-label={`Laporan Arus Kas periode ${formattedPeriod}`}
      className="overflow-x-auto"
    >
      <table aria-label={`Arus Kas ${formattedPeriod}`} className="w-full min-w-[480px]">
        <caption className="sr-only">Laporan Arus Kas {formattedPeriod}</caption>
        <thead>
          <tr className="border-b border-neutral-100">
            <th
              scope="col"
              className="py-3 pl-6 pr-4 text-left text-xs font-semibold uppercase tracking-wider text-neutral-300"
            >
              Keterangan
            </th>
            <th
              scope="col"
              className="py-3 pr-6 text-right text-xs font-semibold uppercase tracking-wider text-neutral-300"
            >
              Jumlah
            </th>
          </tr>
        </thead>
        <tbody>
          {/* Operating section */}
          <tr className="border-b border-neutral-100 bg-neutral-50">
            <th
              scope="rowgroup"
              colSpan={2}
              className="px-6 py-2 text-left text-xs font-semibold uppercase tracking-wider text-neutral-400"
            >
              {report.operating.label}
            </th>
          </tr>
          <tr className="border-b border-neutral-100">
            <td className="py-2 pl-8 pr-4 text-sm text-neutral-500">Laba Bersih</td>
            <td className="py-2 pr-6 text-right text-sm tabular-nums">
              <BalanceDisplay value={report.operating.netProfit} />
            </td>
          </tr>
          {report.operating.adjustments.map((line, idx) => (
            <CashFlowLineRow key={`penyesuaian-${idx}`} line={line} />
          ))}
          {report.operating.workingCapitalChanges.map((line, idx) => (
            <CashFlowLineRow key={`perubahan-${idx}`} line={line} />
          ))}
          <tr className="border-b border-neutral-100">
            <td className="py-2 pl-6 pr-4 text-sm font-semibold text-neutral-400">
              {report.operating.subtotal.label}
            </td>
            <td className="py-2 pr-6 text-right text-sm font-semibold tabular-nums">
              <BalanceDisplay value={report.operating.subtotal.amount} />
            </td>
          </tr>

          {/* Investing section */}
          <tr className="border-b border-neutral-100 bg-neutral-50">
            <th
              scope="rowgroup"
              colSpan={2}
              className="px-6 py-2 text-left text-xs font-semibold uppercase tracking-wider text-neutral-400"
            >
              {report.investing.label}
            </th>
          </tr>
          {report.investing.lines.map((line, idx) => (
            <CashFlowLineRow key={`investasi-${idx}`} line={line} />
          ))}
          <tr className="border-b border-neutral-100">
            <td className="py-2 pl-6 pr-4 text-sm font-semibold text-neutral-400">
              {report.investing.subtotal.label}
            </td>
            <td className="py-2 pr-6 text-right text-sm font-semibold tabular-nums">
              <BalanceDisplay value={report.investing.subtotal.amount} />
            </td>
          </tr>

          {/* Financing section */}
          <tr className="border-b border-neutral-100 bg-neutral-50">
            <th
              scope="rowgroup"
              colSpan={2}
              className="px-6 py-2 text-left text-xs font-semibold uppercase tracking-wider text-neutral-400"
            >
              {report.financing.label}
            </th>
          </tr>
          {report.financing.lines.map((line, idx) => (
            <CashFlowLineRow key={`pendanaan-${idx}`} line={line} />
          ))}
          <tr className="border-b border-neutral-100">
            <td className="py-2 pl-6 pr-4 text-sm font-semibold text-neutral-400">
              {report.financing.subtotal.label}
            </td>
            <td className="py-2 pr-6 text-right text-sm font-semibold tabular-nums">
              <BalanceDisplay value={report.financing.subtotal.amount} />
            </td>
          </tr>
        </tbody>

        <tfoot>
          <tr className="border-t-2 border-neutral-300 bg-primary-50">
            <td className="py-3 pl-6 pr-4 text-sm font-semibold text-neutral-500">
              {report.totalCashFlowLabel}
            </td>
            <td className="py-3 pr-6 text-right text-sm font-bold tabular-nums">
              <BalanceDisplay value={report.totalCashFlow} />
            </td>
          </tr>
          <tr className="border-b border-neutral-100 bg-primary-50">
            <td className="py-3 pl-6 pr-4 text-sm font-semibold text-neutral-500">
              {report.openingCashBalanceLabel}
            </td>
            <td className="py-3 pr-6 text-right text-sm font-bold tabular-nums">
              <BalanceDisplay value={report.openingCashBalance} />
            </td>
          </tr>
          <tr className="border-b border-neutral-100 bg-primary-50">
            <td className="py-3 pl-6 pr-4 text-sm font-semibold text-neutral-500">
              {report.closingCashBalanceLabel}
            </td>
            <td className="py-3 pr-6 text-right text-sm font-bold tabular-nums">
              <BalanceDisplay value={report.closingCashBalance} />
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
