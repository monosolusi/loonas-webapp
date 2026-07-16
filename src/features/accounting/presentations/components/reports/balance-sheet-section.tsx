"use client";

import { Fragment, useMemo } from "react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/solid";
import { BalanceSheetSectionEntity } from "@/features/accounting/domain/entities/balance-sheet";
import { BalanceDisplay } from "@/features/accounting/presentations/components/reports/balance-display";

type BalanceSheetSectionProps = {
  section: BalanceSheetSectionEntity;
};

export function BalanceSheetSection({ section }: BalanceSheetSectionProps) {
  const showBucketHeaders = useMemo(
    () => section.buckets.length > 1,
    [section.buckets.length],
  );

  return (
    <tbody>
      <tr>
        <th
          scope="rowgroup"
          colSpan={2}
          className="border-t border-neutral-100 bg-neutral-50 px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-300"
        >
          {section.name.toUpperCase()}
        </th>
      </tr>

      {section.buckets.map((bucket) => (
        <Fragment key={bucket.id}>
          {showBucketHeaders && bucket.name && (
            <tr>
              <td
                colSpan={2}
                className="px-6 py-2 text-xs font-semibold uppercase tracking-wider text-neutral-400"
              >
                {bucket.name}
              </td>
            </tr>
          )}

          {bucket.lines.map((line) => (
            <tr key={line.id}>
              <td className="pl-10 pr-6 py-3 text-sm text-neutral-500">
                <span className="text-neutral-300">{line.accountCode}</span>
                <span className="text-neutral-200"> · </span>
                <span>{line.accountName}</span>
                {line.isAbnormalBalance && (
                  <ExclamationTriangleIcon
                    className="ml-1.5 inline size-3.5 text-warning-500"
                    title="Saldo tidak normal untuk akun ini"
                  />
                )}
              </td>
              <td className="px-6 py-3 text-right text-sm">
                <BalanceDisplay value={line.balanceAsOf} />
              </td>
            </tr>
          ))}

          <tr className="border-t border-neutral-100">
            <td className="pl-10 pr-6 py-3 text-sm font-semibold text-neutral-500">Total {bucket.name}</td>
            <td className="px-6 py-3 text-right text-sm font-semibold">
              <BalanceDisplay value={bucket.subtotal} />
            </td>
          </tr>
        </Fragment>
      ))}

      <tr className="border-t-2 border-neutral-300">
        <td className="px-6 py-3 text-sm font-bold text-neutral-500">Total {section.name}</td>
        <td className="px-6 py-3 text-right text-sm font-bold">
          <BalanceDisplay value={section.total} />
        </td>
      </tr>
    </tbody>
  );
}
