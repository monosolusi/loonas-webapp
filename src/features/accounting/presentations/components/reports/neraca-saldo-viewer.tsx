"use client";

import { useMemo } from "react";
import { DateTime } from "luxon";
import { CheckCircleIcon } from "@heroicons/react/24/solid";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { BalanceDisplay } from "@/features/accounting/presentations/components/reports/balance-display";
import { NeracaSaldoAccountRow } from "@/features/accounting/presentations/components/reports/neraca-saldo-account-row";
import { TrialBalanceReportEntity } from "@/features/accounting/domain/entities/trial-balance";

type NeracaSaldoViewerProps = {
  readonly report: TrialBalanceReportEntity;
  readonly expandedAccountId: string | null;
  readonly onToggleExpand: (accountId: string) => void;
};

export function NeracaSaldoViewer({ report, expandedAccountId, onToggleExpand }: NeracaSaldoViewerProps) {
  const formattedDate = useMemo(
    () => DateTime.fromISO(report.asOf).setLocale("id").toFormat("dd MMMM yyyy"),
    [report.asOf],
  );

  return (
    <div className="overflow-x-auto">
      <table
        aria-label={`Neraca Saldo per ${formattedDate}`}
        className="w-full min-w-[600px]"
      >
        <caption className="sr-only">Laporan Neraca Saldo per {formattedDate}</caption>
        <thead>
          <tr className="border-b border-neutral-100">
            <th scope="col" className="w-10 px-3 py-3" aria-label="Ekspansi" />
            <th
              scope="col"
              className="py-3 pr-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-300"
            >
              Kode
            </th>
            <th
              scope="col"
              className="py-3 pr-4 text-left text-xs font-semibold uppercase tracking-wider text-neutral-300"
            >
              Nama Akun
            </th>
            <th
              scope="col"
              className="py-3 pr-4 text-right text-xs font-semibold uppercase tracking-wider text-neutral-300"
            >
              Debit
            </th>
            <th
              scope="col"
              className="py-3 pr-6 text-right text-xs font-semibold uppercase tracking-wider text-neutral-300"
            >
              Kredit
            </th>
          </tr>
        </thead>

        {report.groups.map((group) => (
          <tbody key={group.id}>
            <tr className="border-b border-neutral-100 bg-neutral-50">
              <th
                scope="rowgroup"
                colSpan={5}
                className="px-6 py-2 text-left text-xs font-semibold uppercase tracking-wider text-neutral-400"
              >
                {group.label}
              </th>
            </tr>
            {group.accounts.map((row) => (
              <NeracaSaldoAccountRow
                key={row.id}
                row={row}
                isExpanded={expandedAccountId === row.id}
                onToggle={onToggleExpand}
                includeZero={report.includeZero}
                fiscalYearStart={report.fiscalYearStart}
                asOf={report.asOf}
              />
            ))}
            <tr className="border-b border-neutral-100">
              <td colSpan={3} className="py-2 pl-6 pr-4 text-sm font-semibold text-neutral-400">
                Subtotal {group.label}
              </td>
              <td className="py-2 pr-4 text-right text-sm font-semibold tabular-nums">
                <BalanceDisplay value={group.subtotalDebit} />
              </td>
              <td className="py-2 pr-6 text-right text-sm font-semibold tabular-nums">
                <BalanceDisplay value={group.subtotalCredit} />
              </td>
            </tr>
          </tbody>
        ))}

        <tfoot>
          <tr className="border-t-2 border-neutral-200">
            <td colSpan={3} className="py-3 pl-6 pr-4">
              <div className="flex flex-row items-center gap-x-2">
                {report.isBalanced ? (
                  <>
                    <CheckCircleIcon className="size-4 shrink-0 text-success-400" aria-hidden="true" />
                    <span className="text-sm font-semibold text-success-400">Total Debit = Total Kredit</span>
                  </>
                ) : (
                  <>
                    <ExclamationTriangleIcon className="size-4 shrink-0 text-warning-500" aria-hidden="true" />
                    <span className="text-sm font-semibold text-warning-500">
                      Tidak seimbang — periksa jurnal
                    </span>
                  </>
                )}
              </div>
            </td>
            <td className="py-3 pr-4 text-right text-sm font-bold tabular-nums">
              <BalanceDisplay value={report.closingDebitTotal} />
            </td>
            <td className="py-3 pr-6 text-right text-sm font-bold tabular-nums">
              <BalanceDisplay value={report.closingCreditTotal} />
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
