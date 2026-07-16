"use client";

import { useMemo } from "react";
import { DateTime } from "luxon";
import { BalanceSheetReportEntity } from "@/features/accounting/domain/entities/balance-sheet";
import { BalanceSheetSection } from "@/features/accounting/presentations/components/reports/balance-sheet-section";
import { BalanceSheetIdentityRow } from "@/features/accounting/presentations/components/reports/balance-sheet-identity-row";

type BalanceSheetViewerProps = {
  report: BalanceSheetReportEntity;
};

export function BalanceSheetViewer({ report }: BalanceSheetViewerProps) {
  const formattedDate = useMemo(
    () => DateTime.fromISO(report.asOf).setLocale("id").toFormat("dd MMMM yyyy"),
    [report.asOf],
  );

  return (
    <div className="overflow-x-auto">
      <table aria-label={`Neraca per ${formattedDate}`} className="w-full min-w-[480px]">
        <caption className="sr-only">Laporan Neraca per {formattedDate}</caption>
        <thead>
          <tr className="border-b border-neutral-100">
            <th scope="col" className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-300">
              Akun
            </th>
            <th scope="col" className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-neutral-300">
              Saldo
            </th>
          </tr>
        </thead>
        {report.sections.map((section) => (
          <BalanceSheetSection key={section.id} section={section} />
        ))}
        <tfoot>
          <BalanceSheetIdentityRow grandTotal={report.grandTotal} isBalanced={report.isBalanced} />
        </tfoot>
      </table>
    </div>
  );
}
