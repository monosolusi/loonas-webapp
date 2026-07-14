"use client";

import { useCallback, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { XMarkIcon } from "@heroicons/react/16/solid";
import { PlusIcon } from "@heroicons/react/24/outline";
import { DateTime } from "luxon";
import { TextInput } from "@/core/presentations/components/text-inputs/text-input";
import { PrimaryButton } from "@/core/presentations/components/buttons/primary-button";
import { DateRangePicker } from "@/core/presentations/components/date-range-picker";
import { useDebounce } from "@/core/presentations/hooks/use-debounce";
import { IDRFormatter } from "@/core/utilities/currency/domain/formatters/idr-formatter";
import { TableContainer } from "@/core/presentations/components/table/table-container";
import { TableHeader } from "@/core/presentations/components/table/table-header";
import { TablePagination } from "@/core/presentations/components/table/table-pagination";
import { DEFAULT_PAGE_SIZE } from "@/core/utilities/pagination";
import { SummaryCard } from "@/core/presentations/components/summary-card";
import { JournalRow } from "@/app/(authenticated)/finance/journals/_components/journal-row";
import { useJournalRange } from "@/app/(authenticated)/finance/journals/_providers/journal-range-provider";
import { useListJournals } from "@/features/accounting/presentations/hooks/use-list-journals";

function isoToDate(iso: string): Date {
  return DateTime.fromISO(iso, { zone: "Asia/Jakarta" }).toJSDate();
}

function dateToIso(date: Date): string {
  return DateTime.fromJSDate(date).setZone("Asia/Jakarta").toFormat("yyyy-MM-dd");
}

export function JournalListImpl() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search.trim(), 500);
  const searchQuery = debouncedSearch.length >= 2 ? debouncedSearch : undefined;

  const { from, to, setRange } = useJournalRange();

  const pickerValue = useMemo(() => ({ from: isoToDate(from), to: isoToDate(to) }), [from, to]);

  const handlePickerChange = useCallback(
    (range: { from: Date | undefined; to: Date | undefined }) => {
      if (!range.from || !range.to) return;
      setRange({ from: dateToIso(range.from), to: dateToIso(range.to) });
      setPage(1);
    },
    [setRange, setPage],
  );

  const { journals, meta, totalDebit, totalCredit, loading, error } = useListJournals({
    page,
    limit: DEFAULT_PAGE_SIZE,
    search: searchQuery,
    dateFrom: from,
    dateTo: to,
  });

  const selisih = totalDebit - totalCredit;
  const isBalanced = selisih === 0;

  const toolbar = (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <Link href="/finance/journals/new">
        <PrimaryButton label="Jurnal Baru" leftIcon={<PlusIcon className="size-4" />} />
      </Link>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-x-3">
        <DateRangePicker value={pickerValue} onChange={handlePickerChange} maxSpanDays={365} disableFutureDates={false} />
        <div className="w-full sm:w-[280px]">
          <TextInput
            label=""
            placeholder="Cari memo..."
            value={search}
            onChange={setSearch}
            leftIcon={<Image src="/assets/images/search-icon-neutral-400-w20-h20.svg" alt="" width={20} height={20} />}
            rightIcon={search ? (
              <button type="button" onClick={() => setSearch("")} className="flex items-center justify-center text-neutral-200 hover:text-neutral-400">
                <XMarkIcon className="size-4" />
              </button>
            ) : undefined}
          />
        </div>
      </div>
    </div>
  );

  const header = (
    <TableHeader
      columns={[
        { label: "Tanggal" },
        { label: "Memo" },
        { label: "Total Debit", align: "right" },
        { label: "Total Kredit", align: "right" },
      ]}
      className="grid-cols-[1.5fr_3fr_1fr_1fr]"
      hideOnMobile
    />
  );

  return (
    <div className="flex flex-col gap-y-6">
      <div className="flex flex-col gap-y-2">
        <h1 className="text-3xl leading-9 font-bold tracking-tight">Jurnal Umum</h1>
        <p className="leading-6 text-neutral-300">{meta ? `${meta.total} entri` : "Memuat..."}</p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <SummaryCard label="Total Debit" value={IDRFormatter.toCurrency(totalDebit)} variant="primary" loading={loading} subtitle="Halaman ini" />
        <SummaryCard label="Total Kredit" value={IDRFormatter.toCurrency(totalCredit)} variant="primary" loading={loading} subtitle="Halaman ini" />
        <SummaryCard
          label="Selisih"
          value={IDRFormatter.toCurrency(Math.abs(selisih))}
          variant={isBalanced ? "success" : "warning"}
          subtitle={isBalanced ? "Seimbang · Halaman ini" : "Tidak seimbang · Halaman ini"}
          loading={loading}
        />
      </div>

      {toolbar}

      <TableContainer loading={loading} error={!!error} empty={(journals ?? []).length === 0 && !loading} emptyMessage="Belum ada jurnal.">
        {header}
        {(journals ?? []).map((journal) => (
          <JournalRow key={journal.id} journal={journal} />
        ))}
        {meta && meta.totalPages > 1 && (
          <TablePagination displayedCount={(journals ?? []).length} meta={meta} currentPage={page} onPageChange={setPage} />
        )}
      </TableContainer>
    </div>
  );
}
