"use client";

import { useMemo } from "react";
import { DateTime } from "luxon";
import { NeracaReportEntity } from "@/features/accounting/domain/entities/neraca";
import { NeracaSection } from "@/features/accounting/presentations/components/reports/neraca-section";
import { NeracaIdentityRow } from "@/features/accounting/presentations/components/reports/neraca-identity-row";

type NeracaViewerProps = {
  report: NeracaReportEntity;
};

export function NeracaViewer({ report }: NeracaViewerProps) {
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
          <NeracaSection key={section.id} section={section} />
        ))}
        <tfoot>
          <NeracaIdentityRow grandTotal={report.grandTotal} isBalanced={report.isBalanced} />
        </tfoot>
      </table>
    </div>
  );
}
