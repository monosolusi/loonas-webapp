"use client";

import { PaginationMeta } from "@/core/resources/paginated";
import { TableContainer } from "@/core/presentations/components/table/table-container";
import { TableHeader } from "@/core/presentations/components/table/table-header";
import { TablePagination } from "@/core/presentations/components/table/table-pagination";
import { CashEntryEntity } from "@/features/accounting/domain/entities/cash-entry";
import { CashEntryRow } from "@/app/(authenticated)/accounting/cash-entries/_components/cash-entry-row";

type CashEntriesTableProps = {
  entries: CashEntryEntity[];
  meta: PaginationMeta | null;
  page: number;
  onPageChange: (page: number) => void;
  isLoadingPage: boolean;
};

export function CashEntriesTable({ entries, meta, page, onPageChange, isLoadingPage }: CashEntriesTableProps) {
  return (
    <div className="flex flex-col gap-y-4" aria-busy={isLoadingPage}>
      <TableContainer>
        <TableHeader
          columns={[
            { label: "No. Referensi" },
            { label: "Arah" },
            { label: "Kategori" },
            { label: "Tanggal" },
            { label: "Jumlah", align: "right" },
            { label: "Status" },
            { label: "Aksi", align: "right" },
          ]}
          className="grid-cols-[1fr_0.8fr_1fr_0.9fr_1fr_1.1fr_56px]"
          hideOnMobile
        />
        {entries.map((entry) => (
          <CashEntryRow key={entry.id} entry={entry} />
        ))}
        {meta && meta.totalPages > 1 && (
          <TablePagination displayedCount={entries.length} meta={meta} currentPage={page} onPageChange={onPageChange} />
        )}
      </TableContainer>
    </div>
  );
}
