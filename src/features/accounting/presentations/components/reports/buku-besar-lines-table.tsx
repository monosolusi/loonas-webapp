"use client";

import { DateTime } from "luxon";
import { BukuBesarLinesEmpty } from "@/features/accounting/presentations/components/reports/buku-besar-lines-empty";
import { BalanceDisplay } from "@/features/accounting/presentations/components/reports/balance-display";
import { TablePagination } from "@/core/presentations/components/table/table-pagination";
import { GeneralLedgerLineEntity, GeneralLedgerCounterpartEntity } from "@/features/accounting/domain/entities/general-ledger";
import { PaginationMeta } from "@/core/resources/paginated";

function formatCounterpartCodes(cps: GeneralLedgerCounterpartEntity[]): string {
  if (cps.length === 0) return "";
  const first2 = cps.slice(0, 2).map((c) => c.accountCode);
  const rest = cps.length - 2;
  if (rest > 0) return first2.join(" · ") + ` +${rest} lainnya`;
  return first2.join(" · ");
}

type BukuBesarLinesTableProps = {
  lines: GeneralLedgerLineEntity[];
  counterpartMap: Map<string, GeneralLedgerCounterpartEntity[]>;
  meta: PaginationMeta | null;
  page: number;
  onPageChange: (page: number) => void;
};

export function BukuBesarLinesTable({ lines, counterpartMap, meta, page, onPageChange }: BukuBesarLinesTableProps) {
  if (lines.length === 0) return <BukuBesarLinesEmpty />;

  return (
    <>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px]">
          <thead>
            <tr className="border-b border-neutral-100">
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-300"
              >
                Tanggal
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-300"
              >
                Ref
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-neutral-300"
              >
                Memo / Akun Lawan
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-neutral-300"
              >
                Debit
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-neutral-300"
              >
                Kredit
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-right text-xs font-semibold uppercase tracking-wider text-neutral-300"
              >
                Saldo Berjalan
              </th>
            </tr>
          </thead>
          <tbody>
            {lines.map((line) => {
              const cps = counterpartMap.get(line.journalEntryId) ?? [];
              const cpCodes = formatCounterpartCodes(cps);
              const formattedDate = DateTime.fromISO(line.date).setLocale("id").toFormat("dd MMM yyyy");
              return (
                <tr key={line.id} className="border-b border-neutral-100 last:border-b-0">
                  <td className="whitespace-nowrap px-6 py-4 text-sm text-neutral-400">{formattedDate}</td>
                  <td className="px-4 py-4 text-sm text-neutral-300">{line.referenceType ?? "—"}</td>
                  <td className="px-4 py-4 text-sm">
                    <div className="text-neutral-400">{line.memo ?? "—"}</div>
                    {cpCodes && <div className="font-mono text-xs text-neutral-300">{cpCodes}</div>}
                  </td>
                  <td className="px-4 py-4 text-right text-sm tabular-nums text-neutral-400">
                    {line.debit > 0 ? <BalanceDisplay value={line.debit} /> : <span className="text-neutral-200">—</span>}
                  </td>
                  <td className="px-4 py-4 text-right text-sm tabular-nums text-neutral-400">
                    {line.credit > 0 ? <BalanceDisplay value={line.credit} /> : <span className="text-neutral-200">—</span>}
                  </td>
                  <td className="px-6 py-4 text-right text-sm tabular-nums text-neutral-400">
                    <BalanceDisplay value={line.runningBalance} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {meta && meta.totalPages > 1 && (
        <TablePagination
          displayedCount={lines.length}
          meta={meta}
          currentPage={page}
          onPageChange={onPageChange}
        />
      )}
    </>
  );
}
