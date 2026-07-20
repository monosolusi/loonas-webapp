"use client";

import { Fragment, useCallback, useEffect, useMemo, useRef, useState } from "react";
import clsx from "clsx";
import Link from "next/link";
import { DateTime } from "luxon";
import { useDebounce } from "@/core/presentations/hooks/use-debounce";
import { IDRFormatter } from "@/core/utilities/currency/domain/formatters/idr-formatter";
import { TableContainer } from "@/core/presentations/components/table/table-container";
import { TableHeader } from "@/core/presentations/components/table/table-header";
import { TablePagination } from "@/core/presentations/components/table/table-pagination";
import { TableSearch } from "@/core/presentations/components/table/table-search";
import { TableToolbar } from "@/core/presentations/components/table/table-toolbar";
import { ListPageHeader } from "@/core/presentations/components/list-page-header";
import { MobileListCard } from "@/core/presentations/components/table/mobile-list-card";
import { DateRangePicker } from "@/core/presentations/components/date-range-picker";
import { DEFAULT_PAGE_SIZE } from "@/core/utilities/pagination";
import { FilterDropdown, FilterPill } from "@/app/(authenticated)/products/_components/filter-dropdown";
import { AccountTypeBadge } from "@/app/(authenticated)/accounting/ledger/_components/account-type-badge";
import { useLedgerListRange } from "@/app/(authenticated)/accounting/ledger/_providers/ledger-list-range-provider";
import { useListLedgerAccounts } from "@/features/accounting/presentations/hooks/use-list-ledger-accounts";
import { AccountType, ACCOUNT_TYPE_LABELS } from "@/features/accounting/domain/enums/account-type";

const TYPE_OPTIONS = Object.values(AccountType).map((t) => ({ label: ACCOUNT_TYPE_LABELS[t], value: t }));

function isoToDate(iso: string): Date {
  return DateTime.fromISO(iso, { zone: "Asia/Jakarta" }).toJSDate();
}

function dateToIso(date: Date): string {
  return DateTime.fromJSDate(date).setZone("Asia/Jakarta").toFormat("yyyy-MM-dd");
}

export function LedgerListImpl() {
  const { from, to, setRange } = useLedgerListRange();

  const [page, setPage] = useState(1);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search.trim(), 500);
  const searchQuery = debouncedSearch.length >= 2 ? debouncedSearch : undefined;

  const startDate = useMemo(() => DateTime.fromISO(from, { zone: "Asia/Jakarta" }).toISODate() ?? undefined, [from]);
  const endDate = useMemo(() => DateTime.fromISO(to, { zone: "Asia/Jakarta" }).toISODate() ?? undefined, [to]);

  const { accounts, meta, loading, error } = useListLedgerAccounts({
    page,
    limit: DEFAULT_PAGE_SIZE,
    search: searchQuery,
    types: selectedTypes.length > 0 ? (selectedTypes as AccountType[]) : undefined,
    startDate,
    endDate,
  });

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

  const hasActiveFilters = selectedTypes.length > 0;

  const toolbar = (
    <div className="flex flex-col gap-y-3">
      <TableToolbar>
        <div className="flex flex-row flex-wrap items-center gap-3">
          <FilterDropdown
            label="Tipe Akun"
            options={TYPE_OPTIONS}
            selected={selectedTypes}
            onChange={(v) => { setSelectedTypes(v); setPage(1); }}
            multiple
          />
          <DateRangePicker
            value={pickerValue}
            onChange={handlePickerChange}
            maxSpanDays={365}
            disableFutureDates={false}
          />
        </div>
        <TableSearch value={search} onChange={setSearch} placeholder="Cari kode atau nama akun..." />
      </TableToolbar>
      {hasActiveFilters && (
        <div className="flex flex-row flex-wrap items-center gap-2">
          {selectedTypes.map((t) => (
            <FilterPill key={t} label={ACCOUNT_TYPE_LABELS[t as AccountType]} onRemove={() => { setSelectedTypes((prev) => prev.filter((v) => v !== t)); setPage(1); }} />
          ))}
          <button type="button" onClick={() => { setSelectedTypes([]); setPage(1); }} className="text-xs font-medium text-neutral-300 transition-colors hover:text-neutral-500">
            Hapus semua
          </button>
        </div>
      )}
    </div>
  );

  const header = (
    <TableHeader
      columns={[
        { label: "Kode" },
        { label: "Nama Akun" },
        { label: "Tipe" },
        { label: "Saldo", align: "right" },
      ]}
      className="grid-cols-[0.5fr_2fr_1.2fr_1fr]"
      hideOnMobile
    />
  );

  return (
    <div className="flex flex-col gap-y-6">
      <ListPageHeader title="Buku Besar" subtitle={meta ? `${meta.total} akun` : "Memuat..."} />

      {toolbar}

      <TableContainer loading={loading} error={!!error} empty={(accounts ?? []).length === 0 && !loading} emptyMessage="Belum ada akun.">
        {header}
        {(accounts ?? []).map((account) => (
          <Fragment key={account.id}>
            <Link
              href={`/accounting/ledger/${account.id}`}
              className="hover:border-l-primary-300 hover:bg-primary-50 hidden grid-cols-[0.5fr_2fr_1.2fr_1fr] items-center border-b border-l-4 border-neutral-100 border-l-transparent px-6 py-4 last:border-b-0 lg:grid"
            >
              <span className="text-sm font-mono text-neutral-400">{account.code}</span>
              <div className="flex flex-row items-center gap-x-2">
                <span className="text-sm font-medium text-neutral-500">{account.name}</span>
              </div>
              <div className="flex flex-row items-center">
                <AccountTypeBadge type={account.type} />
              </div>
              <span className={clsx("text-right text-sm font-semibold tabular-nums", account.balance < 0 ? "text-warning-500" : "text-neutral-500")}>{IDRFormatter.toCurrency(account.balance)}</span>
            </Link>
            <div className="lg:hidden">
              <MobileListCard
                href={`/accounting/ledger/${account.id}`}
                title={account.name}
                subtitle={account.code}
                trailingTop={
                  <span className={clsx("tabular-nums", account.balance < 0 ? "text-warning-500" : undefined)}>
                    {IDRFormatter.toCurrency(account.balance)}
                  </span>
                }
                trailingBottom={<AccountTypeBadge type={account.type} />}
              />
            </div>
          </Fragment>
        ))}
        {meta && meta.totalPages > 1 && (
          <TablePagination displayedCount={(accounts ?? []).length} meta={meta} currentPage={page} onPageChange={setPage} />
        )}
      </TableContainer>
    </div>
  );
}
