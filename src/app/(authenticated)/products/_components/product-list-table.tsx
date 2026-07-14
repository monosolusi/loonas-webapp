"use client";

import { useMemo } from "react";
import { TableContainer } from "@/core/presentations/components/table/table-container";
import { TableHeader } from "@/core/presentations/components/table/table-header";
import { TablePagination } from "@/core/presentations/components/table/table-pagination";
import { StockItemEntity } from "@/features/inventory/domain/entities/stock-item";
import { StockItemType } from "@/features/inventory/domain/enums/stock-item-type";
import { useListStockItems } from "@/features/inventory/presentations/hooks/use-list-stock-items";
import { useProductList } from "@/app/(authenticated)/products/_providers/product-list-provider";
import { ProductListRow } from "@/app/(authenticated)/products/_components/product-list-row";

const COLUMNS = [
  { label: "Produk" },
  { label: "Harga", align: "right" as const },
  { label: "Stok", align: "right" as const },
  { label: "Kategori" },
  { label: "Tipe" },
  { label: "Status" },
];

export function ProductListTable() {
  const { products, meta, loading, error, page, setPage } = useProductList();
  const stockResult = useListStockItems({ type: StockItemType.FINISHED_GOODS, limit: 100 });

  const stockMap = useMemo(() => {
    const map = new Map<string, StockItemEntity>();
    if (stockResult.stockItems) {
      for (const item of stockResult.stockItems) {
        if (item.variant) {
          map.set(item.variant.id, item);
        }
      }
    }
    return map;
  }, [stockResult.stockItems]);

  return (
    <TableContainer
      loading={loading}
      error={error}
      empty={products.length === 0 && !loading}
      emptyMessage="Belum ada produk. Tambahkan produk pertama Anda."
    >
      <TableHeader className="grid-cols-[2fr_1fr_0.7fr_0.6fr_0.8fr_0.8fr] gap-x-4" columns={COLUMNS} hideOnMobile />
      {products.map((product) => (
        <ProductListRow key={product.id} product={product} stockMap={stockMap} />
      ))}
      {meta && meta.totalPages > 1 && (
        <TablePagination displayedCount={products.length} meta={meta} currentPage={page} onPageChange={setPage} />
      )}
    </TableContainer>
  );
}
