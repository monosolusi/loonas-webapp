"use client";

import { useState } from "react";
import { TableContainer } from "@/core/presentations/components/table/table-container";
import { TableHeader } from "@/core/presentations/components/table/table-header";
import { TablePagination } from "@/core/presentations/components/table/table-pagination";
import { useListPosSales } from "@/features/pos/presentations/hooks/use-list-pos-sales";
import { PosSalesError } from "@/features/pos/presentations/components/pos-sales-error";
import { PosSalesTableRow } from "@/features/pos/presentations/components/pos-sales-table-row";

const PAGE_SIZE = 25;

const COLUMNS = [
  { label: "No. Struk" },
  { label: "Tanggal" },
  { label: "Metode" },
  { label: "Item" },
  { label: "Total", align: "right" as const },
  { label: "" },
];

const GRID_COLUMNS_CLASS = "grid-cols-[2fr_1.5fr_1fr_0.5fr_1fr_24px] gap-x-4";

type PosSalesListProps = {
  onSelectSale: (saleId: string) => void;
};

export function PosSalesList({ onSelectSale }: PosSalesListProps) {
  const [page, setPage] = useState(1);
  const state = useListPosSales({ page, limit: PAGE_SIZE });

  if (state.status === "error") return <PosSalesError error={state.error} />;

  const sales = state.status === "loaded" ? state.sales : [];
  const meta = state.status === "loaded" ? state.meta : null;

  return (
    <TableContainer
      loading={state.status === "loading"}
      empty={state.status === "loaded" && sales.length === 0}
      emptyMessage="Belum ada transaksi POS."
    >
      <TableHeader className={GRID_COLUMNS_CLASS} columns={COLUMNS} />
      {sales.map((sale) => (
        <PosSalesTableRow key={sale.id} sale={sale} onClick={onSelectSale} />
      ))}
      {meta && meta.totalPages > 1 && (
        <TablePagination displayedCount={sales.length} meta={meta} currentPage={page} onPageChange={setPage} />
      )}
    </TableContainer>
  );
}
