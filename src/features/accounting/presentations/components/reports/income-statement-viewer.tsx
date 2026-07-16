"use client";

import { useMemo } from "react";
import { DateTime } from "luxon";
import clsx from "clsx";
import { IncomeStatementReportEntity, IncomeStatementBucketEntity } from "@/features/accounting/domain/entities/income-statement";
import { BalanceDisplay } from "@/features/accounting/presentations/components/reports/balance-display";

type IncomeStatementViewerProps = {
  readonly report: IncomeStatementReportEntity;
};

type BucketBlockProps = {
  readonly bucket: IncomeStatementBucketEntity;
  readonly compareBucket: IncomeStatementBucketEntity | null;
  readonly hasCompare: boolean;
};

function IncomeStatementBucketBlock({ bucket, compareBucket, hasCompare }: BucketBlockProps) {
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

function IncomeStatementComputedRow({ label, value, compareValue, hasCompare, isNetRow = false }: ComputedRowProps) {
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

export function IncomeStatementViewer({ report }: IncomeStatementViewerProps) {
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
          <IncomeStatementBucketBlock
            bucket={current.revenue}
            compareBucket={compare?.revenue ?? null}
            hasCompare={hasCompare}
          />
          {/* 2. Harga Pokok Penjualan */}
          <IncomeStatementBucketBlock
            bucket={current.costOfGoodsSold}
            compareBucket={compare?.costOfGoodsSold ?? null}
            hasCompare={hasCompare}
          />
          {/* 3. Laba Kotor */}
          <IncomeStatementComputedRow
            label="Laba Kotor"
            value={current.grossProfit}
            compareValue={compare?.grossProfit ?? null}
            hasCompare={hasCompare}
          />
          {/* 4. Biaya Operasional */}
          <IncomeStatementBucketBlock
            bucket={current.operatingExpenses}
            compareBucket={compare?.operatingExpenses ?? null}
            hasCompare={hasCompare}
          />
          {/* 5. Laba Operasional */}
          <IncomeStatementComputedRow
            label="Laba Operasional"
            value={current.operatingProfit}
            compareValue={compare?.operatingProfit ?? null}
            hasCompare={hasCompare}
          />
          {/* 6. Pendapatan Lain-lain (nullable) */}
          {current.otherIncome !== null && (
            <IncomeStatementBucketBlock
              bucket={current.otherIncome}
              compareBucket={compare?.otherIncome ?? null}
              hasCompare={hasCompare}
            />
          )}
          {/* 7. Beban Lain-lain (nullable) */}
          {current.otherExpenses !== null && (
            <IncomeStatementBucketBlock
              bucket={current.otherExpenses}
              compareBucket={compare?.otherExpenses ?? null}
              hasCompare={hasCompare}
            />
          )}
          {/* 8. Laba Sebelum Pajak */}
          <IncomeStatementComputedRow
            label="Laba Sebelum Pajak"
            value={current.profitBeforeTax}
            compareValue={compare?.profitBeforeTax ?? null}
            hasCompare={hasCompare}
          />
          {/* 9. Pajak */}
          <IncomeStatementBucketBlock
            bucket={current.tax}
            compareBucket={compare?.tax ?? null}
            hasCompare={hasCompare}
          />
          {/* 10. Laba Bersih (net row) */}
          <IncomeStatementComputedRow
            label="Laba Bersih"
            value={current.netProfit}
            compareValue={compare?.netProfit ?? null}
            hasCompare={hasCompare}
            isNetRow
          />
        </tbody>
      </table>
    </div>
  );
}
