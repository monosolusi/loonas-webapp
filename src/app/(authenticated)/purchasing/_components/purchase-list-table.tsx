"use client";

import { TableContainer } from "@/core/presentations/components/table/table-container";
import { TableHeader } from "@/core/presentations/components/table/table-header";
import { TablePagination } from "@/core/presentations/components/table/table-pagination";
import { usePurchaseList } from "@/app/(authenticated)/purchasing/_providers/purchase-list-provider";
import { PurchaseListRow } from "@/app/(authenticated)/purchasing/_components/purchase-list-row";

const COLUMNS = [
  { label: "Tanggal" },
  { label: "Catatan" },
  { label: "Item" },
  { label: "Total", align: "right" as const },
  { label: "" },
];

export function PurchaseListTable() {
  const { purchases, meta, loading, page, setPage } = usePurchaseList();

  return (
    <TableContainer
      loading={loading}
      empty={purchases.length === 0 && !loading}
      emptyMessage="Belum ada pembelian. Catat pembelian pertama Anda."
    >
      <TableHeader className="grid-cols-[1fr_1.5fr_0.6fr_1fr_48px] gap-x-4" columns={COLUMNS} />
      {purchases.map((purchase) => (
        <PurchaseListRow key={purchase.id} purchase={purchase} />
      ))}
      {meta && meta.totalPages > 1 && (
        <TablePagination displayedCount={purchases.length} meta={meta} currentPage={page} onPageChange={setPage} />
      )}
    </TableContainer>
  );
}
