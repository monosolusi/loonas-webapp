"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { DateTime } from "luxon";
import { DetailPageHeader } from "@/core/presentations/components/detail-page-header";
import { TableContainer } from "@/core/presentations/components/table/table-container";
import { TableHeader } from "@/core/presentations/components/table/table-header";
import { TablePagination } from "@/core/presentations/components/table/table-pagination";
import { DEFAULT_PAGE_SIZE } from "@/core/utilities/pagination";
import { SummaryCard } from "@/core/presentations/components/summary-card";
import { DateRangePicker } from "@/core/presentations/components/date-range-picker";
import { useGetAccountBalance } from "@/features/accounting/presentations/hooks/use-get-account-balance";
import { useListLedgerEntries } from "@/features/accounting/presentations/hooks/use-list-ledger-entries";
import { useListLedgerAccounts } from "@/features/accounting/presentations/hooks/use-list-ledger-accounts";
import { ACCOUNT_TYPE_LABELS, AccountType } from "@/features/accounting/domain/enums/account-type";
import { useLedgerDetailRange } from "@/app/(authenticated)/finance/ledger/[accountId]/_providers/ledger-detail-range-provider";

function isoToDate(iso: string): Date {
  return DateTime.fromISO(iso, { zone: "Asia/Jakarta" }).toJSDate();
}

function dateToIso(date: Date): string {
  return DateTime.fromJSDate(date).setZone("Asia/Jakarta").toFormat("yyyy-MM-dd");
}

type LedgerDetailImplProps = { accountId: string };

export function LedgerDetailImpl({ accountId }: LedgerDetailImplProps) {
  const { from, to, setRange } = useLedgerDetailRange();

  const [page, setPage] = useState(1);

  const startDate = useMemo(() => DateTime.fromISO(from, { zone: "Asia/Jakarta" }).toISODate() ?? undefined, [from]);
  const endDate = useMemo(() => DateTime.fromISO(to, { zone: "Asia/Jakarta" }).toISODate() ?? undefined, [to]);

  // Fetch all accounts to find this one — limit 100 covers default COA
  const { accounts } = useListLedgerAccounts({ limit: 100 });
  const account = useMemo(() => (accounts ?? []).find((a) => a.id === accountId), [accounts, accountId]);

  const { balance, loading: balanceLoading } = useGetAccountBalance({ accountId, startDate, endDate });
  const { entries, meta, loading, error } = useListLedgerEntries({ accountId, page, limit: DEFAULT_PAGE_SIZE, startDate, endDate });

  const accountName = account?.name ?? "Memuat...";
  const accountSubtitle = account ? `${account.code} · ${ACCOUNT_TYPE_LABELS[account.type as AccountType] ?? account.type}` : undefined;

  const [pickerValue, setPickerValue] = useState({
    from: isoToDate(from),
    to: isoToDate(to),
  });

  useEffect(() => {
    setPickerValue({ from: isoToDate(from), to: isoToDate(to) });
  }, [from, to]);

  const committedRef = useRef<{ from: string; to: string }>({ from, to });

  const handlePickerChange = useCallback(
    (range: { from: Date | undefined; to: Date | undefined }) => {
      if (!range.from || !range.to) return;
      const nextFrom = dateToIso(range.from);
      const nextTo = dateToIso(range.to);
      if (nextFrom === committedRef.current.from && nextTo === committedRef.current.to) return;
      committedRef.current = { from: nextFrom, to: nextTo };
      setRange({ from: nextFrom, to: nextTo });
      setPage(1);
    },
    [setRange, setPage],
  );

  const header = (
    <TableHeader
      columns={[
        { label: "Tanggal" },
        { label: "Memo" },
        { label: "Debit", align: "right" },
        { label: "Kredit", align: "right" },
      ]}
      className="grid-cols-[1.5fr_3fr_1fr_1fr]"
    />
  );

  const toolbar = (
    <div className="flex flex-row items-center justify-between">
      <DateRangePicker
        value={pickerValue}
        onChange={handlePickerChange}
        maxSpanDays={365}
        disableFutureDates={false}
      />
    </div>
  );

  return (
    <div className="flex flex-col gap-y-6">
      <DetailPageHeader backHref="/finance/ledger" title={accountName} subtitle={accountSubtitle} />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <SummaryCard label="Saldo" value={balance?.displayBalance ?? "—"} variant="primary" valueClassName={balance && balance.balance < 0 ? "text-warning-500" : undefined} loading={balanceLoading} />
        <SummaryCard label="Total Debit" value={balance?.displayDebit ?? "—"} variant="neutral" loading={balanceLoading} />
        <SummaryCard label="Total Kredit" value={balance?.displayCredit ?? "—"} variant="neutral" loading={balanceLoading} />
      </div>

      {toolbar}

      <TableContainer loading={loading} error={!!error} empty={(entries ?? []).length === 0 && !loading} emptyMessage="Tidak ada transaksi pada periode ini.">
        <div className="overflow-x-auto">
          <div className="min-w-[640px]">
            {header}
            {(entries ?? []).map((entry) => (
              <div key={entry.id} className="grid grid-cols-[1.5fr_3fr_1fr_1fr] items-center border-b border-neutral-100 px-6 py-4 last:border-b-0">
                <span className="text-sm text-neutral-400">{entry.displayDate}</span>
                <span className="text-sm text-neutral-500">{entry.memo || "—"}</span>
                <span className="text-right text-sm font-medium text-neutral-500">{entry.displayDebit}</span>
                <span className="text-right text-sm font-medium text-neutral-500">{entry.displayCredit}</span>
              </div>
            ))}
          </div>
        </div>
        {meta && meta.totalPages > 1 && (
          <TablePagination displayedCount={(entries ?? []).length} meta={meta} currentPage={page} onPageChange={setPage} />
        )}
      </TableContainer>
    </div>
  );
}
