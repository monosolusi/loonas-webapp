"use client";

import { useState } from "react";
import Image from "next/image";
import { XMarkIcon } from "@heroicons/react/16/solid";
import { TextInput } from "@/core/presentations/components/text-inputs/text-input";
import { useDebounce } from "@/core/presentations/hooks/use-debounce";
import { IDRFormatter } from "@/core/utilities/currency/domain/formatters/idr-formatter";
import { InvoiceTableShell } from "@/app/(authenticated)/invoices/_components/invoice-table-shell";
import { TablePagination } from "@/app/(authenticated)/invoices/_components/table-pagination";
import { SummaryCard } from "@/app/(authenticated)/finance/_components/summary-card";
import { JournalRow } from "@/app/(authenticated)/finance/journals/_components/journal-row";
import { useListJournals } from "@/features/accounting/presentations/hooks/use-list-journals";

export function JournalListImpl() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search.trim(), 500);
  const searchQuery = debouncedSearch.length >= 2 ? debouncedSearch : undefined;

  const { journals, meta, totalDebit, totalCredit, loading, error } = useListJournals({ page, limit: 25, search: searchQuery });

  const selisih = totalDebit - totalCredit;
  const isBalanced = selisih === 0;

  const toolbar = (
    <div className="flex flex-row items-center justify-end">
      <div className="w-[280px]">
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
  );

  const header = (
    <div className="grid grid-cols-[1.5fr_3fr_1fr_1fr] border-b border-neutral-100 bg-neutral-50 px-6 py-3">
      <span className="text-xs leading-4 font-medium tracking-wider text-neutral-300 uppercase">Tanggal</span>
      <span className="text-xs leading-4 font-medium tracking-wider text-neutral-300 uppercase">Memo</span>
      <span className="text-right text-xs leading-4 font-medium tracking-wider text-neutral-300 uppercase">Total Debit</span>
      <span className="text-right text-xs leading-4 font-medium tracking-wider text-neutral-300 uppercase">Total Kredit</span>
    </div>
  );

  return (
    <div className="flex flex-col gap-y-6">
      <div className="flex flex-col gap-y-2">
        <h1 className="text-3xl leading-9 font-bold tracking-tight">Jurnal Umum</h1>
        <p className="leading-6 text-neutral-300">{meta ? `${meta.total} entri` : "Memuat..."}</p>
      </div>

      <div className="grid grid-cols-3 gap-4">
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

      <InvoiceTableShell toolbar={toolbar} header={header} loading={loading} error={!!error} empty={journals.length === 0 && !loading} emptyMessage="Belum ada jurnal.">
        {journals.map((journal) => (
          <JournalRow key={journal.id} journal={journal} />
        ))}
        {meta && meta.totalPages > 1 && (
          <TablePagination displayedCount={journals.length} meta={meta} currentPage={page} onPageChange={setPage} />
        )}
      </InvoiceTableShell>
    </div>
  );
}
