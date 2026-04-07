"use client";

import { TableContainer } from "@/core/presentations/components/table/table-container";
import { TableHeader } from "@/core/presentations/components/table/table-header";
import { TablePagination } from "@/app/(authenticated)/invoices/_components/table-pagination";
import { useProductionList } from "@/app/(authenticated)/productions/_providers/production-list-provider";
import { ProductionListRow } from "@/app/(authenticated)/productions/_components/production-list-row";

const COLUMNS = [
  { label: "Tanggal" },
  { label: "Produk" },
  { label: "Qty", align: "right" as const },
  { label: "Biaya Material", align: "right" as const },
  { label: "" },
];

export function ProductionListTable() {
  const { records, meta, loading, page, setPage } = useProductionList();

  return (
    <TableContainer
      loading={loading}
      empty={records.length === 0 && !loading}
      emptyMessage="Belum ada catatan produksi. Catat produksi pertama Anda."
    >
      <TableHeader className="grid-cols-[1fr_1.5fr_0.6fr_1fr_48px] gap-x-4" columns={COLUMNS} />
      {records.map((record) => (
        <ProductionListRow key={record.id} record={record} />
      ))}
      {meta && meta.totalPages > 1 && (
        <TablePagination displayedCount={records.length} meta={meta} currentPage={page} onPageChange={setPage} />
      )}
    </TableContainer>
  );
}
