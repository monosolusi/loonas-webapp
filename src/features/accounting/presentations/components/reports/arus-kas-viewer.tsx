"use client";

import { useMemo } from "react";
import { DateTime } from "luxon";
import { ArusKasReportEntity, ArusKasLineEntity } from "@/features/accounting/domain/entities/arus-kas";
import { BalanceDisplay } from "@/features/accounting/presentations/components/reports/balance-display";

type ArusKasViewerProps = {
  readonly report: ArusKasReportEntity;
};

type ArusKasLineRowProps = {
  readonly line: ArusKasLineEntity;
};

function ArusKasLineRow({ line }: ArusKasLineRowProps) {
  return (
    <tr className="border-b border-neutral-100">
      <td className="py-2 pl-8 pr-4 text-sm text-neutral-500">{line.label}</td>
      <td className="py-2 pr-6 text-right text-sm tabular-nums">
        <BalanceDisplay value={line.cashImpactDelta} />
      </td>
    </tr>
  );
}

export function ArusKasViewer({ report }: ArusKasViewerProps) {
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
          {/* Operasi section */}
          <tr className="border-b border-neutral-100 bg-neutral-50">
            <th
              scope="rowgroup"
              colSpan={2}
              className="px-6 py-2 text-left text-xs font-semibold uppercase tracking-wider text-neutral-400"
            >
              {report.operasi.label}
            </th>
          </tr>
          <tr className="border-b border-neutral-100">
            <td className="py-2 pl-8 pr-4 text-sm text-neutral-500">{report.operasi.label} — Laba Bersih</td>
            <td className="py-2 pr-6 text-right text-sm tabular-nums">
              <BalanceDisplay value={report.operasi.labaBersih} />
            </td>
          </tr>
          {report.operasi.penyesuaian.map((line, idx) => (
            <ArusKasLineRow key={`penyesuaian-${idx}`} line={line} />
          ))}
          {report.operasi.perubahanModalKerja.map((line, idx) => (
            <ArusKasLineRow key={`perubahan-${idx}`} line={line} />
          ))}
          <tr className="border-b border-neutral-100">
            <td className="py-2 pl-6 pr-4 text-sm font-semibold text-neutral-400">
              {report.operasi.subtotal.label}
            </td>
            <td className="py-2 pr-6 text-right text-sm font-semibold tabular-nums">
              <BalanceDisplay value={report.operasi.subtotal.amount} />
            </td>
          </tr>

          {/* Investasi section */}
          <tr className="border-b border-neutral-100 bg-neutral-50">
            <th
              scope="rowgroup"
              colSpan={2}
              className="px-6 py-2 text-left text-xs font-semibold uppercase tracking-wider text-neutral-400"
            >
              {report.investasi.label}
            </th>
          </tr>
          {report.investasi.lines.map((line, idx) => (
            <ArusKasLineRow key={`investasi-${idx}`} line={line} />
          ))}
          <tr className="border-b border-neutral-100">
            <td className="py-2 pl-6 pr-4 text-sm font-semibold text-neutral-400">
              {report.investasi.subtotal.label}
            </td>
            <td className="py-2 pr-6 text-right text-sm font-semibold tabular-nums">
              <BalanceDisplay value={report.investasi.subtotal.amount} />
            </td>
          </tr>

          {/* Pendanaan section */}
          <tr className="border-b border-neutral-100 bg-neutral-50">
            <th
              scope="rowgroup"
              colSpan={2}
              className="px-6 py-2 text-left text-xs font-semibold uppercase tracking-wider text-neutral-400"
            >
              {report.pendanaan.label}
            </th>
          </tr>
          {report.pendanaan.lines.map((line, idx) => (
            <ArusKasLineRow key={`pendanaan-${idx}`} line={line} />
          ))}
          <tr className="border-b border-neutral-100">
            <td className="py-2 pl-6 pr-4 text-sm font-semibold text-neutral-400">
              {report.pendanaan.subtotal.label}
            </td>
            <td className="py-2 pr-6 text-right text-sm font-semibold tabular-nums">
              <BalanceDisplay value={report.pendanaan.subtotal.amount} />
            </td>
          </tr>
        </tbody>

        <tfoot>
          <tr className="border-t-2 border-neutral-300 bg-primary-50">
            <td className="py-3 pl-6 pr-4 text-sm font-semibold text-neutral-500">
              {report.totalArusKasLabel}
            </td>
            <td className="py-3 pr-6 text-right text-sm font-bold tabular-nums">
              <BalanceDisplay value={report.totalArusKas} />
            </td>
          </tr>
          <tr className="border-b border-neutral-100 bg-primary-50">
            <td className="py-3 pl-6 pr-4 text-sm font-semibold text-neutral-500">
              {report.saldoKasAwalLabel}
            </td>
            <td className="py-3 pr-6 text-right text-sm font-bold tabular-nums">
              <BalanceDisplay value={report.saldoKasAwal} />
            </td>
          </tr>
          <tr className="border-b border-neutral-100 bg-primary-50">
            <td className="py-3 pl-6 pr-4 text-sm font-semibold text-neutral-500">
              {report.saldoKasAkhirLabel}
            </td>
            <td className="py-3 pr-6 text-right text-sm font-bold tabular-nums">
              <BalanceDisplay value={report.saldoKasAkhir} />
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
