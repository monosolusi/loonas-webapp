"use client";

import { useMemo } from "react";
import { DateTime } from "luxon";
import clsx from "clsx";
import { LabaRugiReportEntity, LabaRugiBucketEntity } from "@/features/accounting/domain/entities/laba-rugi";
import { BalanceDisplay } from "@/features/accounting/presentations/components/reports/balance-display";

type LabaRugiViewerProps = {
  readonly report: LabaRugiReportEntity;
};

type BucketBlockProps = {
  readonly bucket: LabaRugiBucketEntity;
  readonly compareBucket: LabaRugiBucketEntity | null;
  readonly hasCompare: boolean;
};

function LabaRugiBucketBlock({ bucket, compareBucket, hasCompare }: BucketBlockProps) {
  return (
    <>
      <tr className="border-b border-neutral-100 bg-neutral-50">
        <th
          scope="rowgroup"
          colSpan={hasCompare ? 3 : 2}
          className="px-6 py-2 text-left text-xs font-semibold uppercase tracking-wider text-neutral-400"
        >
          {bucket.label}
        </th>
      </tr>
      {bucket.lines.map((line) => (
        <tr key={line.id} className="border-b border-neutral-100">
          <td className="py-2 pl-8 pr-4 text-sm text-neutral-500">{line.accountName}</td>
          <td className="py-2 pr-6 text-right text-sm tabular-nums">
            <BalanceDisplay value={line.amount} />
          </td>
          {hasCompare && <td className="py-2 pr-6 text-right text-sm tabular-nums text-neutral-200">—</td>}
        </tr>
      ))}
      <tr className="border-b border-neutral-100">
        <td className="py-2 pl-6 pr-4 text-sm font-semibold text-neutral-400">Subtotal {bucket.label}</td>
        <td className="py-2 pr-6 text-right text-sm font-semibold tabular-nums">
          <BalanceDisplay value={bucket.subtotal} />
        </td>
        {hasCompare && (
          <td className="py-2 pr-6 text-right text-sm font-semibold tabular-nums">
            {compareBucket !== null ? (
              <BalanceDisplay value={compareBucket.subtotal} />
            ) : (
              <span className="text-neutral-200">—</span>
            )}
          </td>
        )}
      </tr>
    </>
  );
}

type ComputedRowProps = {
  readonly label: string;
  readonly value: number;
  readonly compareValue: number | null;
  readonly hasCompare: boolean;
  readonly isNetRow?: boolean;
};

function LabaRugiComputedRow({ label, value, compareValue, hasCompare, isNetRow = false }: ComputedRowProps) {
  return (
    <tr
      className={clsx(
        "border-b border-neutral-100",
        isNetRow && "border-t-2 border-neutral-300 bg-primary-50",
      )}
    >
      <td className="py-2 pl-6 pr-4 text-sm font-semibold text-neutral-500">{label}</td>
      <td className="py-2 pr-6 text-right text-sm font-semibold tabular-nums">
        <BalanceDisplay value={value} />
      </td>
      {hasCompare && (
        <td className="py-2 pr-6 text-right text-sm font-semibold tabular-nums">
          {compareValue !== null ? (
            <BalanceDisplay value={compareValue} />
          ) : (
            <span className="text-neutral-200">—</span>
          )}
        </td>
      )}
    </tr>
  );
}

export function LabaRugiViewer({ report }: LabaRugiViewerProps) {
  const hasCompare = report.compare !== null;
  const current = report.current;
  const compare = report.compare;

  const formattedPeriod = useMemo(() => {
    const from = DateTime.fromISO(report.meta.from).setLocale("id").toFormat("dd MMMM yyyy");
    const to = DateTime.fromISO(report.meta.to).setLocale("id").toFormat("dd MMMM yyyy");
    return `${from} – ${to}`;
  }, [report.meta.from, report.meta.to]);

  const formattedComparePeriod = useMemo((): string | null => {
    if (!report.meta.compareFrom || !report.meta.compareTo) return null;
    const from = DateTime.fromISO(report.meta.compareFrom).setLocale("id").toFormat("dd MMMM yyyy");
    const to = DateTime.fromISO(report.meta.compareTo).setLocale("id").toFormat("dd MMMM yyyy");
    return `${from} – ${to}`;
  }, [report.meta.compareFrom, report.meta.compareTo]);

  return (
    <div
      role="region"
      aria-label={`Laporan Laba Rugi periode ${formattedPeriod}`}
      className="overflow-x-auto"
    >
      <table aria-label={`Laba Rugi ${formattedPeriod}`} className="w-full min-w-[480px]">
        <caption className="sr-only">Laporan Laba Rugi {formattedPeriod}</caption>
        <thead>
          <tr className="border-b border-neutral-100">
            <th
              scope="col"
              className="py-3 pl-6 pr-4 text-left text-xs font-semibold uppercase tracking-wider text-neutral-300"
            >
              Akun
            </th>
            <th
              scope="col"
              className="py-3 pr-6 text-right text-xs font-semibold uppercase tracking-wider text-neutral-300"
            >
              {formattedPeriod}
            </th>
            {hasCompare && formattedComparePeriod && (
              <th
                scope="col"
                className="py-3 pr-6 text-right text-xs font-semibold uppercase tracking-wider text-neutral-300"
              >
                {formattedComparePeriod}
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {/* 1. Pendapatan */}
          <LabaRugiBucketBlock
            bucket={current.pendapatan}
            compareBucket={compare?.pendapatan ?? null}
            hasCompare={hasCompare}
          />
          {/* 2. Harga Pokok Penjualan */}
          <LabaRugiBucketBlock
            bucket={current.hargaPokokPenjualan}
            compareBucket={compare?.hargaPokokPenjualan ?? null}
            hasCompare={hasCompare}
          />
          {/* 3. Laba Kotor */}
          <LabaRugiComputedRow
            label="Laba Kotor"
            value={current.labaKotor}
            compareValue={compare?.labaKotor ?? null}
            hasCompare={hasCompare}
          />
          {/* 4. Biaya Operasional */}
          <LabaRugiBucketBlock
            bucket={current.biayaOperasional}
            compareBucket={compare?.biayaOperasional ?? null}
            hasCompare={hasCompare}
          />
          {/* 5. Laba Operasional */}
          <LabaRugiComputedRow
            label="Laba Operasional"
            value={current.labaOperasional}
            compareValue={compare?.labaOperasional ?? null}
            hasCompare={hasCompare}
          />
          {/* 6. Pendapatan Lain-lain (nullable) */}
          {current.pendapatanLainLain !== null && (
            <LabaRugiBucketBlock
              bucket={current.pendapatanLainLain}
              compareBucket={compare?.pendapatanLainLain ?? null}
              hasCompare={hasCompare}
            />
          )}
          {/* 7. Beban Lain-lain (nullable) */}
          {current.bebanLainLain !== null && (
            <LabaRugiBucketBlock
              bucket={current.bebanLainLain}
              compareBucket={compare?.bebanLainLain ?? null}
              hasCompare={hasCompare}
            />
          )}
          {/* 8. Laba Sebelum Pajak */}
          <LabaRugiComputedRow
            label="Laba Sebelum Pajak"
            value={current.labaSebelumPajak}
            compareValue={compare?.labaSebelumPajak ?? null}
            hasCompare={hasCompare}
          />
          {/* 9. Pajak */}
          <LabaRugiBucketBlock
            bucket={current.pajak}
            compareBucket={compare?.pajak ?? null}
            hasCompare={hasCompare}
          />
          {/* 10. Laba Bersih (net row) */}
          <LabaRugiComputedRow
            label="Laba Bersih"
            value={current.labaBersih}
            compareValue={compare?.labaBersih ?? null}
            hasCompare={hasCompare}
            isNetRow
          />
        </tbody>
      </table>
    </div>
  );
}
