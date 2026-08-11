"use client";

import { useMemo, useState } from "react";
import { ListPageHeader } from "@/core/presentations/components/list-page-header";
import { TableContainer } from "@/core/presentations/components/table/table-container";
import { TableHeader } from "@/core/presentations/components/table/table-header";
import { TablePagination } from "@/core/presentations/components/table/table-pagination";
import { TableSearch } from "@/core/presentations/components/table/table-search";
import { TableToolbar } from "@/core/presentations/components/table/table-toolbar";
import { DEFAULT_PAGE_SIZE } from "@/core/utilities/pagination";
import { useListNegativeStockItems } from "@/features/inventory/presentations/hooks/use-list-negative-stock-items";
import { STOCK_ITEM_ROW_GRID } from "@/features/inventory/presentations/components/stock-item-table-row";
import { NegativeStockRow } from "@/app/(authenticated)/inventory/negative-stock/_components/negative-stock-row";

export function NegativeStockListImpl() {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");

  const { stockItems, meta, loading, error } = useListNegativeStockItems({ page, limit: DEFAULT_PAGE_SIZE });

  // The negative-stock endpoint has no server search — filter the loaded page
  // client-side by item name, variant name, or SKU.
  const filteredItems = useMemo(() => {
    if (!stockItems) return [];
    const query = search.trim().toLowerCase();
    if (!query) return stockItems;
    return stockItems.filter((item) => {
      return (
        item.itemName.toLowerCase().includes(query) ||
        (item.variantName?.toLowerCase().includes(query) ?? false) ||
        (item.sku?.toLowerCase().includes(query) ?? false)
      );
    });
  }, [stockItems, search]);

  const isFilteredEmpty = !loading && !error && (stockItems?.length ?? 0) > 0 && filteredItems.length === 0;

  const subtitle = loading ? "Memuat..." : error ? "" : meta ? `${meta.total} item` : "";

  const header = (
    <TableHeader
      columns={[
        { label: "Item" },
        { label: "Tipe" },
        { label: "SKU" },
        { label: "Stok Terkini", align: "right" },
        { label: "Stok Min.", align: "right" },
        { label: "Aksi" },
      ]}
      className={STOCK_ITEM_ROW_GRID}
      hideOnMobile
    />
  );

  return (
    <div className="flex flex-col gap-y-6">
      <ListPageHeader title="Stok Negatif" subtitle={subtitle} />

      <TableToolbar>
        <div />
        <TableSearch
          value={search}
          onChange={(v) => {
            setSearch(v);
            setPage(1);
          }}
          placeholder="Cari item, varian, atau SKU..."
        />
      </TableToolbar>

      <TableContainer
        loading={loading}
        error={!!error}
        empty={(stockItems?.length ?? 0) === 0 && !loading}
        emptyMessage="Belum ada stok negatif."
        filteredEmpty={isFilteredEmpty}
      >
        {header}
        {filteredItems.map((item) => (
          <NegativeStockRow key={item.id} stockItem={item} />
        ))}
        {meta && meta.totalPages > 1 && (
          <TablePagination
            displayedCount={filteredItems.length}
            meta={meta}
            currentPage={page}
            onPageChange={setPage}
            countLabel="item"
          />
        )}
      </TableContainer>
    </div>
  );
}
