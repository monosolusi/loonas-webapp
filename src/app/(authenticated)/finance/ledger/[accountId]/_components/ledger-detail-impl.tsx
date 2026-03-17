"use client";

import { useEffect, useMemo, useState } from "react";
import { DateTime } from "luxon";
import { DetailPageHeader } from "@/core/presentations/components/detail-page-header";
import { InvoiceTableShell } from "@/app/(authenticated)/invoices/_components/invoice-table-shell";
import { TablePagination } from "@/app/(authenticated)/invoices/_components/table-pagination";
import { SummaryCard } from "@/app/(authenticated)/finance/_components/summary-card";
import { DateRangePicker } from "@/app/(authenticated)/finance/_components/date-range-picker";
import { useGetAccountBalance } from "@/features/accounting/presentations/hooks/use-get-account-balance";
import { useListLedgerEntries } from "@/features/accounting/presentations/hooks/use-list-ledger-entries";
import { useListLedgerAccounts } from "@/features/accounting/presentations/hooks/use-list-ledger-accounts";
import { ACCOUNT_TYPE_LABELS, AccountType } from "@/features/accounting/domain/enums/account-type";

type LedgerDetailImplProps = { accountId: string };

export function LedgerDetailImpl({ accountId }: LedgerDetailImplProps) {
  const [page, setPage] = useState(1);
  const [dateRange, setDateRange] = useState<{ from: Date | undefined; to: Date | undefined }>({
    from: DateTime.now().startOf("month").toJSDate(),
    to: DateTime.now().toJSDate(),
  });

  const startDate = dateRange.from ? DateTime.fromJSDate(dateRange.from).toISODate() ?? undefined : undefined;
  const endDate = dateRange.to ? DateTime.fromJSDate(dateRange.to).toISODate() ?? undefined : undefined;

  useEffect(() => setPage(1), [startDate, endDate]);

  // Fetch all accounts to find this one — limit 100 covers default COA
  const { accounts } = useListLedgerAccounts({ limit: 100 });
  const account = useMemo(() => accounts.find((a) => a.id === accountId), [accounts, accountId]);

  const { balance, loading: balanceLoading } = useGetAccountBalance(accountId, { startDate, endDate });
  const { entries, meta, loading, error } = useListLedgerEntries(accountId, { page, limit: 25, startDate, endDate });

  const accountName = account?.name ?? "Memuat...";
  const accountSubtitle = account ? `${account.code} · ${ACCOUNT_TYPE_LABELS[account.type as AccountType] ?? account.type}` : undefined;

  const header = (
    <div className="grid grid-cols-[1.5fr_3fr_1fr_1fr] border-b border-neutral-100 bg-neutral-50 px-6 py-3">
      <span className="text-xs leading-4 font-medium tracking-wider text-neutral-300 uppercase">Tanggal</span>
      <span className="text-xs leading-4 font-medium tracking-wider text-neutral-300 uppercase">Memo</span>
      <span className="text-right text-xs leading-4 font-medium tracking-wider text-neutral-300 uppercase">Debit</span>
      <span className="text-right text-xs leading-4 font-medium tracking-wider text-neutral-300 uppercase">Kredit</span>
    </div>
  );

  const toolbar = (
    <div className="flex flex-row items-center justify-between">
      <DateRangePicker value={dateRange} onChange={setDateRange} />
    </div>
  );

  return (
    <div className="flex flex-col gap-y-6">
      <DetailPageHeader backHref="/finance/ledger" title={accountName} subtitle={accountSubtitle} />

      <div className="grid grid-cols-3 gap-4">
        <SummaryCard label="Saldo" value={balance?.displayBalance ?? "—"} variant="primary" loading={balanceLoading} />
        <SummaryCard label="Total Debit" value={balance?.displayDebit ?? "—"} variant="neutral" loading={balanceLoading} />
        <SummaryCard label="Total Kredit" value={balance?.displayCredit ?? "—"} variant="neutral" loading={balanceLoading} />
      </div>

      <InvoiceTableShell toolbar={toolbar} header={header} loading={loading} error={!!error} empty={entries.length === 0 && !loading} emptyMessage="Tidak ada transaksi pada periode ini.">
        {entries.map((entry) => (
          <div key={entry.id} className="grid grid-cols-[1.5fr_3fr_1fr_1fr] items-center border-b border-neutral-100 px-6 py-4 last:border-b-0">
            <span className="text-sm text-neutral-400">{entry.displayDate}</span>
            <span className="text-sm text-neutral-500">{entry.memo || "—"}</span>
            <span className="text-right text-sm font-medium text-neutral-500">{entry.displayDebit}</span>
            <span className="text-right text-sm font-medium text-neutral-500">{entry.displayCredit}</span>
          </div>
        ))}
        {meta && meta.totalPages > 1 && (
          <TablePagination displayedCount={entries.length} meta={meta} currentPage={page} onPageChange={setPage} />
        )}
      </InvoiceTableShell>
    </div>
  );
}
