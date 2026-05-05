"use client";

import { useMemo, useState } from "react";
import { TableContainer } from "@/core/presentations/components/table/table-container";
import { TableHeader } from "@/core/presentations/components/table/table-header";
import { TablePagination } from "@/core/presentations/components/table/table-pagination";
import { StockItemEntity } from "@/features/inventory/domain/entities/stock-item";
import { StockItemType } from "@/features/inventory/domain/enums/stock-item-type";
import { useListStockItems } from "@/features/inventory/presentations/hooks/use-list-stock-items";
import { MinStockDialog } from "@/features/inventory/presentations/components/min-stock-dialog";
import { useRawMaterialMaster } from "@/app/(authenticated)/settings/raw-materials/_providers/raw-material-master-provider";
import { RawMaterialMasterRow } from "@/app/(authenticated)/settings/raw-materials/_components/raw-material-master-row";
import { RawMaterialEditDialog } from "@/app/(authenticated)/settings/raw-materials/_components/raw-material-edit-dialog";
import { RawMaterialDeleteDialog } from "@/app/(authenticated)/settings/raw-materials/_components/raw-material-delete-dialog";

const COLUMNS = [
  { label: "Nama" },
  { label: "Satuan" },
  { label: "Stok" },
  { label: "Min Stok" },
  { label: "" },
];

export function RawMaterialMasterTable() {
  const { rawMaterials, meta, loading, page, setPage } = useRawMaterialMaster();
  const stockResult = useListStockItems({ type: StockItemType.RAW_MATERIAL, limit: 100 });
  const [editingStockItem, setEditingStockItem] = useState<StockItemEntity | null>(null);

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
        <TableHeader className="grid-cols-[2fr_0.8fr_0.6fr_0.6fr_48px] gap-x-4" columns={COLUMNS} />
        {rawMaterials.map((item) => {
          const stockItem = stockMap.get(item.id) ?? null;
          return (
            <RawMaterialMasterRow
              key={item.id}
              item={item}
              stockItem={stockItem}
              onEditMinStock={stockItem ? () => setEditingStockItem(stockItem) : undefined}
            />
          );
        })}
        {meta && meta.totalPages > 1 && (
          <TablePagination displayedCount={rawMaterials.length} meta={meta} currentPage={page} onPageChange={setPage} />
        )}
      </TableContainer>

      <RawMaterialEditDialog />
      <RawMaterialDeleteDialog />
      <MinStockDialog stockItem={editingStockItem} onClose={() => setEditingStockItem(null)} />
    </>
  );
}
