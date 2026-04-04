"use client";

import { useMemo } from "react";
import { TableContainer } from "@/core/presentations/components/table/table-container";
import { TableHeader } from "@/core/presentations/components/table/table-header";
import { TablePagination } from "@/app/(authenticated)/invoices/_components/table-pagination";
import { StockItemEntity } from "@/features/inventory/domain/entities/stock-item";
import { StockItemType } from "@/features/inventory/domain/enums/stock-item-type";
import { useListStockItems } from "@/features/inventory/presentations/hooks/use-list-stock-items";
import { useRawMaterialMaster } from "@/app/(authenticated)/settings/raw-materials/_providers/raw-material-master-provider";
import { RawMaterialMasterRow, RAW_MATERIAL_GRID_COLS } from "@/app/(authenticated)/settings/raw-materials/_components/raw-material-master-row";
import { RawMaterialEditDialog } from "@/app/(authenticated)/settings/raw-materials/_components/raw-material-edit-dialog";
import { RawMaterialDeleteDialog } from "@/app/(authenticated)/settings/raw-materials/_components/raw-material-delete-dialog";

const COLUMNS = [
  { label: "Nama" },
  { label: "Satuan" },
  { label: "Stok" },
  { label: "Min Stok" },
  { label: "Aksi", align: "right" as const },
];

export function RawMaterialMasterTable() {
  const { rawMaterials, meta, loading, page, setPage } = useRawMaterialMaster();
  const stockResult = useListStockItems({ type: StockItemType.RAW_MATERIAL, limit: 100 });

  const stockMap = useMemo(() => {
    const map = new Map<string, StockItemEntity>();
    if (stockResult.stockItems) {
      for (const item of stockResult.stockItems) {
        if (item.rawMaterial) {
          map.set(item.rawMaterial.id, item);
        }
      }
    }
    return map;
  }, [stockResult.stockItems]);

  return (
    <>
      <TableContainer
        loading={loading}
        empty={rawMaterials.length === 0 && !loading}
        emptyMessage="Belum ada bahan baku. Tambahkan bahan baku pertama Anda."
      >
        <TableHeader className={RAW_MATERIAL_GRID_COLS} columns={COLUMNS} />
        {rawMaterials.map((item) => (
          <RawMaterialMasterRow key={item.id} item={item} stockItem={stockMap.get(item.id) ?? null} />
        ))}
        {meta && meta.totalPages > 1 && (
          <TablePagination displayedCount={rawMaterials.length} meta={meta} currentPage={page} onPageChange={setPage} />
        )}
      </TableContainer>

      <RawMaterialEditDialog />
      <RawMaterialDeleteDialog />
    </>
  );
}
